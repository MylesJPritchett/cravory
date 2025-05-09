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

  const handleSearch = useCallback(async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    setResults(data);
  }, [query]);

  // Effect to trigger search when query changes
  useEffect(() => {
    // Add a small delay to avoid too many requests while typing
    const debounceTimeout = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults({ recipes: [], foods: [] });
      }
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [query, handleSearch]);

  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      {/* Sticky Search Box */}
      <div className="w-full bg-gray-800 shadow-md flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-2">Recipe and Food Search</h1>
        <div className="flex flex-col items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Search for recipes or foods..."
            value={query}
            className="bg-gray-700 text-white p-2 rounded w-full"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-8 w-full max-w-6xl flex justify-between space-x-4">
        {/* Recipes Column */}
        {results.recipes.length > 0 && (
          <div className="w-1/2">
            <h2 className="text-xl font-semibold">Recipes</h2>
            <ul className="list-disc list-inside">
              {results.recipes.map((recipe) => (
                <li key={recipe.id}>
                  <Link href={`/recipe/${recipe.id}`} className="text-blue-500">{recipe.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Foods Column */}
        {results.foods.length > 0 && (
          <div className="w-1/2">
            <h2 className="text-xl font-semibold">Foods</h2>
            <ul className="list-disc list-inside">
              {results.foods.map((food) => (
                <li key={food.id}>
                  <Link href={`/food/${food.id}`} className="text-blue-500">{food.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No results found */}
        {results.recipes.length === 0 && results.foods.length === 0 && (
          <p className="mt-4 text-gray-500">No results found. Want to <Link href="/recipe/create">Create a Recipe </Link >or <Link href="/food/create">Create a Food</Link>?</p>

        )}
      </div>
    </div>
  );
}
