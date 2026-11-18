import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const mealType = searchParams.get("type");

    const filePath = path.join(process.cwd(), "src/data/sports_nutrition_compendium.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ data: [], total: 0, page, limit });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    let meals = JSON.parse(fileContent);

    if (mealType) {
      meals = meals.filter(
        (m: { meal_type?: string }) => m.meal_type?.toLowerCase() === mealType.toLowerCase()
      );
    }

    const total = meals.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = meals.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load nutrition compendium" },
      { status: 500 }
    );
  }
}
