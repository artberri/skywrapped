CREATE TABLE `wrapped` (
	`did` text NOT NULL,
	`handle` text NOT NULL,
	`year` integer NOT NULL,
	`data` text,
	PRIMARY KEY(`did`, `year`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_wrapped_did_year` ON `wrapped` (`handle`,`year`);