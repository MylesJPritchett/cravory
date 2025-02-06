import { NextResponse } from "next/server";
import db from "@/db";
import { recipe, food } from "@/db/schema";
import { sql } from "drizzle-orm"; // Assuming you're using Drizzle ORM's `sql` template tag

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim().toLowerCase() || "";

    console.log("Search query:", query || "No query provided");

    if (!query) {
      // Fetch all recipes and ingredients in parallel
      const [recipes, foods] = await Promise.all([
        db.select().from(recipe),
        db.select().from(food),
      ]);

      return NextResponse.json({ recipes, foods });
    }

    // Fuzzy search using PostgreSQL's pg_trgm similarity and order by closest match
    const [recipes, foods] = await Promise.all([
      db.select().from(recipe).where(
        sql`similarity(lower(${recipe.name}), lower(${query})) > 0.1`
      ).orderBy(
        sql`similarity(lower(${recipe.name}), lower(${query})) DESC` // Order by highest similarity first
      ),
      db.select().from(food).where(
        sql`similarity(lower(${food.name}), lower(${query})) > 0.1`
      ).orderBy(
        sql`similarity(lower(${food.name}), lower(${query})) DESC` // Same here
      ),
    ]);

    console.log(`Found ${recipes.length} recipes and ${foods.length} ingredients`);

    return NextResponse.json({ recipes, foods });

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
