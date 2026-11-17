-- ====================================================================
-- AthleteCare Complete PostgreSQL Database Architecture & Seed Dump
-- Target: Supabase Cloud PostgreSQL 15 (ap-south-1 Mumbai)
-- ====================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'medical', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE injury_severity AS ENUM ('mild', 'moderate', 'severe');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE injury_status AS ENUM ('reported', 'diagnosed', 'rehabilitating', 'cleared');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CORE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'athlete',
    primary_sport TEXT,
    playing_position TEXT,
    date_of_birth DATE,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    emergency_contact TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. WELLNESS RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.wellness_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sleep_hours NUMERIC NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    water_intake_ml INTEGER NOT NULL CHECK (water_intake_ml >= 0 AND water_intake_ml <= 10000),
    mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
    fatigue_level INTEGER NOT NULL CHECK (fatigue_level >= 1 AND fatigue_level <= 10),
    soreness_level INTEGER NOT NULL CHECK (soreness_level >= 1 AND soreness_level <= 10),
    soreness_location TEXT,
    notes TEXT,
    readiness_score NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_athlete_date UNIQUE (athlete_id, record_date)
);

-- 4. NUTRITION RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.nutrition_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    water_intake_ml INTEGER NOT NULL CHECK (water_intake_ml >= 0),
    meals_logged JSONB,
    calories_consumed INTEGER,
    protein_grams NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_athlete_nutrition_date UNIQUE (athlete_id, record_date)
);

-- 5. INJURY RECORDS & REHABILITATION
CREATE TABLE IF NOT EXISTS public.injury_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES public.profiles(id),
    body_location TEXT NOT NULL,
    severity injury_severity NOT NULL,
    status injury_status NOT NULL DEFAULT 'reported',
    diagnosis TEXT,
    clinical_notes TEXT,
    reported_date DATE NOT NULL DEFAULT CURRENT_DATE,
    cleared_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.rehabilitation_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    injury_id UUID NOT NULL REFERENCES public.injury_records(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    target_sets INTEGER NOT NULL,
    target_reps INTEGER NOT NULL,
    frequency_per_week INTEGER,
    instructions TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injury_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rehabilitation_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. POSTGRES TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'athlete'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-confirmation trigger to prevent "Email not confirmed" in development/demo
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NULL THEN
        NEW.email_confirmed_at := now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_before_insert ON auth.users;
CREATE TRIGGER on_auth_user_before_insert
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();
