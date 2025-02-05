import { NextResponse } from "next/server";
import db from "@/db";
import { recipe, food } from "@/db/schema";
import { ilike } from "drizzle-orm";

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

    // Fetch matching recipes and ingredients concurrently
    const [recipes, foods] = await Promise.all([
      db.select().from(recipe).where(ilike(recipe.name, `%${query}%`)),
      db.select().from(food).where(ilike(food.name, `%${query}%`)),
    ]);

    console.log(`Found ${recipes.length} recipes and ${foods.length} ingredients`);

    return NextResponse.json({ recipes, foods });

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
