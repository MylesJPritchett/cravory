// types/index.ts
import { type Recipe as DrizzleRecipe, type Food as DrizzleFood } from '@/db/schema';

export interface Ingredient extends Pick<DrizzleFood,
  'id' |
  'name' |
  'description' |
  'protein' |
  'fat' |
  'carbohydrates' |
  'energy' |
  'fiber'
> {
  weight: number;
}

export interface RecipeWithFoods extends Omit<DrizzleRecipe, 'public_food_key'> {
  ingredients: Ingredient[];
}

export interface RecipeResponse {
  data?: RecipeWithFoods;
  error?: string;
}
