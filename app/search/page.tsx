"use client";
import { useState, useEffect, useCallback } from "react";
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
  }, [query]); // Add query as dependency since it's used inside

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);


  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      {/* Sticky Search Box */}
      <div className="w-full bg-gray-800 shadow-md flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-2">Recipe and food Search</h1>
        <form onSubmit={handleSearch} className="flex flex-col items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Search for recipes or foods..."
            value={query}
            className="bg-gray-700 text-white p-2 rounded w-full mb-2"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        </form>
      </div>

      {/* Search Results */}
      <div className="mt-8 w-full max-w-md">
        {results.recipes.length > 0 && (
          <div className="mt-4">
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

        {results.foods.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">foods</h2>
            <ul className="list-disc list-inside">
              {results.foods.map((food) => (
                <li key={food.id}>{food.name}</li>
              ))}
            </ul>
          </div>
        )}

        {results.recipes.length === 0 && results.foods.length === 0 && (
          <p className="mt-4 text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
