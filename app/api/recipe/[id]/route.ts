import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { recipe, food, recipeFood } from "@/db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // First get the recipe
    const recipeData = await db
      .select({
        id: recipe.id,
        public_food_key: recipe.public_food_key,
        name: recipe.name,
        description: recipe.description,
        method: recipe.method,
        cooking_time: recipe.cooking_time,
        servings: recipe.servings,
        total_weight_change: recipe.total_weight_change,
        created_at: recipe.created_at,
      })
      .from(recipe)
      .where(eq(recipe.id, parseInt(id)))
      .limit(1);

    if (!recipeData || recipeData.length === 0) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }


    // Fetch corresponding recipe using public_food_key
    const correspondingFood = await db
      .select({
        id: food.id,
        name: food.name,
        description: food.description,
      })
      .from(food)
      .where(eq(food.public_food_key, recipeData[0].public_food_key))
      .limit(1);


    // Then get all foods for this recipe
    const ingredients = await db
      .select({
        id: food.id,
        name: food.name,
        description: food.description,
        weight: recipeFood.food_weight,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        energy: food.energy,
        fiber: food.fiber,
      })
      .from(recipeFood)
      .innerJoin(food, eq(recipeFood.food_id, food.id))
      .where(eq(recipeFood.recipe_id, parseInt(id)));


    // Convert numeric fields to numbers
    const formattedIngredients = ingredients.map((ingredient) => ({
      ...ingredient,
      weight: Number(ingredient.weight),
      protein: ingredient.protein !== null ? Number(ingredient.protein) : null,
      fat: ingredient.fat !== null ? Number(ingredient.fat) : null,
      carbohydrates: ingredient.carbohydrates !== null ? Number(ingredient.carbohydrates) : null,
      energy: ingredient.energy !== null ? Number(ingredient.energy) : null,
      fiber: ingredient.fiber !== null ? Number(ingredient.fiber) : null,
    }));

    return NextResponse.json({
      ...recipeData[0],
      corresponding_food: correspondingFood?.[0] || null,
      ingredients: formattedIngredients,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


