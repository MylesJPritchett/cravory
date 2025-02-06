// app/food/[id]/page.tsx
import FoodDisplay from './FoodDisplay';

async function getFood(id: string) {
  // Use absolute URL or relative URL with proper base
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/food/${id}`, {
    // Add cache options if needed
    cache: 'no-store', // or 'force-cache' for static data
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch food: ${response.statusText}`);
  }

  return response.json();
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams.id) {
    throw new Error('Food ID is required');
  }

  const food = await getFood(resolvedParams.id);
  return <FoodDisplay food={food} />;
}
