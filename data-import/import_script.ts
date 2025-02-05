import db from '../db/index';
import * as XLSX from 'xlsx';
import {
  food, classification, measure, retentionFactor, recipe, recipeFood,
  type InsertFood, type InsertClassification,
  type InsertMeasure, type InsertRetentionFactor, type InsertRecipeFood
} from '@/db/schema';

// Define interfaces for the Excel data
interface FoodDetails {
  'Public Food Key': string;
  'Classification': string;
  'Classification_Name': string;
  'Food Name': string;
  'Food Description': string;
  'Derivation': string;
  'Sampling Details': string;
}

interface RecipeData {
  'Public Food Key': string; // Recipe key
  'Food Name': string;
  'Ingredient Public Food Key': string;
  'Ingredient Name': string;
  'Ingredient  Weight (g)': number; // has 2 spaces for some shitty reason
  'Retention Factor ID': number;
}

async function importData() {
  const foodDetailsFile = XLSX.readFile('Food_Details.xlsx');
  const recipeFile = XLSX.readFile('Recipe.xlsx');

  const foodDetailsData = XLSX.utils.sheet_to_json<FoodDetails>(foodDetailsFile.Sheets[foodDetailsFile.SheetNames[0]]);
  const recipeData = XLSX.utils.sheet_to_json<RecipeData>(recipeFile.Sheets[recipeFile.SheetNames[0]]);

  const classificationMap = new Map<string, number>();



  // Preload existing foods
  const existingFoods = await db.select({ id: food.id, key: food.public_food_key }).from(food);
  const foodMap = new Map(existingFoods.map(f => [f.key, f.id]));

  console.log("Preloaded foodMap:", foodMap);

  // Preload existing recipes
  const existingRecipes = await db.select({ id: recipe.id, key: recipe.public_food_key }).from(recipe);
  const recipeMap = new Map(existingRecipes.map(r => [r.key, r.id]));

  console.log("Preloaded recipeMap:", recipeMap);

  // Import classifications
  for (const row of foodDetailsData) {
    if (!classificationMap.has(row.Classification)) {
      const classificationRecord = await db.insert(classification)
        .values({ name: row.Classification_Name })
        .onConflictDoNothing()
        .returning({ id: classification.id });

      if (classificationRecord.length) {
        classificationMap.set(row.Classification, classificationRecord[0].id);
      }
    }
  }

  console.log("classifications done")


  // Insert new foods if they don't exist
  for (const row of foodDetailsData) {
    if (!foodMap.has(row['Public Food Key'])) {
      const foodInsert: InsertFood = {
        public_food_key: row['Public Food Key'],
        name: row['Food Name'],
        description: row['Food Description'] ?? null,
        classification_id: classificationMap.get(row.Classification) ?? null,
      };

      const foodRecord = await db.insert(food)
        .values(foodInsert)
        .onConflictDoNothing()
        .returning({ id: food.id });

      if (foodRecord.length) {
        foodMap.set(foodInsert.public_food_key, foodRecord[0].id);
      }
    }
  }

  // Insert new recipes if they don't exist
  for (const row of recipeData) {
    if (!recipeMap.has(row['Public Food Key'])) {
      const recipeInsert = {
        public_food_key: row['Public Food Key'],
        name: row['Food Name'],
      };

      const recipeRecord = await db.insert(recipe)
        .values(recipeInsert)
        .onConflictDoNothing()
        .returning({ id: recipe.id });

      if (recipeRecord.length) {
        recipeMap.set(recipeInsert.public_food_key, recipeRecord[0].id);
      }
    }
  }
  // Import recipe-food relationships
  //
  for (const row of recipeData) {
    const recipeId = recipeMap.get(row["Public Food Key"]);
    const foodId = foodMap.get(row["Ingredient Public Food Key"]);

    // Raw weight from the row
    const foodWeightRaw = row["Ingredient  Weight (g)"]?.toString().trim();

    console.log('Raw Food Weight:', foodWeightRaw); // Log the raw value

    const foodWeight = foodWeightRaw === "" ? null : parseFloat(foodWeightRaw);

    console.log('Parsed Food Weight:', foodWeight); // Log the parsed value

    if (!recipeId || !foodId) {
      console.warn(`Skipping row due to missing recipe or food ID:`, row);
      continue;
    }

    if (foodWeight === null || isNaN(foodWeight)) {
      console.warn(`Skipping row due to invalid food weight:`, row);
      continue;
    }

    console.log(`Inserting recipe-food link: Recipe ID ${recipeId}, Food ID ${foodId}, Weight ${foodWeight}`);
    const recipeFoodInsert: InsertRecipeFood = {
      recipe_id: recipeId,
      food_id: foodId,
      food_weight: foodWeight.toString(), // Ensure it's a string
    };

    await db.insert(recipeFood)
      .values(recipeFoodInsert)
      .onConflictDoNothing();
  }

  console.log('Data import completed.');
}

importData().catch(console.error);
