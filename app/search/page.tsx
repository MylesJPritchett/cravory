"use client";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

interface SearchResults {
  recipes: { id: number; name: string }[];
  foods: { id: number; name: string }[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ recipes: [], foods: [] });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    
    if (!query.trim()) {
      setResults({ recipes: [], foods: [] });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // Effect to trigger search when query changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults({ recipes: [], foods: [] });
      }
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [query, handleSearch]);

  // Count total results
  const totalResults = results.recipes.length + results.foods.length;

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gray-900 text-white">
      {/* Sticky Search Box */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-purple-900 shadow-lg py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Food & Recipe Database</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for ingredients or prepared dishes..."
              value={query}
              className="bg-gray-800 text-white p-3 rounded-lg w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isLoading && (
              <svg 
                className="animate-spin h-5 w-5 absolute right-3 top-3.5 text-blue-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          
          <div className="mt-3 text-sm text-gray-300 text-center">
            <span>Looking for something specific? Try searching for ingredients or complete dishes</span>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="w-full max-w-4xl mx-auto p-6">
        {query.trim() && (
          <div className="mb-6 text-gray-400">
            {isLoading ? (
              <p>Searching...</p>
            ) : (
              <p>Found {totalResults} {totalResults === 1 ? 'result' : 'results'} for &quot;{query}&quot;</p>
            )}
          </div>
        )}

        {/* Combined Results with Visual Distinction */}
        {totalResults > 0 && (
          <div className="space-y-8">
            {/* Base Ingredients Section */}
            {results.foods.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Base Ingredients
                  <span className="ml-2 text-sm bg-gray-800 px-2 py-0.5 rounded-full">{results.foods.length}</span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {results.foods.map((food) => (
                    <Link href={`/food/${food.id}`} key={food.id}>
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-all cursor-pointer">
                        <div className="flex items-center">
                          <div className="bg-green-900 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{food.name}</h3>
                            <p className="text-xs text-gray-400">Base Ingredient</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Prepared Dishes Section */}
            {results.recipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Prepared Dishes
                  <span className="ml-2 text-sm bg-gray-800 px-2 py-0.5 rounded-full">{results.recipes.length}</span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {results.recipes.map((recipe) => (
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
        )}

        {/* No results found */}
        {query.trim() && !isLoading && totalResults === 0 && (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">Try different keywords or create a new entry</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/recipe/create" className="bg-yellow-800 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Recipe
              </Link>
              <Link href="/food/create" className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Food
              </Link>
            </div>
          </div>
        )}

        {/* Initial state - no search yet */}
        {!query.trim() && (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-300 mb-2">Search for ingredients or dishes</h3>
              <p className="text-gray-500 mb-6">Find base ingredients or prepared dishes with recipes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-green-400 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Base Ingredients
                  </h4>
                  <p className="text-sm text-gray-400">Individual food items with nutritional data</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-yellow-400 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Prepared Dishes
                  </h4>
                  <p className="text-sm text-gray-400">Recipes that combine ingredients into new foods</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
