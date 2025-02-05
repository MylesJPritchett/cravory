CREATE SEQUENCE classification_id_seq;
CREATE SEQUENCE food_id_seq;
CREATE SEQUENCE recipe_id_seq;
CREATE SEQUENCE measure_id_seq;
CREATE SEQUENCE retention_id_seq;

CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "classification" (
	"id" integer PRIMARY KEY DEFAULT nextval('classification_id_seq') NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food" (
	"id" integer PRIMARY KEY DEFAULT nextval('food_id_seq') NOT NULL,
	"public_food_key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"derivation" text,
	"sampling_details" text,
	"classification_id" integer,
	"energy" numeric,
	"energy_without_fiber" numeric,
	"water" numeric,
	"protein" numeric,
	"fat" numeric,
	"carbohydrates" numeric,
	"fiber" numeric,
	"sugars" numeric,
	"added_sugars" numeric,
	"saturated_fat" numeric,
	"monounsaturated_fat" numeric,
	"polyunsaturated_fat" numeric,
	"trans_fat" numeric,
	"cholesterol" numeric,
	"sodium" numeric,
	"potassium" numeric,
	"calcium" numeric,
	"iron" numeric,
	"magnesium" numeric,
	"zinc" numeric,
	"phosphorus" numeric,
	"vitamin_a" numeric,
	"vitamin_c" numeric,
	"vitamin_d" numeric,
	"vitamin_e" numeric,
	"vitamin_b12" numeric,
	"folate" numeric,
	"caffeine" numeric,
	"alcohol" numeric,
	"is_vegan" boolean DEFAULT false,
	"is_vegetarian" boolean DEFAULT false,
	CONSTRAINT "food_public_food_key_unique" UNIQUE("public_food_key")
);
--> statement-breakpoint
CREATE TABLE "measure" (
	"id" integer PRIMARY KEY DEFAULT nextval('measure_id_seq') NOT NULL,
	"food_id" integer,
	"description" text NOT NULL,
	"weight" numeric,
	"volume" numeric
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" integer PRIMARY KEY DEFAULT nextval('recipe_id_seq') NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"cooking_time" integer,
	"servings" integer,
	"weight_change" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "retention_factor" (
	"id" integer PRIMARY KEY DEFAULT nextval('retention_id_seq') NOT NULL,
	"description" text NOT NULL,
	"vitamin_a" numeric,
	"vitamin_c" numeric,
	"vitamin_d" numeric,
	"vitamin_e" numeric,
	"vitamin_b12" numeric,
	"calcium" numeric,
	"iron" numeric
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food" ADD CONSTRAINT "food_classification_id_classification_id_fk" FOREIGN KEY ("classification_id") REFERENCES "public"."classification"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measure" ADD CONSTRAINT "measure_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
