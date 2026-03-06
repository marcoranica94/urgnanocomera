import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT 'moderator' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE TABLE \`photos_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`photos_tags_order_idx\` ON \`photos_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`photos_tags_parent_id_idx\` ON \`photos_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`photos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`file_id\` integer NOT NULL,
  	\`year\` numeric,
  	\`decade\` text,
  	\`location_id\` integer,
  	\`uploader\` text DEFAULT 'admin' NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`photos_file_idx\` ON \`photos\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`photos_location_idx\` ON \`photos\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`photos_updated_at_idx\` ON \`photos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`photos_created_at_idx\` ON \`photos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`testimonials_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_tags_order_idx\` ON \`testimonials_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_tags_parent_id_idx\` ON \`testimonials_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`person\` text,
  	\`type\` text NOT NULL,
  	\`file_id\` integer,
  	\`content\` text,
  	\`description\` text,
  	\`year\` numeric,
  	\`location_id\` integer,
  	\`gdpr_consent\` integer DEFAULT false,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_file_idx\` ON \`testimonials\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_location_idx\` ON \`testimonials\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`locations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`category\` text,
  	\`coordinates_lat\` numeric,
  	\`coordinates_lng\` numeric,
  	\`cover_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_slug_idx\` ON \`locations\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`locations_cover_image_idx\` ON \`locations\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`stories_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stories_tags_order_idx\` ON \`stories_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stories_tags_parent_id_idx\` ON \`stories_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`summary\` text,
  	\`cover_image_id\` integer,
  	\`content\` text,
  	\`featured\` integer DEFAULT false,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`stories_slug_idx\` ON \`stories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`stories_cover_image_idx\` ON \`stories\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`stories_updated_at_idx\` ON \`stories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`stories_created_at_idx\` ON \`stories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`stories_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`photos_id\` integer,
  	\`testimonials_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`photos_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stories_rels_order_idx\` ON \`stories_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`stories_rels_parent_idx\` ON \`stories_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`stories_rels_path_idx\` ON \`stories_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`stories_rels_photos_id_idx\` ON \`stories_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`stories_rels_testimonials_id_idx\` ON \`stories_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE TABLE \`timeline_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`year\` numeric NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`category\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`timeline_events_updated_at_idx\` ON \`timeline_events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`timeline_events_created_at_idx\` ON \`timeline_events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`timeline_events_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`photos_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`timeline_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`photos_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`timeline_events_rels_order_idx\` ON \`timeline_events_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`timeline_events_rels_parent_idx\` ON \`timeline_events_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`timeline_events_rels_path_idx\` ON \`timeline_events_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`timeline_events_rels_photos_id_idx\` ON \`timeline_events_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE TABLE \`contributions_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contributions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contributions_files_order_idx\` ON \`contributions_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contributions_files_parent_id_idx\` ON \`contributions_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contributions_files_file_idx\` ON \`contributions_files\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`contributions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`submitter_name\` text NOT NULL,
  	\`submitter_email\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`estimated_year\` numeric,
  	\`location_id\` integer,
  	\`gdpr_consent\` integer DEFAULT false NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`moderation_note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`contributions_location_idx\` ON \`contributions\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`contributions_updated_at_idx\` ON \`contributions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`contributions_created_at_idx\` ON \`contributions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`comments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`photo_id\` integer NOT NULL,
  	\`author\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`is_tagging\` integer DEFAULT false,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`comments_photo_idx\` ON \`comments\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`comments_updated_at_idx\` ON \`comments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`comments_created_at_idx\` ON \`comments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`photos_id\` integer,
  	\`testimonials_id\` integer,
  	\`locations_id\` integer,
  	\`stories_id\` integer,
  	\`timeline_events_id\` integer,
  	\`contributions_id\` integer,
  	\`comments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`photos_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stories_id\`) REFERENCES \`stories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`timeline_events_id\`) REFERENCES \`timeline_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contributions_id\`) REFERENCES \`contributions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`comments_id\`) REFERENCES \`comments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_stories_id_idx\` ON \`payload_locked_documents_rels\` (\`stories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_timeline_events_id_idx\` ON \`payload_locked_documents_rels\` (\`timeline_events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contributions_id_idx\` ON \`payload_locked_documents_rels\` (\`contributions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_comments_id_idx\` ON \`payload_locked_documents_rels\` (\`comments_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`photos_tags\`;`)
  await db.run(sql`DROP TABLE \`photos\`;`)
  await db.run(sql`DROP TABLE \`testimonials_tags\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`locations\`;`)
  await db.run(sql`DROP TABLE \`stories_tags\`;`)
  await db.run(sql`DROP TABLE \`stories\`;`)
  await db.run(sql`DROP TABLE \`stories_rels\`;`)
  await db.run(sql`DROP TABLE \`timeline_events\`;`)
  await db.run(sql`DROP TABLE \`timeline_events_rels\`;`)
  await db.run(sql`DROP TABLE \`contributions_files\`;`)
  await db.run(sql`DROP TABLE \`contributions\`;`)
  await db.run(sql`DROP TABLE \`comments\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
