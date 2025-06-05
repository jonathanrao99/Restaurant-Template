-- Drop the existing table if it exists
DROP TABLE IF EXISTS contact_submissions;

-- Create the contact_submissions table
CREATE TABLE contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    event_type TEXT NOT NULL,
    subscribe_newsletter BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for all users" ON contact_submissions;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON contact_submissions;

-- Create a policy that allows inserts from anyone
CREATE POLICY "Enable insert for all users" ON contact_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create a policy that allows select for anyone (for testing purposes)
CREATE POLICY "Enable select for all users" ON contact_submissions
    FOR SELECT
    TO public
    USING (true); 