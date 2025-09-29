-- Add 'notes' column to the planes table for public notes on prebuilt planes
alter table planes add column if not exists notes text;