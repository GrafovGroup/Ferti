CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`kind` text NOT NULL,
	`first_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`preferred_contact` text NOT NULL,
	`city` text,
	`province` text,
	`postal_code` text,
	`service` text,
	`journey_stage` text,
	`timeframe` text,
	`message` text,
	`language` text NOT NULL,
	`source` text,
	`landing_page` text,
	`status` text DEFAULT 'NEW' NOT NULL,
	`assigned_provider` text,
	`referral_status` text DEFAULT 'NOT_SHARED' NOT NULL,
	`consent_version` text NOT NULL,
	`consent_at` integer NOT NULL,
	`marketing_consent` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limits_expiry_idx` ON `rate_limits` (`expires_at`);