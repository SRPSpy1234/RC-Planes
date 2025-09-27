-- Add 'type' and 'skill' columns to the planes table for public inspiration/prebuilt planes
alter table planes add column if not exists type text;
alter table planes add column if not exists skill text;