ALTER TABLE "transactions" RENAME COLUMN "accound_id" TO "account_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accound_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;