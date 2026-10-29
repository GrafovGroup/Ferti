ALTER TABLE `leads` ADD `formspree_state` text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `formspree_hash` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `care_for` text;