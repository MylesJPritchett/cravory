'use client';

import { RecipeWithFoods } from '@/app/types';

interface RecipeDisplayProps {
  recipe: RecipeWithFoods;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>

      {recipe.description && (
        <p className="mt-4 text-gray-600">{recipe.description}</p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
        <div className="grid gap-4">
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="border rounded p-3">
              <div className="font-medium">{ingredient.name}</div>
              <div className="text-sm text-gray-600">
                Weight: {ingredient.weight}g
              </div>
            </div>
          ))}
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
