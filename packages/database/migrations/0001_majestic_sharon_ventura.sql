PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_giveaway_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`giveaway_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_giveaway_entries`("id", "giveaway_id", "guild_id", "user_id", "created_at") SELECT "id", "giveaway_id", "guild_id", "user_id", "created_at" FROM `giveaway_entries`;--> statement-breakpoint
DROP TABLE `giveaway_entries`;--> statement-breakpoint
ALTER TABLE `__new_giveaway_entries` RENAME TO `giveaway_entries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `giveaway_entries_user_uq` ON `giveaway_entries` (`giveaway_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `giveaway_entries_giveaway_idx` ON `giveaway_entries` (`giveaway_id`);--> statement-breakpoint
CREATE TABLE `__new_giveaway_winners` (
	`id` text PRIMARY KEY NOT NULL,
	`giveaway_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`selection_run` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_giveaway_winners`("id", "giveaway_id", "user_id", "created_at", "selection_run") SELECT "id", "giveaway_id", "user_id", "created_at", "selection_run" FROM `giveaway_winners`;--> statement-breakpoint
DROP TABLE `giveaway_winners`;--> statement-breakpoint
ALTER TABLE `__new_giveaway_winners` RENAME TO `giveaway_winners`;--> statement-breakpoint
CREATE UNIQUE INDEX `giveaway_winners_run_user_uq` ON `giveaway_winners` (`giveaway_id`,`selection_run`,`user_id`);--> statement-breakpoint
CREATE TABLE `__new_member_interests` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`interest_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`guild_id`,`user_id`) REFERENCES `members`(`guild_id`,`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`interest_id`) REFERENCES `interests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_member_interests`("guild_id", "user_id", "interest_id", "created_at") SELECT "guild_id", "user_id", "interest_id", "created_at" FROM `member_interests`;--> statement-breakpoint
DROP TABLE `member_interests`;--> statement-breakpoint
ALTER TABLE `__new_member_interests` RENAME TO `member_interests`;--> statement-breakpoint
CREATE UNIQUE INDEX `member_interests_choice_uq` ON `member_interests` (`guild_id`,`user_id`,`interest_id`);--> statement-breakpoint
CREATE INDEX `member_interests_user_idx` ON `member_interests` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `__new_reward_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`reward_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reward_claims`("id", "reward_id", "guild_id", "user_id", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") SELECT "id", "reward_id", "guild_id", "user_id", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at" FROM `reward_claims`;--> statement-breakpoint
DROP TABLE `reward_claims`;--> statement-breakpoint
ALTER TABLE `__new_reward_claims` RENAME TO `reward_claims`;--> statement-breakpoint
CREATE INDEX `reward_claims_guild_status_idx` ON `reward_claims` (`guild_id`,`status`);--> statement-breakpoint
CREATE INDEX `reward_claims_user_idx` ON `reward_claims` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_ticket_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ticket_messages`("id", "ticket_id", "author_user_id", "content", "created_at") SELECT "id", "ticket_id", "author_user_id", "content", "created_at" FROM `ticket_messages`;--> statement-breakpoint
DROP TABLE `ticket_messages`;--> statement-breakpoint
ALTER TABLE `__new_ticket_messages` RENAME TO `ticket_messages`;--> statement-breakpoint
CREATE INDEX `ticket_messages_ticket_idx` ON `ticket_messages` (`ticket_id`,`created_at`);