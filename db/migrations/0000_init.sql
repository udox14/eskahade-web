CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hero` (
	`id` integer PRIMARY KEY NOT NULL,
	`badge_text` text DEFAULT '' NOT NULL,
	`heading_pre` text DEFAULT '' NOT NULL,
	`heading_highlight` text DEFAULT '' NOT NULL,
	`heading_post` text DEFAULT '' NOT NULL,
	`subheading` text DEFAULT '' NOT NULL,
	`cta1_label` text DEFAULT '' NOT NULL,
	`cta1_href` text DEFAULT '' NOT NULL,
	`cta2_label` text DEFAULT '' NOT NULL,
	`cta2_href` text DEFAULT '' NOT NULL,
	`image_key` text,
	`float_number` text DEFAULT '' NOT NULL,
	`float_label` text DEFAULT '' NOT NULL,
	`accent_number` text DEFAULT '' NOT NULL,
	`accent_label` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`cta` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT 'squares-four' NOT NULL,
	`href` text DEFAULT '#' NOT NULL,
	`scheme` text DEFAULT 'light' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text NOT NULL,
	`label` text NOT NULL,
	`icon` text DEFAULT 'star' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`tag` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT 'book-open-text' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` text DEFAULT '' NOT NULL,
	`month` text DEFAULT '' NOT NULL,
	`full_date` text DEFAULT '' NOT NULL,
	`title` text NOT NULL,
	`time` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`initials` text DEFAULT '' NOT NULL,
	`avatar_color` text DEFAULT '#DCE6D5' NOT NULL,
	`image_key` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_categories_slug_unique` ON `news_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `news_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` integer,
	`date` text DEFAULT '' NOT NULL,
	`published_at` text DEFAULT '' NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`cover_key` text,
	`featured` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `news_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_posts_slug_unique` ON `news_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `gallery_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_categories_slug_unique` ON `gallery_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `gallery_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`category_id` integer,
	`image_key` text,
	`col_span` integer DEFAULT 1 NOT NULL,
	`row_span` integer DEFAULT 1 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `gallery_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `org_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`name` text NOT NULL,
	`level` text DEFAULT 'bawah' NOT NULL,
	`icon` text DEFAULT 'user-circle' NOT NULL,
	`image_key` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text DEFAULT 'buildings' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `history_timeline` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mission_points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text DEFAULT '' NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile_hero` (
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text DEFAULT 'Tentang Kami' NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`paragraph` text DEFAULT '' NOT NULL,
	`image_key` text
);
--> statement-breakpoint
CREATE TABLE `sambutan` (
	`id` integer PRIMARY KEY NOT NULL,
	`arabic` text DEFAULT '' NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`image_key` text,
	`paragraph1` text DEFAULT '' NOT NULL,
	`paragraph2` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vision` (
	`id` integer PRIMARY KEY NOT NULL,
	`vision_text` text DEFAULT '' NOT NULL,
	`quote_text` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`filename` text DEFAULT '' NOT NULL,
	`mime` text DEFAULT '' NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text DEFAULT 'Admin' NOT NULL,
	`created_at` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
