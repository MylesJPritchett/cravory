import db from "@/db";
import { recipes } from "@/db/schema";
import { NextResponse } from "next/server";

// Handle GET requests (fetch all recipes)
export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).all();
    return NextResponse.json({ recipes: allRecipes });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch recipes" },


      { status: 500 }
    );
  }
}

// Handle POST requests (create a new recipe)
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    // Insert a new recipe
    const newRecipe = await db.insert(recipes).values({ name }).run();

    return NextResponse.json(
      { message: "recipe created", recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
