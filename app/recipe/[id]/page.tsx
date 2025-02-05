// app/recipe/[id]/page.tsx
import { Recipe } from '@/db/schema';
import RecipeDisplay from './RecipeDisplay';

async function getRecipe(id: string) {
  // Use absolute URL or relative URL with proper base
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/recipe/${id}`, {
    // Add cache options if needed
    cache: 'no-store', // or 'force-cache' for static data
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recipe: ${response.statusText}`);
  }

  return response.json();
}

export default async function RecipePage({
  params
}: {
  params: { id: string }
}) {
  // Ensure params.id exists before using it
  if (!params?.id) {
    throw new Error('Recipe ID is required');
  }

  const recipe = await getRecipe(params.id);

  return <RecipeDisplay recipe={recipe} />;
}
