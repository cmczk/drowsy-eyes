CREATE TABLE `dream_tags` (
	`dream_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	CONSTRAINT `dream_tags_pk` PRIMARY KEY(`dream_id`, `tag_id`),
	CONSTRAINT `fk_dream_tags_dream_id_dreams_id_fk` FOREIGN KEY (`dream_id`) REFERENCES `dreams`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_dream_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_dream_tags_tag_id` ON `dream_tags` (`tag_id`);