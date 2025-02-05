CREATE SEQUENCE recipe_food_id_seq;

CREATE TABLE "recipe_food" (
	"id" integer PRIMARY KEY DEFAULT nextval('recipe_food_id_seq') NOT NULL,
	"recipe_id" integer NOT NULL,
	"food_id" integer NOT NULL,
	"food_weight" numeric NOT NULL,
	"retention_factor_id" integer
);
--> statement-breakpoint
ALTER TABLE "recipe" RENAME COLUMN "weight_change" TO "total_weight_change";--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "public_food_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_food" ADD CONSTRAINT "recipe_food_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_food" ADD CONSTRAINT "recipe_food_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_food" ADD CONSTRAINT "recipe_food_retention_factor_id_retention_factor_id_fk" FOREIGN KEY ("retention_factor_id") REFERENCES "public"."retention_factor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_public_food_key_unique" UNIQUE("public_food_key");
