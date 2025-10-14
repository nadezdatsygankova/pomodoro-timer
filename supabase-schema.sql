-- Supabase Database Schema for Pomodoro Timer
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    duration INTEGER NOT NULL,
    type TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Statistics table
CREATE TABLE IF NOT EXISTS statistics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_statistics_user_id ON statistics(user_id);

-- Create indexes for created_at for sorting
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed for your security requirements)
-- For production, you should add proper authentication and user-based policies

-- Sessions policies
CREATE POLICY "Allow all operations on sessions" ON sessions
    FOR ALL USING (true) WITH CHECK (true);

-- Tasks policies
CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

-- Activities policies
CREATE POLICY "Allow all operations on activities" ON activities
    FOR ALL USING (true) WITH CHECK (true);

-- Statistics policies
CREATE POLICY "Allow all operations on statistics" ON statistics
    FOR ALL USING (true) WITH CHECK (true);

-- Optional: Create a function to upsert statistics
CREATE OR REPLACE FUNCTION upsert_statistics(p_user_id TEXT, p_duration INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO statistics (user_id, total_sessions, total_focus_time)
    VALUES (p_user_id, 1, p_duration)
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_sessions = statistics.total_sessions + 1,
        total_focus_time = statistics.total_focus_time + p_duration,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Optional: Create views for analytics
CREATE OR REPLACE VIEW daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as sessions_count,
    SUM(duration) as total_minutes
FROM sessions
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Optional: Create a view for task completion stats
CREATE OR REPLACE VIEW task_completion_stats AS
SELECT
    user_id,
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE completed = true) as completed_tasks,
    SUM(time_spent) as total_time_spent
FROM tasks
GROUP BY user_id;

