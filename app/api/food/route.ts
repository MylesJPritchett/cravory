import { NextResponse } from "next/server";
import db from "@/db";
import { food } from "@/db/schema";

export async function GET() {
  try {
    // Fetch all food details
    const foodsData = await db
      .select({
        id: food.id,
        name: food.name,
        description: food.description,
        public_food_key: food.public_food_key,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        energy: food.energy,
        fiber: food.fiber,
      })
      .from(food);

    if (!foodsData.length) {
      return NextResponse.json(
        { error: "No foods found" },
        { status: 404 }
      );
    }

    return NextResponse.json(foodsData);
  } catch (error) {
    console.error("Error fetching foods:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
