CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`amount_limit` real NOT NULL,
	`alert_threshold` real DEFAULT 0.8 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budgets_category_unique` ON `budgets` (`category`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant` text NOT NULL,
	`amount` real NOT NULL,
	`frequency` text DEFAULT 'monthly' NOT NULL,
	`next_due_date` integer,
	`status` text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD `original_currency` text DEFAULT 'KES';--> statement-breakpoint
ALTER TABLE `transactions` ADD `original_amount` real;