-- Supabase Schema for Career Applications
-- Run this in your Supabase SQL Editor

-- Create applications table
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT NOT NULL,
    
    -- Professional Information
    experience_level TEXT NOT NULL,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    
    -- Application Details
    cover_letter TEXT NOT NULL,
    tech_experience TEXT,
    availability TEXT,
    
    -- File Information
    resume_filename TEXT,
    resume_url TEXT,
    resume_size INTEGER,
    
    -- Metadata
    position TEXT DEFAULT 'Senior Software Engineer',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'rejected', 'hired')),
    notes TEXT,
    
    -- Indexes for searching
    CONSTRAINT applications_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_status ON applications(status);

-- Row Level Security (RLS) policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insertions from anyone (for the public form)
CREATE POLICY "Allow public form submissions" ON applications
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow read access only to authenticated users (for admin dashboard)
CREATE POLICY "Allow read for authenticated users" ON applications
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Policy: Allow updates only to authenticated users
CREATE POLICY "Allow updates for authenticated users" ON applications
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policy: Allow anyone to upload resumes
CREATE POLICY "Allow resume uploads" ON storage.objects
    FOR INSERT 
    WITH CHECK (bucket_id = 'resumes');

-- Storage policy: Allow authenticated users to view resumes
CREATE POLICY "Allow authenticated users to view resumes" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Optional: Create a view for easy application management
CREATE VIEW application_summary AS
SELECT 
    id,
    created_at,
    first_name || ' ' || last_name AS full_name,
    email,
    location,
    experience_level,
    status,
    CASE 
        WHEN resume_url IS NOT NULL THEN 'Yes'
        ELSE 'No'
    END AS has_resume
FROM applications
ORDER BY created_at DESC;