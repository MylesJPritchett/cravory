'use client';

import { RecipeWithFoods } from '@/app/types';
import Link from 'next/link';
import { useState } from 'react';

interface RecipeDisplayProps {
  recipe: RecipeWithFoods;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'method' | 'nutrition'>('overview');
  
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

  // Separate ingredients into base ingredients and prepared ingredients (from other recipes)
  const baseIngredients = recipe.ingredients.filter(ingredient => !('corresponding_recipe' in ingredient));
  const preparedIngredients = recipe.ingredients.filter(ingredient => 'corresponding_recipe' in ingredient);

  // Calculate total weight
  const totalWeight = recipe.ingredients.reduce((total, ingredient) => total + Number(ingredient.weight || 0), 0);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Recipe Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
          
          {recipe.description && (
            <p className="mt-2 text-gray-200 italic">{recipe.description}</p>
          )}
          
          <div className="mt-4 flex flex-wrap gap-4">
            {recipe.cooking_time && (
              <div className="bg-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.cooking_time} min
              </div>
            )}
            
            {recipe.servings && (
              <div className="bg-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {recipe.servings} servings
              </div>
            )}
            
            <div className="bg-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              {totalWeight.toFixed(0)}g total
            </div>
          </div>
          
          {/* Food Relationship Banner */}
          {recipe.corresponding_food && (
            <div className="mt-4 bg-indigo-800 p-3 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>This recipe creates a food item: </span>
              <Link href={`/food/${recipe.corresponding_food.id}`} className="ml-2 text-blue-300 hover:text-blue-200 underline">
                {recipe.corresponding_food.name}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 max-w-4xl mx-auto">
        <nav className="flex">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Overview
          </button>
          {recipe.method && (
            <button 
              onClick={() => setActiveTab('method')}
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'method' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Method
            </button>
          )}
          <button 
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'nutrition' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Nutrition
          </button>
        </nav>
      </div>
      
      {/* Content Area */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredients
              </h2>
              
              {/* Base Ingredients Section */}
              {baseIngredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Base Ingredients</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {baseIngredients.map((ingredient) => (
                      <div key={ingredient.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex justify-between items-start">
                          <Link href={`/food/${ingredient.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                            {ingredient.name}
                          </Link>
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                            {ingredient.weight}g
                          </span>
                        </div>
                        {ingredient.notes && (
                          <p className="text-sm text-gray-400 mt-1">{ingredient.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Prepared Ingredients Section */}
              {preparedIngredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Prepared Ingredients (from other recipes)
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {preparedIngredients.map((ingredient) => (
                      <div key={ingredient.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/food/${ingredient.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                              {ingredient.name}
                            </Link>
                            {('corresponding_recipe' in ingredient) && ingredient.corresponding_recipe && (
                              <div className="mt-1">
                                <Link 
                                  href={`/recipe/${ingredient.corresponding_recipe.id}`} 
                                  className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  View recipe: {ingredient.corresponding_recipe.name}
                                </Link>
                              </div>
                            )}
                          </div>
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                            {ingredient.weight}g
                          </span>
                        </div>
                        {ingredient.notes && (
                          <p className="text-sm text-gray-400 mt-1">{ingredient.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Method Tab */}
        {activeTab === 'method' && recipe.method && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Preparation Method
            </h2>
            
            {/* Ingredients Summary */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-center text-gray-300">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="font-medium">{ingredient.weight}g</span>
                    <span className="mx-2 text-gray-500">of</span>
                    <span>{ingredient.name}</span>
                    {ingredient.notes && <span className="ml-1 text-gray-500 italic">({ingredient.notes})</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Cooking Steps */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium mb-3 text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Cooking Steps
              </h3>
              
              {recipe.method.includes('\n') ? (
                <ol className="space-y-4 text-gray-300 leading-relaxed">
                  {recipe.method.split('\n').filter(step => step.trim()).map((step, index) => (
                    <li key={index} className="pl-6 relative">
                      <span className="absolute left-0 top-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-900 text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="whitespace-pre-wrap">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{recipe.method}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Nutritional Information
            </h2>
            
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Macronutrients</h3>
                  <div className="space-y-4">
                    {/* Protein */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Protein</span>
                        <span className="text-gray-300">{totalNutrition.protein.toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (totalNutrition.protein / (totalNutrition.protein + totalNutrition.fat + totalNutrition.carbohydrates)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Fat */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Fat</span>
                        <span className="text-gray-300">{totalNutrition.fat.toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (totalNutrition.fat / (totalNutrition.protein + totalNutrition.fat + totalNutrition.carbohydrates)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Carbohydrates */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Carbohydrates</span>
                        <span className="text-gray-300">{totalNutrition.carbohydrates.toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (totalNutrition.carbohydrates / (totalNutrition.protein + totalNutrition.fat + totalNutrition.carbohydrates)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Fiber */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Fiber</span>
                        <span className="text-gray-300">{totalNutrition.fiber.toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (totalNutrition.fiber / totalNutrition.carbohydrates) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Energy</h3>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {(Number(totalNutrition.energy) * 0.239006).toFixed(0)}
                    </div>
                    <div className="text-gray-400 text-sm">kcal</div>
                    <div className="text-gray-400 text-sm mt-2">({totalNutrition.energy.toFixed(0)} kJ)</div>
                    
                    {recipe.servings && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="text-gray-300">Per serving:</div>
                        <div className="text-xl font-semibold">
                          {(Number(totalNutrition.energy) * 0.239006 / recipe.servings).toFixed(0)} kcal
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
