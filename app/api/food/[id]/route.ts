import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { food, recipe, recipeFood } from "@/db/schema";

// interface FoodWithRecipes {
//   id: number;
//   name: string;
//   description: string | null;
//   protein: string | null;
//   fat: string | null;
//   carbohydrates: string | null;
//   energy: string | null;
//   fiber: string | null;
//   corresponding_recipe: Recipe | null;
//   recipes: {
//     id: number;
//     name: string;
//     description: string | null;
//     cooking_time: number | null;
//     servings: number | null;
//   }[];
// }

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;


    // Fetch food details
    const foodData = await db
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
      .from(food)
      .where(eq(food.id, parseInt(id)))
      .limit(1);

    if (!foodData.length) {
      return NextResponse.json(
        { error: "Food not found" },
        { status: 404 }
      );
    }

    // Fetch corresponding recipe using public_food_key
    const correspondingRecipe = await db
      .select({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
      })
      .from(recipe)
      .where(eq(recipe.public_food_key, foodData[0].public_food_key))
      .limit(1);

    // Fetch recipes that use this food as an ingredient
    const recipesUsingFood = await db
      .select({
        id: recipe.id,
        name: recipe.name,
      })
      .from(recipeFood)
      .innerJoin(recipe, eq(recipeFood.recipe_id, recipe.id))
      .where(eq(recipeFood.food_id, parseInt(id)));

    return NextResponse.json({
      ...foodData[0],
      corresponding_recipe: correspondingRecipe?.[0] || null, // Include recipe if found
      recipes: recipesUsingFood, // List of recipes using this food
    });
  } catch (error) {
    console.error("Error fetching food:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
