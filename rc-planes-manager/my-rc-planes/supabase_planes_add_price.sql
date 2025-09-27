-- Add 'price' column to the planes table for public inspiration/prebuilt planes
alter table planes add column if not exists price numeric;