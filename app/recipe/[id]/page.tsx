// app/recipe/[id]/page.tsx
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
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams.id) {
    throw new Error('Recipe ID is required');
  }

  const recipe = await getRecipe(resolvedParams.id);
  return <RecipeDisplay recipe={recipe} />;
}
