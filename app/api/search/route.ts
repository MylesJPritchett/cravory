import { NextResponse } from "next/server";
import db from "@/db"; // Import your database configuration
import { recipe, ingredient } from "@/db/schema"; // Adjust based on your schema
import { sql } from "drizzle-orm"; // Import raw SQL if needed for advanced queries

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json([]);
  }

  // Search for recipes using fuzzy search with pg_trgm (similarity)
  const recipes = await db
    .select()
    .from(recipe)
    .where(sql`similarity(${recipe.name}, ${query}) > 0.3`) // Adjust similarity threshold

  // Optionally, search ingredients using fuzzy search with pg_trgm
  const ingredients = await db
    .select()
    .from(ingredient)
    .where(sql`similarity(${ingredient.name}, ${query}) > 0.3`) // Adjust similarity threshold

  // Combine or separate the results depending on your use case
  return NextResponse.json({
    recipes,
    ingredients,
  });
}
