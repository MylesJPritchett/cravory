import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";  // Use uuid library for generating a unique ID
import db from "@/db";
import { food } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Generate a unique public_food_key using UUID
    let publicFoodKey = uuidv4();

    // Ensure that the generated public_food_key is unique
    let existingFood = await db
      .select()
      .from(food)
      .where(eq(food.public_food_key, publicFoodKey))
      .limit(1);

    // If the key exists, generate a new one
    while (existingFood.length > 0) {
      publicFoodKey = uuidv4();
      existingFood = await db
        .select()
        .from(food)
        .where(eq(food.public_food_key, publicFoodKey))
        .limit(1);
    }

    const newFood = await db
      .insert(food)
      .values({
        name: body.name,
        description: body.description || null,
        public_food_key: publicFoodKey,  // Use the unique public_food_key
        protein: body.protein || 0,
        fat: body.fat || 0,
        carbohydrates: body.carbohydrates || 0,
        energy: body.energy || 0,
        fiber: body.fiber || 0,
      })
      .returning();

    return NextResponse.json(newFood[0], { status: 201 });
  } catch (error) {
    console.error("Error creating food:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
