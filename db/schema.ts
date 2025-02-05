import { pgTable, text, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
});

export const account = pgTable("account", {
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationToken = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});

// Classification table
export const classification = pgTable("classification", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('classification_id_seq')`),
  name: text("name"),
});

export type Classification = InferSelectModel<typeof classification>;
export type InsertClassification = InferInsertModel<typeof classification>;

// Food table
export const food = pgTable("food", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('food_id_seq')`),
  public_food_key: text("public_food_key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  derivation: text("derivation"),
  sampling_details: text("sampling_details"),
  classification_id: integer("classification_id").references(() => classification.id),

  // Core nutritional values
  energy: decimal("energy"),
  energy_without_fiber: decimal("energy_without_fiber"),
  water: decimal("water"),
  protein: decimal("protein"),
  fat: decimal("fat"),
  carbohydrates: decimal("carbohydrates"),
  fiber: decimal("fiber"),

  // Detailed nutrients
  sugars: decimal("sugars"),
  added_sugars: decimal("added_sugars"),
  saturated_fat: decimal("saturated_fat"),
  monounsaturated_fat: decimal("monounsaturated_fat"),
  polyunsaturated_fat: decimal("polyunsaturated_fat"),
  trans_fat: decimal("trans_fat"),
  cholesterol: decimal("cholesterol"),

  // Minerals
  sodium: decimal("sodium"),
  potassium: decimal("potassium"),
  calcium: decimal("calcium"),
  iron: decimal("iron"),
  magnesium: decimal("magnesium"),
  zinc: decimal("zinc"),
  phosphorus: decimal("phosphorus"),

  // Vitamins
  vitamin_a: decimal("vitamin_a"),
  vitamin_c: decimal("vitamin_c"),
  vitamin_d: decimal("vitamin_d"),
  vitamin_e: decimal("vitamin_e"),
  vitamin_b12: decimal("vitamin_b12"),
  folate: decimal("folate"),

  // Additional components
  caffeine: decimal("caffeine"),
  alcohol: decimal("alcohol"),

  is_vegan: boolean("is_vegan").default(false),
  is_vegetarian: boolean("is_vegetarian").default(false),
});

export type Food = InferSelectModel<typeof food>;
export type InsertFood = InferInsertModel<typeof food>;

// Measures table
export const measure = pgTable("measure", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('measure_id_seq')`),
  food_id: integer("food_id").references(() => food.id),
  description: text("description").notNull(),
  weight: decimal("weight"),
  volume: decimal("volume"),
});

export type Measure = InferSelectModel<typeof measure>;
export type InsertMeasure = InferInsertModel<typeof measure>;

// Recipe table

export const recipe = pgTable("recipe", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('recipe_id_seq')`),
  public_food_key: text("public_food_key").notNull().unique(), // Match dataset
  name: text("name").notNull(),
  description: text("description"),
  method: text("method"),
  cooking_time: integer("cooking_time"),
  servings: integer("servings"),
  total_weight_change: decimal("total_weight_change"), // Renamed for clarity
  created_at: timestamp("created_at").defaultNow(),
});

export type Recipe = InferSelectModel<typeof recipe>;
export type InsertRecipe = InferInsertModel<typeof recipe>;



export const recipeFood = pgTable("recipe_food", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('recipe_food_id_seq')`),
  recipe_id: integer("recipe_id").notNull().references(() => recipe.id, { onDelete: "cascade" }),
  food_id: integer("food_id").notNull().references(() => food.id), // Links food to recipe
  food_weight: decimal("food_weight").notNull(), // Amount of the food used in the recipe
  retention_factor_id: integer("retention_factor_id").references(() => retentionFactor.id), // Optional
});

export type RecipeFood = InferSelectModel<typeof recipeFood>;
export type InsertRecipeFood = InferInsertModel<typeof recipeFood>;


// Retention factor table
export const retentionFactor = pgTable("retention_factor", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('retention_id_seq')`),
  description: text("description").notNull(),
  vitamin_a: decimal("vitamin_a"),
  vitamin_c: decimal("vitamin_c"),
  vitamin_d: decimal("vitamin_d"),
  vitamin_e: decimal("vitamin_e"),
  vitamin_b12: decimal("vitamin_b12"),
  calcium: decimal("calcium"),
  iron: decimal("iron"),
});

export type RetentionFactor = InferSelectModel<typeof retentionFactor>;
export type InsertRetentionFactor = InferInsertModel<typeof retentionFactor>;


