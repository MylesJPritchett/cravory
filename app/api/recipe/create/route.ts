import { NextResponse } from "next/server";
import db from "@/db";
import { recipe, recipeFood, food, InsertRecipeFood } from "@/db/schema";
import {
  Recipe,
  Food,
  Ingredient,
  RecipeWithFoods,
  APIResponse
} from '@/app/types';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data: Omit<RecipeWithFoods, 'id'> = await request.json();

    // Generate a public key for the food/recipe
    const publicFoodKey = generatePublicKey();

    // Safely handle method array
    const formattedMethod = Array.isArray(data.method)
      ? data.method
        .map((step: string, index: number) => `${index + 1}. ${step}`)
        .join("\n")
      : data.method || '';

    // Calculate total nutritional values
    const totalNutrition = calculateTotalNutrition(data.ingredients);

    // Prepare food insert values
    const foodInsertValues = {
      name: data.name,
      description: data.description || null,
      public_food_key: publicFoodKey,
      derivation: "Recipe Derived",

      // Nutritional values
      energy: totalNutrition.energy ? String(totalNutrition.energy) : null,
      energy_without_fiber: totalNutrition.energy ? String(totalNutrition.energy) : null,
      water: null,
      protein: totalNutrition.protein ? String(totalNutrition.protein) : null,
      fat: totalNutrition.fat ? String(totalNutrition.fat) : null,
      carbohydrates: totalNutrition.carbohydrates ? String(totalNutrition.carbohydrates) : null,
      fiber: totalNutrition.fiber ? String(totalNutrition.fiber) : null,

      // Other optional fields
      sugars: null,
      added_sugars: null,
      saturated_fat: null,
      monounsaturated_fat: null,
      polyunsaturated_fat: null,
      trans_fat: null,
      cholesterol: null,
      sodium: null,
      potassium: null,
      calcium: null,
      iron: null,
      magnesium: null,
      zinc: null,
      phosphorus: null,
      vitamin_a: null,
      vitamin_c: null,
      vitamin_d: null,
      vitamin_e: null,
      vitamin_b12: null,
      folate: null,
      caffeine: null,
      alcohol: null,

      // Boolean flags
      is_vegan: null,
      is_vegetarian: null,
    };

    // Create the food entry first
    const newFood: Food[] = await db
      .insert(food)
      .values(foodInsertValues)
      .returning();


    // Prepare recipe insert values
    const recipeInsertValues = {
      name: data.name,
      description: data.description,
      method: formattedMethod,
      cooking_time: data.cooking_time || null,
      servings: data.servings || null,
      public_food_key: publicFoodKey,
      total_weight_change: calculateTotalWeight(data.ingredients),
    };

    // Create the recipe entry
    const newRecipe: Recipe[] = await db
      .insert(recipe)
      .values(recipeInsertValues)
      .returning();

    // Add ingredients to the recipe
    const recipeId = newRecipe[0].id;
    console.log("ingredients:", data.ingredients);

    if (data.ingredients.length > 0) {
      const recipeFoods: InsertRecipeFood[] = data.ingredients.map((ingredient: Ingredient) => ({
        recipe_id: recipeId,
        food_id: ingredient.id,
        food_weight: String(ingredient.weight),
        retention_factor_id: null,
      }));

      await db.insert(recipeFood).values(recipeFoods);

    }

    return NextResponse.json({
      recipe: newRecipe[0],
      food: newFood[0],
    });

  } catch (error) {
    console.error("Error creating recipe:", error);
    const errorResponse: APIResponse<null> = {
      error: error instanceof Error ? error.message : "Internal Server Error"
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

function generatePublicKey(): string {
  return Math.random().toString(36).substring(2, 15);
}

function calculateTotalNutrition(ingredients: Ingredient[]): {
  protein: number;
  fat: number;
  carbohydrates: number;
  energy: number;
  fiber: number;
} {
  return ingredients.reduce((totals, ingredient) => {
    const weight = Number(ingredient.weight) || 0;
    const weightRatio = weight / 100; // Assuming nutrition values are per 100g

    return {
      protein: (totals.protein || 0) + (Number(ingredient.protein) || 0) * weightRatio,
      fat: (totals.fat || 0) + (Number(ingredient.fat) || 0) * weightRatio,
      carbohydrates: (totals.carbohydrates || 0) + (Number(ingredient.carbohydrates) || 0) * weightRatio,
      energy: (totals.energy || 0) + (Number(ingredient.energy) || 0) * weightRatio,
      fiber: (totals.fiber || 0) + (Number(ingredient.fiber) || 0) * weightRatio,
    };
  }, {
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    energy: 0,
    fiber: 0,
  });
}

function calculateTotalWeight(ingredients: Ingredient[]): string {
  const totalWeight = ingredients.reduce((total, ingredient) => total + (Number(ingredient.weight) || 0), 0);
  return totalWeight.toFixed(2); // Convert to string with 2 decimal places
}
