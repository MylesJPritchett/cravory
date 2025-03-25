import { NextResponse } from "next/server";
import db from "@/db";
import { recipe, recipeFood, food } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Generate a public key for the food/recipe
    const publicFoodKey = generatePublicKey();

    // Calculate total nutritional values
    const totalNutrition = calculateTotalNutrition(data.ingredients);

    // Create the food entry first
    const newFood = await db
      .insert(food)
      .values({
        name: data.name,
        description: data.description || null,
        public_food_key: publicFoodKey,
        derivation: "Recipe Derived",

        // Nutritional values
        energy: totalNutrition.energy,
        energy_without_fiber: totalNutrition.energy, // Simplified, might need adjustment
        water: null, // Cannot reliably calculate from ingredients
        protein: totalNutrition.protein,
        fat: totalNutrition.fat,
        carbohydrates: totalNutrition.carbohydrates,
        fiber: totalNutrition.fiber,

        // Other optional fields can be set to null or default values
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
        is_vegan: null, // You might want to derive this from ingredients
        is_vegetarian: null, // You might want to derive this from ingredients
      })
      .returning();

    // Convert method array to a numbered string
    const formattedMethod = data.method
      .map((step: string, index: number) => `${index + 1}. ${step}`)
      .join("\n");

    // Create the recipe entry
    const newRecipe = await db
      .insert(recipe)
      .values({
        name: data.name,
        description: data.description,
        method: formattedMethod,
        cooking_time: data.cooking_time,
        servings: data.servings,
        public_food_key: publicFoodKey,
        total_weight_change: calculateTotalWeight(data.ingredients),
      })
      .returning();

    // Add ingredients to the recipe
    const recipeId = newRecipe[0].id;
    const recipeFoods = data.ingredients.map((ingredient: any) => ({
      recipe_id: recipeId,
      food_id: ingredient.foodId,
      food_weight: ingredient.weight,
    }));

    await db.insert(recipeFood).values(recipeFoods);

    return NextResponse.json({
      recipe: newRecipe[0],
      food: newFood[0],
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function generatePublicKey() {
  return Math.random().toString(36).substring(2, 15);
}

function calculateTotalNutrition(ingredients: any[]) {
  return ingredients.reduce((totals, ingredient) => {
    const weight = ingredient.weight || 0;
    const weightRatio = weight / 100; // Assuming nutrition values are per 100g

    return {
      protein: (totals.protein || 0) + (ingredient.protein || 0) * weightRatio,
      fat: (totals.fat || 0) + (ingredient.fat || 0) * weightRatio,
      carbohydrates: (totals.carbohydrates || 0) + (ingredient.carbohydrates || 0) * weightRatio,
      energy: (totals.energy || 0) + (ingredient.energy || 0) * weightRatio,
      fiber: (totals.fiber || 0) + (ingredient.fiber || 0) * weightRatio,
    };
  }, {
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    energy: 0,
    fiber: 0,
  });
}

function calculateTotalWeight(ingredients: any[]) {
  return ingredients.reduce((total, ingredient) => total + (ingredient.weight || 0), 0);
}
