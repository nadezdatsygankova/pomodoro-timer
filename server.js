const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Database setup
const dbPath = path.join(__dirname, 'pomodoro.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Sessions table
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            duration INTEGER NOT NULL,
            type TEXT NOT NULL,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    // Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            time_spent INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    // Activities table
    db.run(`CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            duration TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    // Statistics table
    db.run(`CREATE TABLE IF NOT EXISTS statistics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL UNIQUE,
            total_sessions INTEGER DEFAULT 0,
            total_focus_time INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    console.log('Database tables initialized');
  });
}

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
app.get('/api/data', (req, res) => {
  const userId = getUserId(req);

  db.serialize(() => {
    const data = {
      tasks: [],
      activities: [],
      statistics: {
        totalSessions: 0,
        totalFocusTime: 0
      }
    };

    // Get tasks
    db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      data.tasks = tasks.map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed === 1,
        timeSpent: task.time_spent
      }));

      // Get activities
      db.all('SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', [userId], (err, activities) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        data.activities = activities.map(activity => ({
          type: activity.type,
          title: activity.title,
          duration: activity.duration,
          timestamp: activity.created_at
        }));

        // Get statistics
        db.get('SELECT * FROM statistics WHERE user_id = ?', [userId], (err, stats) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (stats) {
            data.statistics = {
              totalSessions: stats.total_sessions,
              totalFocusTime: stats.total_focus_time
            };
          }
          res.json(data);
        });
      });
    });
  });
});

// Save session
app.post('/api/sessions', (req, res) => {
  const userId = getUserId(req);
  const { duration, type } = req.body;

  db.run(
    'INSERT INTO sessions (user_id, duration, type) VALUES (?, ?, ?)',
    [userId, duration, type],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Update statistics
      db.run(
        `INSERT INTO statistics (user_id, total_sessions, total_focus_time)
                 VALUES (?, 1, ?)
                 ON CONFLICT(user_id) DO UPDATE SET
                 total_sessions = total_sessions + 1,
                 total_focus_time = total_focus_time + ?,
                 updated_at = CURRENT_TIMESTAMP`,
        [userId, duration, duration],
        (err) => {
          if (err) {
            console.error('Error updating statistics:', err);
          }
        }
      );

      res.json({
        id: this.lastID,
        message: 'Session saved successfully'
      });
    }
  );
});

// Add activity
app.post('/api/activities', (req, res) => {
  const userId = getUserId(req);
  const { type, title, duration } = req.body;

  db.run(
    'INSERT INTO activities (user_id, type, title, duration) VALUES (?, ?, ?, ?)',
    [userId, type, title, duration],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        message: 'Activity saved successfully'
      });
    }
  );
});

// Add task
app.post('/api/tasks', (req, res) => {
  const userId = getUserId(req);
  const { text } = req.body;

  db.run(
    'INSERT INTO tasks (user_id, text) VALUES (?, ?)',
    [userId, text],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        message: 'Task added successfully'
      });
    }
  );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const userId = getUserId(req);
  const { id } = req.params;
  const { text, completed, timeSpent } = req.body;

  const updates = [];
  const values = [];

  if (text !== undefined) {
    updates.push('text = ?');
    values.push(text);
  }
  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed ? 1 : 0);
  }
  if (timeSpent !== undefined) {
    updates.push('time_spent = ?');
    values.push(timeSpent);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id, userId);

  db.run(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    values,
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Task updated successfully',
        changes: this.changes
      });
    }
  );
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const userId = getUserId(req);
  const { id } = req.params;

  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Task deleted successfully',
        changes: this.changes
      });
    }
  );
});

// Clear activities
app.delete('/api/activities', (req, res) => {
  const userId = getUserId(req);

  db.run(
    'DELETE FROM activities WHERE user_id = ?',
    [userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Activities cleared successfully',
        changes: this.changes
      });
    }
  );
});

// Export data
app.get('/api/export', (req, res) => {
  const userId = getUserId(req);

  db.serialize(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId,
      summary: {},
      tasks: [],
      activities: [],
      sessions: [],
      statistics: {}
    };

    // Get tasks
    db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, tasks) => {
      if (!err) {
        exportData.tasks = tasks;
      }

      // Get activities
      db.all('SELECT * FROM activities WHERE user_id = ?', [userId], (err, activities) => {
        if (!err) {
          exportData.activities = activities;
        }

        // Get sessions
        db.all('SELECT * FROM sessions WHERE user_id = ?', [userId], (err, sessions) => {
          if (!err) {
            exportData.sessions = sessions;
          }

          // Get statistics
          db.get('SELECT * FROM statistics WHERE user_id = ?', [userId], (err, stats) => {
            if (!err && stats) {
              exportData.statistics = stats;
              exportData.summary = {
                totalSessions: stats.total_sessions,
                totalFocusTime: stats.total_focus_time,
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.completed === 1).length
              };
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=pomodoro-export-${Date.now()}.json`);
            res.json(exportData);
          });
        });
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pomodoro Timer server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

