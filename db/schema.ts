import { pgTable, text, integer, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

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

// Ingredients table
export const ingredient = pgTable("ingredient", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isVegan: boolean("isVegan").default(false),  // Flag for vegan ingredient
  isVegetarian: boolean("isVegetarian").default(false), // Flag for vegetarian ingredient

  // Nutritional information (per 100g), all optional
  // Macronutrients (per 100g)
  calories: integer("calories"), // kcal
  protein: integer("protein"),   // grams
  carbohydrates: integer("carbohydrates"), // grams
  sugars: integer("sugars"),     // grams
  fiber: integer("fiber"),       // grams
  fat: integer("fat"),           // grams
  saturatedFat: integer("saturatedFat"), // grams
  monounsaturatedFat: integer("monounsaturatedFat"), // grams
  polyunsaturatedFat: integer("polyunsaturatedFat"), // grams
  transFat: integer("transFat"), // grams
  cholesterol: integer("cholesterol"), // mg

  // Micronutrients (per 100g)
  sodium: integer("sodium"),     // mg
  potassium: integer("potassium"), // mg
  calcium: integer("calcium"),    // mg
  iron: integer("iron"),          // mg
  magnesium: integer("magnesium"), // mg
  vitaminA: integer("vitaminA"),   // IU or mcg
  vitaminC: integer("vitaminC"),   // mg
  vitaminD: integer("vitaminD"),   // IU or mcg
  vitaminK: integer("vitaminK"),   // mcg
  folate: integer("folate"),       // mcg
  vitaminB12: integer("vitaminB12"), // mcg
  zinc: integer("zinc"),          // mg
  phosphorus: integer("phosphorus"), // mg

  // Optional components
  water: integer("water"),        // g
  glycemicIndex: integer("glycemicIndex"), // Optional
  caffeine: integer("caffeine"),   // mg
  omega3: integer("omega3"),       // g
  omega6: integer("omega6"),       // g
});

// Recipes table
export const recipe = pgTable("recipe", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // The name of the recipe
  description: text("description"), // Optional description of the recipe
  cookingTime: integer("cookingTime"), // Time in minutes
  servings: integer("servings"), // Number of servings
  createdAt: timestamp("createdAt").defaultNow(), // Timestamp for recipe creation

});

// Join table to associate ingredients with recipes (many-to-many relationship)
export const recipeIngredient = pgTable("recipeIngredient", {
  recipeId: text("recipeId")
    .notNull()
    .references(() => recipe.id, { onDelete: "cascade" }), // Foreign key to recipe
  ingredientId: text("ingredientId")
    .notNull()
    .references(() => ingredient.id, { onDelete: "cascade" }), // Foreign key to ingredient
  quantity: varchar("quantity").notNull(), // Quantity of the ingredient in the recipe
  unit: text("unit"), // Optional unit (e.g., "g", "ml")
});

export const unitConversion = pgTable("unitConversion", {
  ingredientId: text("ingredientId")
    .notNull()
    .references(() => ingredient.id, { onDelete: "cascade" }),
  fromUnit: text("fromUnit").notNull(),  // e.g., "cup"
  toUnit: text("toUnit").notNull(),      // e.g., "g" (grams)
  conversionFactor: integer("conversionFactor").notNull(), // e.g., 200 for converting "cup" to "g"
});
