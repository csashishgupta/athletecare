import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const sport = searchParams.get("sport");

    const filePath = path.join(process.cwd(), "src/data/collegiate_wellness_dataset.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ data: [], total: 0, page, limit });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    let records = JSON.parse(fileContent);

    if (sport) {
      records = records.filter(
        (r: { sport?: string }) => r.sport?.toLowerCase() === sport.toLowerCase()
      );
    }

    const total = records.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = records.slice(startIndex, startIndex + limit);

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
      { error: "Failed to load wellness dataset" },
      { status: 500 }
    );
  }
}
