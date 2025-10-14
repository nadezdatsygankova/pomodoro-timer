require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Connected to Supabase');

// Helper function to get or create user_id
function getUserId(req) {
  let userId = req.headers['user-id'];
  if (!userId) {
    userId = req.body.user_id || 'default_user';
  }
  return userId;
}

// API Routes

// Get all data for a user
app.get('/api/data', async (req, res) => {
  try {
    const userId = getUserId(req);

    // Get tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (tasksError) throw tasksError;

    // Get activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (activitiesError) throw activitiesError;

    // Get statistics
    const { data: stats, error: statsError } = await supabase
      .from('statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') throw statsError;

    const data = {
      tasks: tasks.map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
        timeSpent: task.time_spent
      })),
      activities: activities.map(activity => ({
        type: activity.type,
        title: activity.title,
        duration: activity.duration,
        timestamp: activity.created_at
      })),
      statistics: {
        totalSessions: stats?.total_sessions || 0,
        totalFocusTime: stats?.total_focus_time || 0
      }
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save session
app.post('/api/sessions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { duration, type } = req.body;

    // Insert session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([{ user_id: userId, duration, type }])
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Update statistics
    const { error: statsError } = await supabase.rpc('upsert_statistics', {
      p_user_id: userId,
      p_duration: duration
    });

    if (statsError) {
      // Fallback to manual upsert if function doesn't exist
      const { data: existingStats } = await supabase
        .from('statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingStats) {
        await supabase
          .from('statistics')
          .update({
            total_sessions: existingStats.total_sessions + 1,
            total_focus_time: existingStats.total_focus_time + duration,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('statistics')
          .insert([{
            user_id: userId,
            total_sessions: 1,
            total_focus_time: duration
          }]);
      }
    }

    res.json({ id: session.id, message: 'Session saved successfully' });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add activity
app.post('/api/activities', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { type, title, duration } = req.body;

    const { data, error } = await supabase
      .from('activities')
      .insert([{ user_id: userId, type, title, duration }])
      .select()
      .single();

    if (error) throw error;

    res.json({ id: data.id, message: 'Activity saved successfully' });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add task
app.post('/api/tasks', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: userId, text }])
      .select()
      .single();

    if (error) throw error;

    res.json({ id: data.id, message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { text, completed, timeSpent } = req.body;

    const updates = {};
    if (text !== undefined) updates.text = text;
    if (completed !== undefined) updates.completed = completed;
    if (timeSpent !== undefined) updates.time_spent = timeSpent;
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear activities
app.delete('/api/activities', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Activities cleared successfully' });
  } catch (error) {
    console.error('Error clearing activities:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export data
app.get('/api/export', async (req, res) => {
  try {
    const userId = getUserId(req);

    // Get all data
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId);

    const { data: sessions } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId);

    const { data: stats } = await supabase
      .from('statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId,
      summary: {
        totalSessions: stats?.total_sessions || 0,
        totalFocusTime: stats?.total_focus_time || 0,
        totalTasks: tasks?.length || 0,
        completedTasks: tasks?.filter(t => t.completed).length || 0
      },
      tasks: tasks || [],
      activities: activities || [],
      sessions: sessions || [],
      statistics: stats || {}
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=pomodoro-export-${Date.now()}.json`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', database: 'Supabase' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pomodoro Timer server running on http://localhost:${PORT}`);
  console.log(`☁️  Database: Supabase (${supabaseUrl})`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});

