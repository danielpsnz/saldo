CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"payee" text NOT NULL,
	"notes" text,
	"date" timestamp NOT NULL,
	"accound_id" text NOT NULL,
	"category_id" text
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accound_id_accounts_id_fk" FOREIGN KEY ("accound_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;