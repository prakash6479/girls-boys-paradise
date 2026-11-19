CREATE TABLE `admin_users` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`added_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_guild_user_uq` ON `admin_users` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`message_id` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `announcements_guild_created_idx` ON `announcements` (`guild_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`actor_user_id` text NOT NULL,
	`action` text NOT NULL,
	`target` text,
	`result` text NOT NULL,
	`details` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_logs_guild_created_idx` ON `audit_logs` (`guild_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `bot_settings` (
	`guild_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_by` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bot_settings_guild_key_uq` ON `bot_settings` (`guild_id`,`key`);--> statement-breakpoint
CREATE TABLE `giveaway_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`giveaway_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `giveaway_entries_user_uq` ON `giveaway_entries` (`giveaway_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `giveaway_entries_giveaway_idx` ON `giveaway_entries` (`giveaway_id`);--> statement-breakpoint
CREATE TABLE `giveaway_winners` (
	`id` text PRIMARY KEY NOT NULL,
	`giveaway_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`selection_run` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `giveaway_winners_run_user_uq` ON `giveaway_winners` (`giveaway_id`,`selection_run`,`user_id`);--> statement-breakpoint
CREATE TABLE `giveaways` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`message_id` text,
	`title` text NOT NULL,
	`prize` text NOT NULL,
	`description` text,
	`winners_count` integer DEFAULT 1 NOT NULL,
	`ends_at` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`organizer_id` text NOT NULL,
	`ended_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `giveaways_guild_status_end_idx` ON `giveaways` (`guild_id`,`status`,`ends_at`);--> statement-breakpoint
CREATE TABLE `guild_settings` (
	`guild_id` text PRIMARY KEY NOT NULL,
	`welcome_channel_id` text,
	`rules_channel_id` text,
	`verification_channel_id` text,
	`verified_role_id` text,
	`moderator_role_id` text,
	`announcement_channel_id` text,
	`log_channel_id` text,
	`welcome_message` text,
	`welcome_image_url` text,
	`xp_enabled` integer DEFAULT true NOT NULL,
	`xp_cooldown_seconds` integer DEFAULT 60 NOT NULL,
	`xp_min` integer DEFAULT 15 NOT NULL,
	`xp_max` integer DEFAULT 25 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `interests` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`name` text NOT NULL,
	`role_id` text NOT NULL,
	`category` text NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `interests_guild_role_uq` ON `interests` (`guild_id`,`role_id`);--> statement-breakpoint
CREATE TABLE `member_interests` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`interest_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_interests_choice_uq` ON `member_interests` (`guild_id`,`user_id`,`interest_id`);--> statement-breakpoint
CREATE INDEX `member_interests_user_idx` ON `member_interests` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `member_xp` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`level` integer DEFAULT 0 NOT NULL,
	`last_awarded_at` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_xp_guild_user_uq` ON `member_xp` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `member_xp_leaderboard_idx` ON `member_xp` (`guild_id`,`xp`);--> statement-breakpoint
CREATE TABLE `members` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`username` text,
	`joined_at` text,
	`verified_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_guild_user_uq` ON `members` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `members_guild_joined_idx` ON `members` (`guild_id`,`joined_at`);--> statement-breakpoint
CREATE TABLE `moderation_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`target_user_id` text NOT NULL,
	`moderator_user_id` text NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`status` text NOT NULL,
	`expires_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `moderation_logs_guild_created_idx` ON `moderation_logs` (`guild_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `moderation_logs_target_idx` ON `moderation_logs` (`guild_id`,`target_user_id`);--> statement-breakpoint
CREATE TABLE `reward_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`reward_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `reward_claims_guild_status_idx` ON `reward_claims` (`guild_id`,`status`);--> statement-breakpoint
CREATE INDEX `reward_claims_user_idx` ON `reward_claims` (`user_id`);--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rewards_guild_active_idx` ON `rewards` (`guild_id`,`active`);--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ticket_messages_ticket_idx` ON `ticket_messages` (`ticket_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text,
	`creator_user_id` text NOT NULL,
	`category` text NOT NULL,
	`reason` text,
	`status` text DEFAULT 'open' NOT NULL,
	`closed_by` text,
	`created_at` text NOT NULL,
	`closed_at` text
);
--> statement-breakpoint
CREATE INDEX `tickets_guild_status_idx` ON `tickets` (`guild_id`,`status`);--> statement-breakpoint
CREATE INDEX `tickets_creator_idx` ON `tickets` (`guild_id`,`creator_user_id`);--> statement-breakpoint
CREATE TABLE `voice_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`event` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `voice_activity_guild_time_idx` ON `voice_activity` (`guild_id`,`created_at`);