'use client';

import { Food } from '@/app/types';
import Link from 'next/link';

interface FoodDisplayProps {
  food: Food & {
    corresponding_recipe?: { id: number; name: string };
    recipes: { id: number; name: string }[];
  };
}

export default function FoodDisplay({ food }: FoodDisplayProps) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">FOOD: {food.name}</h1>
      {food.description && <p className="mt-4">{food.description}</p>}

      {/* Link to corresponding recipe */}
      {food.corresponding_recipe && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Recipe for this food</h2>
          <Link href={`/recipe/${food.corresponding_recipe.id}`} className="text-blue-500">
            {food.corresponding_recipe.name}
          </Link>
        </div>
      )}

      {/* List of recipes using this food */}
      <h2 className="text-xl font-semibold mt-6">Recipes that Use This</h2>
      <div className="grid gap-4">
        {food.recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded p-3">
            <Link href={`/recipe/${recipe.id}`} className="text-blue-500">
              {recipe.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Nutritional Info */}
      <h2 className="text-xl font-semibold mt-6">Nutritional Information (per 100 grams)</h2>
      <div className="mt-4 space-y-2">
        <p><strong>Protein:</strong> {Number(food.protein).toFixed(2)}g</p>
        <p><strong>Fat:</strong> {Number(food.fat).toFixed(2)}g</p>
        <p><strong>Carbohydrates:</strong> {Number(food.carbohydrates).toFixed(2)}g</p>
        <p><strong>Energy:</strong> {Number(food.energy).toFixed(2)}kJ / {(Number(food.energy) * 0.239006).toFixed(2)} kcal</p>
        <p><strong>Fiber:</strong> {Number(food.fiber).toFixed(2)}g</p>
      </div>
    </div>
  );
}
