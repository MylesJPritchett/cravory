'use client';

import { Food } from '@/app/types';

interface FoodDisplayProps {
  food: Food;
}

export default function FoodDisplay({ food }: FoodDisplayProps) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{food.name}</h1>

      {food.description && (
        <p className="mt-4 ">{food.description}</p>
      )}

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
