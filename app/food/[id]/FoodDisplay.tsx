'use client';

import { Food } from '@/app/types';
import Link from 'next/link';
import { useState } from 'react';

interface FoodDisplayProps {
  food: Food & {
    corresponding_recipe?: { id: number; name: string };
    recipes: { id: number; name: string }[];
  };
}

export default function FoodDisplay({ food }: FoodDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'recipes'>('overview');

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Food Header */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">{food.name}</h1>
          
          {food.description && (
            <p className="mt-2 text-gray-200 italic">{food.description}</p>
          )}
          
          {/* Recipe Relationship Banner */}
          {food.corresponding_recipe && (
            <div className="mt-4 bg-indigo-800 p-3 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>This food can be prepared using: </span>
              <Link href={`/recipe/${food.corresponding_recipe.id}`} className="ml-2 text-blue-300 hover:text-blue-200 underline">
                {food.corresponding_recipe.name} recipe
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
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-green-500 text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'nutrition' ? 'border-b-2 border-green-500 text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Nutrition
          </button>
          {food.recipes.length > 0 && (
            <button 
              onClick={() => setActiveTab('recipes')}
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'recipes' ? 'border-b-2 border-green-500 text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Used In <span className="ml-1 bg-gray-800 px-1.5 py-0.5 rounded-full text-xs">{food.recipes.length}</span>
            </button>
          )}
        </nav>
      </div>
      
      {/* Content Area */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Food Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Name</h3>
                  <p className="text-white">{food.name}</p>
                </div>
                
                {food.description && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Description</h3>
                    <p className="text-white">{food.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Type</h3>
                    <p className="text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {food.corresponding_recipe ? 'Prepared Food' : 'Base Ingredient'}
                    </p>
                  </div>
                  
                  {food.corresponding_recipe && (
                    <div>
                      <h3 className="text-gray-400 text-sm">Preparation</h3>
                      <Link href={`/recipe/${food.corresponding_recipe.id}`} className="text-blue-400 hover:text-blue-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        View Recipe
                      </Link>
                    </div>
                  )}
                </div>
                
                {food.recipes.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Used In</h3>
                    <p className="text-white">{food.recipes.length} {food.recipes.length === 1 ? 'recipe' : 'recipes'}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Nutrition Summary
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {Number(food.protein).toFixed(1)}g
                  </div>
                  <div className="text-gray-400 text-sm">Protein</div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {Number(food.fat).toFixed(1)}g
                  </div>
                  <div className="text-gray-400 text-sm">Fat</div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {Number(food.carbohydrates).toFixed(1)}g
                  </div>
                  <div className="text-gray-400 text-sm">Carbs</div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {(Number(food.energy) * 0.239006).toFixed(0)}
                </div>
                <div className="text-gray-400 text-sm">kcal per 100g</div>
                <div className="text-gray-400 text-sm mt-1">({Number(food.energy).toFixed(0)} kJ)</div>
              </div>
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
              Nutritional Information (per 100g)
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
                        <span className="text-gray-300">{Number(food.protein).toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (Number(food.protein) / (Number(food.protein) + Number(food.fat) + Number(food.carbohydrates))) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Fat */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Fat</span>
                        <span className="text-gray-300">{Number(food.fat).toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (Number(food.fat) / (Number(food.protein) + Number(food.fat) + Number(food.carbohydrates))) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Carbohydrates */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Carbohydrates</span>
                        <span className="text-gray-300">{Number(food.carbohydrates).toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (Number(food.carbohydrates) / (Number(food.protein) + Number(food.fat) + Number(food.carbohydrates))) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Fiber */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Fiber</span>
                        <span className="text-gray-300">{Number(food.fiber).toFixed(2)}g</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (Number(food.fiber) / Number(food.carbohydrates)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Energy</h3>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {(Number(food.energy) * 0.239006).toFixed(0)}
                    </div>
                    <div className="text-gray-400 text-sm">kcal</div>
                    <div className="text-gray-400 text-sm mt-2">({Number(food.energy).toFixed(0)} kJ)</div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="text-gray-300">Per 100g serving</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recipes Tab */}
        {activeTab === 'recipes' && food.recipes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Recipes Using This Ingredient
              <span className="ml-2 text-sm bg-gray-800 px-2 py-0.5 rounded-full">{food.recipes.length}</span>
            </h2>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {food.recipes.map((recipe) => (
                <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-yellow-500 hover:bg-gray-750 transition-all cursor-pointer">
                    <div className="flex items-center">
                      <div className="bg-yellow-900 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{recipe.name}</h3>
                        <p className="text-xs text-gray-400">Prepared Dish with Recipe</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
