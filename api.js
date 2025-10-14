// API Client for Pomodoro Timer
// Automatically detect API URL based on environment
const API_BASE_URL = (() => {
    // Check if we're in production (GitHub Pages)
    if (window.location.hostname.includes('github.io') || 
        window.location.hostname.includes('netlify.app') ||
        window.location.protocol === 'https:') {
        // Use your production backend URL
        // TODO: Replace with your actual Railway/Render URL
        return 'https://your-backend.railway.app/api';
    }
    // Development
    return 'http://localhost:3000/api';
})();

// Get auth token
function getAuthToken() {
  return localStorage.getItem('access_token');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
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

// Get headers with auth token
function getHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// API Helper Functions
const api = {
  // Get all data
  async getData() {
    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href = 'auth.html';
        return;
      }

      const response = await fetch(`${API_BASE_URL}/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        clearAuthData();
        window.location.href = 'auth.html';
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to localStorage if server is not available
      return this.getLocalData();
    }
  },

  // Save session
  async saveSession(duration, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ duration, type })
      });
      if (!response.ok) throw new Error('Failed to save session');
      return await response.json();
    } catch (error) {
      console.error('Error saving session:', error);
      return { success: false };
    }
  },

  // Add activity
  async addActivity(type, title, duration) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type, title, duration })
      });
      if (!response.ok) throw new Error('Failed to add activity');
      return await response.json();
    } catch (error) {
      console.error('Error adding activity:', error);
      return { success: false };
    }
  },

  // Add task
  async addTask(text) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('Failed to add task');
      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error) {
      console.error('Error adding task:', error);
      return { success: false };
    }
  },

  // Update task
  async updateTask(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false };
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return await response.json();
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false };
    }
  },

  // Clear activities
  async clearActivities() {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to clear activities');
      return await response.json();
    } catch (error) {
      console.error('Error clearing activities:', error);
      return { success: false };
    }
  },

  // Export data
  async exportData() {
    try {
      const response = await fetch(`${API_BASE_URL}/export`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to export data');
      const data = await response.json();

      // Download as JSON file
      const dataStr = JSON.stringify(data, null, 2);
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
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
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
    console.log('✅ Connected to database server');
  } else {
    console.log('⚠️ Server not available, using localStorage');
  }
});

