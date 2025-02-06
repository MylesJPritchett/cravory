'use client';

import { RecipeWithFoods } from '@/app/types';
import Link from 'next/link';

interface RecipeDisplayProps {
  recipe: RecipeWithFoods;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  // Calculate total nutritional values
  const totalNutrition = recipe.ingredients.reduce(
    (acc, ingredient) => {
      const weightRatio = ingredient.weight / 100; // Convert weight to 100g ratio
      return {
        protein: acc.protein + (Number(ingredient.protein) || 0) * weightRatio,
        fat: acc.fat + (Number(ingredient.fat) || 0) * weightRatio,
        carbohydrates: acc.carbohydrates + (Number(ingredient.carbohydrates) || 0) * weightRatio,
        energy: acc.energy + (Number(ingredient.energy) || 0) * weightRatio,
        fiber: acc.fiber + (Number(ingredient.fiber) || 0) * weightRatio,
      };
    },
    { protein: 0, fat: 0, carbohydrates: 0, energy: 0, fiber: 0 }
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">RECIPE: {recipe.name}</h1>

      {recipe.description && (
        <p className="mt-4 text-gray-600">{recipe.description}</p>
      )}

      {/* Link to corresponding recipe */}
      {recipe.corresponding_food && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Food for this Recipe</h2>
          <Link href={`/food/${recipe.corresponding_food.id}`} className="text-blue-500">
            {recipe.corresponding_food.name}
          </Link>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
        <div className="grid gap-4">
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="border rounded p-3">
              <Link href={`/food/${ingredient.id}`} className="text-blue-500">
                {ingredient.name}
              </Link>
              <div className="text-sm text-gray-600">
                Weight: {ingredient.weight}g
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Display Total Nutritional Information */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Total Nutritional Information</h2>
        <div className="space-y-2">
          <p><strong>Protein:</strong> {totalNutrition.protein.toFixed(2)}g</p>
          <p><strong>Fat:</strong> {totalNutrition.fat.toFixed(2)}g</p>
          <p><strong>Carbohydrates:</strong> {totalNutrition.carbohydrates.toFixed(2)}g</p>
          <p><strong>Energy:</strong> {totalNutrition.energy.toFixed(2)}kJ / {(Number(totalNutrition.energy) * 0.239006).toFixed(2)} kcal</p>
          <p><strong>Fiber:</strong> {totalNutrition.fiber.toFixed(2)}g</p>
        </div>
      </div>

      {recipe.method && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Method</h2>
          <p className="whitespace-pre-wrap">{recipe.method}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        {recipe.cooking_time && (
          <div>
            <span className="font-medium">Cooking Time: </span>
            {recipe.cooking_time} minutes
          </div>
        )}
        {recipe.servings && (
          <div>
            <span className="font-medium">Servings: </span>
            {recipe.servings}
          </div>
        )}
      </div>
    </div>
  );
}
