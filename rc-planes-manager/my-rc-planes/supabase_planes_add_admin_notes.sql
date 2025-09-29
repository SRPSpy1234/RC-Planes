-- Add 'admin_notes' column to the planes table for admin-only notes on prebuilt planes
alter table planes add column if not exists admin_notes text;