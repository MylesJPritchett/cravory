// app/types.ts
import {
  type Recipe as DrizzleRecipe,
  type Food as DrizzleFood,
  type RecipeFood as DrizzleRecipeFood
} from '@/db/schema';

// Base types from schema
export type Recipe = DrizzleRecipe;
export type Food = DrizzleFood;
export type RecipeFood = DrizzleRecipeFood;

// Extended types for the ingredient
export interface Ingredient extends Pick<Food,
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
  notes?: string;
}

// Extended type for recipe with ingredients
export interface RecipeWithFoods extends Omit<Recipe, 'public_food_key'> {
  corresponding_food: Food;
  ingredients: Ingredient[];
}

export interface FoodWithRecipes extends Omit<Food, 'public_food_key'> {
  recipes: Recipe[];
}
// API response types
export interface APIResponse<T> {
  data?: T;
  error?: string;
}

// Route parameter types
export interface RecipeParams {
  params: {
    id: string;
  };
}

// Component prop types
export interface RecipeDisplayProps {
  recipe: RecipeWithFoods;
}
