"use client";
import { useState } from "react";

export default function Search() {
  // State for the search query
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]); // To store search results

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    // Fetch the search results from the backend
    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    setResults(data); // Set the results from the search
  };

  return (
    <div>
      <h1>Recipe and Ingredient Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for recipes or ingredients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Display search results */}
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
