// Supabase API Client - Direct Backend-as-a-Service
const SUPABASE_URL = 'https://hxhklmfayeqgzrogcfql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aGtsbWZheWVxZ3pyb2djZnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTI0ODMsImV4cCI6MjA3NjAyODQ4M30.AL-mYcyG07cWZWg9Q7XfWaBsySnlfUCGp7uKBjKy0h8';

// Initialize Supabase client
let supabase;
try {
  if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized successfully');
  } else {
    console.warn('⚠️ Supabase library not loaded. Using localStorage only.');
  }
} catch (error) {
  console.warn('⚠️ Failed to initialize Supabase:', error);
}

// Get auth token
function getAuthToken() {
  return localStorage.getItem('access_token');
}

// Check if user is authenticated
function isAuthenticated() {
  const token = getAuthToken();
  const guestMode = localStorage.getItem('guest_mode');
  return !!token || !!guestMode;
}

// Check if in guest mode
function isGuestMode() {
  return !!localStorage.getItem('guest_mode');
}

// Get user ID from auth
function getUserId() {
  return localStorage.getItem('user_id');
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'auth.html';
    return false;
  }
  return true;
}

// Clear auth data
function clearAuthData() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
}

// API Helper Functions
const api = {
  // Get all data
  async getData() {
    try {
      // Check if in guest mode or if supabase is not available
      if (isGuestMode() || !supabase) {
        // Use localStorage for guest mode or when supabase is not available
        return this.getLocalData();
      }

      const token = getAuthToken();
      if (!token) {
        // No token, use localStorage
        return this.getLocalData();
      }

      // Set auth header
      supabase.auth.setSession({ access_token: token, refresh_token: localStorage.getItem('refresh_token') });

      const userId = getUserId();

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

      const data = {
        tasks: (tasks || []).map(task => ({
          id: task.id,
          text: task.text,
          completed: task.completed,
          timeSpent: task.time_spent
        })),
        activities: (activities || []).map(activity => ({
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

      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return this.getLocalData();
    }
  },

  // Save session
  async saveSession(duration, type) {
    try {
      // Guest mode or no supabase - just return success
      if (isGuestMode() || !supabase) {
        return { success: true };
      }

      const userId = getUserId();

      const { data, error } = await supabase
        .from('sessions')
        .insert([{ user_id: userId, duration, type }])
        .select()
        .single();

      if (error) throw error;

      // Update statistics
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

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error saving session:', error);
      return { success: false };
    }
  },

  // Add activity
  async addActivity(type, title, duration) {
    try {
      // Guest mode or no supabase - use localStorage
      if (isGuestMode() || !supabase) {
        const data = this.getLocalData();
        const newActivity = {
          type: type,
          title: title,
          duration: duration,
          timestamp: new Date().toISOString()
        };
        data.activities.push(newActivity);
        this.saveLocalData(data);
        return { success: true, id: Date.now().toString() };
      }

      const userId = getUserId();

      const { data, error } = await supabase
        .from('activities')
        .insert([{ user_id: userId, type, title, duration }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error adding activity:', error);
      return { success: false };
    }
  },

  // Add task
  async addTask(text) {
    try {
      // Guest mode or no supabase - use localStorage
      if (isGuestMode() || !supabase) {
        const data = this.getLocalData();
        const newTask = {
          id: Date.now().toString(),
          text: text,
          completed: false,
          timeSpent: 0
        };
        data.tasks.push(newTask);
        this.saveLocalData(data);
        return { success: true, id: newTask.id };
      }

      const userId = getUserId();

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ user_id: userId, text }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error adding task:', error);
      return { success: false };
    }
  },

  // Update task
  async updateTask(id, updates) {
    try {
      // Guest mode or no supabase - use localStorage
      if (isGuestMode() || !supabase) {
        const data = this.getLocalData();
        const taskIndex = data.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
          if (updates.text !== undefined) data.tasks[taskIndex].text = updates.text;
          if (updates.completed !== undefined) data.tasks[taskIndex].completed = updates.completed;
          if (updates.timeSpent !== undefined) data.tasks[taskIndex].timeSpent = updates.timeSpent;
          this.saveLocalData(data);
        }
        return { success: true };
      }

      const userId = getUserId();

      const dbUpdates = {};
      if (updates.text !== undefined) dbUpdates.text = updates.text;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.timeSpent !== undefined) dbUpdates.time_spent = updates.timeSpent;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false };
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      // Guest mode or no supabase - use localStorage
      if (isGuestMode() || !supabase) {
        const data = this.getLocalData();
        data.tasks = data.tasks.filter(t => t.id !== id);
        this.saveLocalData(data);
        return { success: true };
      }

      const userId = getUserId();

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false };
    }
  },

  // Clear activities
  async clearActivities() {
    try {
      // Guest mode or no supabase - use localStorage
      if (isGuestMode() || !supabase) {
        const data = this.getLocalData();
        data.activities = [];
        this.saveLocalData(data);
        return { success: true };
      }

      const userId = getUserId();

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error clearing activities:', error);
      return { success: false };
    }
  },

  // Export data
  async exportData() {
    try {
      // Guest mode - export from localStorage
      if (isGuestMode() || !supabase) {
        const data = this.getLocalData();
        const exportData = {
          exportDate: new Date().toISOString(),
          userId: getUserId(),
          summary: {
            totalSessions: data.statistics?.totalSessions || 0,
            totalFocusTime: data.statistics?.totalFocusTime || 0,
            totalTasks: data.tasks?.length || 0,
            completedTasks: data.tasks?.filter(t => t.completed).length || 0
          },
          tasks: data.tasks || [],
          activities: data.activities || [],
          statistics: data.statistics || {}
        };

        // Download as JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        return { success: true };
      }

      const userId = getUserId();

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

      // Download as JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
      return { success: true };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { success: false };
    }
  },

  // Check server health
  async checkHealth() {
    try {
      if (!supabase) {
        return false;
      }
      const { data, error } = await supabase.from('tasks').select('count').limit(1);
      return !error;
    } catch (error) {
      return false;
    }
  },

  // Fallback: Get data from localStorage
  getLocalData() {
    const savedData = localStorage.getItem('pomodoroData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      tasks: [],
      activities: [],
      statistics: {
        totalSessions: 0,
        totalFocusTime: 0
      }
    };
  },

  // Fallback: Save to localStorage
  saveLocalData(data) {
    localStorage.setItem('pomodoroData', JSON.stringify(data));
  }
};

// Check if server is available
let serverAvailable = false;
api.checkHealth().then(available => {
  serverAvailable = available;
  if (available) {
    console.log('✅ Connected to Supabase');
  } else {
    console.log('⚠️ Supabase not available, using localStorage');
  }
});

