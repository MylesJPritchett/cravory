import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { food } from "@/db/schema";



export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const foodData = await db
      .select({
        id: food.id,
        name: food.name,
        description: food.description,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        energy: food.energy,
        fiber: food.fiber,
      })
      .from(food)
      .where(eq(food.id, parseInt(id)))
      .limit(1);

    if (!foodData || foodData.length === 0) {
      return NextResponse.json(
        { error: "Food not found" },
        { status: 404 }
      );
    }


    return NextResponse.json(foodData[0]);
  } catch (error) {
    console.error("Error fetching food:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


