CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`timestamp` text,
	`completed` integer,
	`editable` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
