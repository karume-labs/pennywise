CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `custom_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant_pattern` text NOT NULL,
	`assigned_category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant_or_sender` text NOT NULL,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`category` text DEFAULT 'Uncategorized' NOT NULL,
	`date` integer NOT NULL,
	`transaction_fee` real DEFAULT 0,
	`account_balance` real,
	`ai_confidence` real,
	`raw_sms` text
);
