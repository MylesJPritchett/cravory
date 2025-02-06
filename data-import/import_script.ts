import db from '../db/index';
import * as XLSX from 'xlsx';
import {
  food,
  classification,
  recipe,
  recipeFood,
  type InsertFood,
  type InsertRecipeFood,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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
  'Ingredient  Weight (g)': number; // has 2 spaces for some reason
  'Retention Factor ID': number;
}

interface NutrientData {
  'Public Food Key': string;
  'Energy with dietary fibre, equated  (kJ)': string;
  'Energy, without dietary fibre, equated  (kJ)': string;
  'Moisture (water)  (g)': string;
  'Protein  (g)': string;
  'Fat, total  (g)': string;
  'Total dietary fibre  (g)': string;
  'Total sugars (g)': string;
  'Added sugars (g)': string;
  'Total saturated fatty acids, equated  (g)': string;
  'Total monounsaturated fatty acids, equated  (g)': string;
  'Total polyunsaturated fatty acids, equated  (g)': string;
  'Total trans fatty acids, imputed  (g)': string;
  'Cholesterol  (mg)': string;
  'Sodium (Na)  (mg)': string;
  'Potassium (K)  (mg)': string;
  'Calcium (Ca)  (mg)': string;
  'Iron (Fe)  (mg)': string;
  'Magnesium (Mg)  (mg)': string;
  'Zinc (Zn)  (mg)': string;
  'Phosphorus (P)  (mg)': string;
  'Vitamin A retinol equivalents  (ug)': string;
  'Vitamin C  (mg)': string;
  'Vitamin D3 equivalents  (ug)': string;
  'Vitamin E  (mg)': string;
  'Cobalamin (B12)  (ug)': string;
  'Total folates  (ug)': string;
  'Caffeine  (mg)': string;
  'Alcohol  (g)': string;
  'Available carbohydrate, without sugar alcohols  (g)': string;
}

async function importData() {
  try {
    // Read Excel files
    const foodDetailsFile = XLSX.readFile('Food_Details.xlsx');
    const recipeFile = XLSX.readFile('Recipe.xlsx');
    const nutrientFile = XLSX.readFile('Nutrient.xlsx');

    // Parse Excel data
    const foodDetailsData = XLSX.utils.sheet_to_json<FoodDetails>(foodDetailsFile.Sheets[foodDetailsFile.SheetNames[0]]);
    const recipeData = XLSX.utils.sheet_to_json<RecipeData>(recipeFile.Sheets[recipeFile.SheetNames[0]]);
    const nutrientData = XLSX.utils.sheet_to_json<NutrientData>(nutrientFile.Sheets[nutrientFile.SheetNames[1]]);

    // Preload existing data
    const classificationMap = new Map<string, number>();
    const foodMap = await preloadFoods();
    const recipeMap = await preloadRecipes();


    // Import classifications
    await importClassifications(foodDetailsData, classificationMap);

    // Import foods
    await importFoods(foodDetailsData, classificationMap, foodMap);

    // Import recipes
    await importRecipes(recipeData, recipeMap);

    // Import recipe-food relationships
    await importRecipeFoodRelations(recipeData, recipeMap, foodMap);

    // Import nutrient data
    await importNutrientData(nutrientData, foodMap);

    console.log('Data import completed.');
  } catch (error) {
    console.error('Error during data import:', error);
  }
}

// Helper functions

async function preloadFoods() {
  const existingFoods = await db.select({ id: food.id, key: food.public_food_key }).from(food);
  return new Map(existingFoods.map((f) => [f.key, f.id]));
}

async function preloadRecipes() {
  const existingRecipes = await db.select({ id: recipe.id, key: recipe.public_food_key }).from(recipe);
  return new Map(existingRecipes.map((r) => [r.key, r.id]));
}

async function importClassifications(data: FoodDetails[], classificationMap: Map<string, number>) {
  for (const row of data) {
    if (!classificationMap.has(row.Classification)) {
      const classificationRecord = await db
        .insert(classification)
        .values({ name: row.Classification_Name })
        .onConflictDoNothing()
        .returning({ id: classification.id });

      if (classificationRecord.length) {
        classificationMap.set(row.Classification, classificationRecord[0].id);
      }
    }
  }
  console.log('Classifications imported.');
}

async function importFoods(data: FoodDetails[], classificationMap: Map<string, number>, foodMap: Map<string, number>) {
  for (const row of data) {
    if (!foodMap.has(row['Public Food Key'])) {
      const foodInsert: InsertFood = {
        public_food_key: row['Public Food Key'],
        name: row['Food Name'],
        description: row['Food Description'] ?? null,
        classification_id: classificationMap.get(row.Classification) ?? null,
      };

      const foodRecord = await db
        .insert(food)
        .values(foodInsert)
        .onConflictDoNothing()
        .returning({ id: food.id });

      if (foodRecord.length) {
        foodMap.set(foodInsert.public_food_key, foodRecord[0].id);
      }
    }
  }
  console.log('Foods imported.');
}

async function importRecipes(data: RecipeData[], recipeMap: Map<string, number>) {
  for (const row of data) {
    if (!recipeMap.has(row['Public Food Key'])) {
      const recipeInsert = {
        public_food_key: row['Public Food Key'],
        name: row['Food Name'],
      };

      const recipeRecord = await db
        .insert(recipe)
        .values(recipeInsert)
        .onConflictDoNothing()
        .returning({ id: recipe.id });

      if (recipeRecord.length) {
        recipeMap.set(recipeInsert.public_food_key, recipeRecord[0].id);
      }
    }
  }
  console.log('Recipes imported.');
}

async function importRecipeFoodRelations(
  data: RecipeData[],
  recipeMap: Map<string, number>,
  foodMap: Map<string, number>
) {
  for (const row of data) {
    const recipeId = recipeMap.get(row['Public Food Key']);
    const foodId = foodMap.get(row['Ingredient Public Food Key']);
    const foodWeightRaw = row['Ingredient  Weight (g)']?.toString().trim();
    const foodWeight = foodWeightRaw === '' ? null : parseFloat(foodWeightRaw);

    if (!recipeId || !foodId || foodWeight === null || isNaN(foodWeight)) {
      console.warn(`Skipping row due to missing or invalid data:`, row);
      continue;
    }

    // Check if the relationship already exists
    const existingRelation = await db
      .select()
      .from(recipeFood)
      .where(
        and(
          eq(recipeFood.recipe_id, recipeId),
          eq(recipeFood.food_id, foodId)
        )
      )
      .limit(1);

    if (existingRelation.length > 0) {
      console.log(`Skipping duplicate recipe-food relationship:`, row);
      continue;
    }

    const recipeFoodInsert: InsertRecipeFood = {
      recipe_id: recipeId,
      food_id: foodId,
      food_weight: foodWeight.toString(),
    };

    await db.insert(recipeFood).values(recipeFoodInsert).onConflictDoNothing();
  }
  console.log('Recipe-food relationships imported.');
}

const normalizeKey = (key: string): string => {
  return key
    .replace(/\r\n/g, '')
    .replace(/,/g, '') // Add this line
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/ /g, '_');
};

const parseDecimal = (value: any): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  // Convert the value to a string if it isn't already
  const stringValue = typeof value === 'string' ? value : String(value);

  // Trim and parse the string value
  const trimmedValue = stringValue.trim();
  const parsed = parseFloat(trimmedValue);

  return isNaN(parsed) ? null : parsed.toString();
};

async function importNutrientData(data: NutrientData[], foodMap: Map<string, number>) {
  let processedRows = 0;
  let skippedRows = 0;

  for (const row of data) {

    // Normalize the keys in the row data
    const normalizedRow: Record<string, any> = {};
    for (const key in row) {
      const normalizedKey = normalizeKey(key);
      console.log(`Original: "${key}" -> Normalized: "${normalizedKey}"`);
      normalizedRow[normalizedKey] = row[key as keyof NutrientData];
    }

    const foodId = foodMap.get(normalizedRow['public_food_key']);
    if (!foodId) {
      console.warn(`Skipping nutrient data for missing food ID:`, row);
      skippedRows++;
      continue;
    }

    try {
      await db
        .update(food)
        .set({
          energy: parseDecimal(normalizedRow['energy_with_dietary_fibre_equated_(kj)']),
          energy_without_fiber: parseDecimal(normalizedRow['energy_without_dietary_fibre_equated_(kj)']),
          water: parseDecimal(normalizedRow['moisture_(water)_(g)']),
          protein: parseDecimal(normalizedRow['protein_(g)']),
          fat: parseDecimal(normalizedRow['fat_total_(g)']),
          carbohydrates: parseDecimal(normalizedRow['available_carbohydrate_without_sugar_alcohols_(g)']),
          fiber: parseDecimal(normalizedRow['total_dietary_fibre_(g)']),
          sugars: parseDecimal(normalizedRow['total_sugars_(g)']),
          added_sugars: parseDecimal(normalizedRow['added_sugars_(g)']),
          saturated_fat: parseDecimal(normalizedRow['total_saturated_fatty_acids_equated_(g)']),
          monounsaturated_fat: parseDecimal(normalizedRow['total_monounsaturated_fatty_acids_equated_(g)']),
          polyunsaturated_fat: parseDecimal(normalizedRow['total_polyunsaturated_fatty_acids_equated_(g)']),
          trans_fat: parseDecimal(normalizedRow['total_trans_fatty_acids_imputed_(g)']),
          cholesterol: parseDecimal(normalizedRow['cholesterol_(mg)']),
          sodium: parseDecimal(normalizedRow['sodium_(na)_(mg)']),
          potassium: parseDecimal(normalizedRow['potassium_(k)_(mg)']),
          calcium: parseDecimal(normalizedRow['calcium_(ca)_(mg)']),
          iron: parseDecimal(normalizedRow['iron_(fe)_(mg)']),
          magnesium: parseDecimal(normalizedRow['magnesium_(mg)_(mg)']),
          zinc: parseDecimal(normalizedRow['zinc_(zn)_(mg)']),
          phosphorus: parseDecimal(normalizedRow['phosphorus_(p)_(mg)']),
          vitamin_a: parseDecimal(normalizedRow['vitamin_a_retinol_equivalents_(ug)']),
          vitamin_c: parseDecimal(normalizedRow['vitamin_c_(mg)']),
          vitamin_d: parseDecimal(normalizedRow['vitamin_d3_equivalents_(ug)']),
          vitamin_e: parseDecimal(normalizedRow['vitamin_e_(mg)']),
          vitamin_b12: parseDecimal(normalizedRow['cobalamin_(b12)_(ug)']),
          folate: parseDecimal(normalizedRow['total_folates_(ug)']),
          caffeine: parseDecimal(normalizedRow['caffeine_(mg)']),
          alcohol: parseDecimal(normalizedRow['alcohol_(g)']),
        })
        .where(eq(food.id, foodId));

      processedRows++;
    } catch (error) {
      console.error(`Error updating food ID ${foodId}:`, error);
    }
  }

  console.log(`Nutrient data import complete. Processed: ${processedRows}, Skipped: ${skippedRows}`);
} importData().catch(console.error);
