# Pomodoro Timer - Database Setup Guide

This guide will help you set up the Pomodoro Timer with database support.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Server**

   ```bash
   npm start
   ```

   Or for development with auto-reload:

   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`
   - The app will automatically connect to the database

## 📊 Database Details

### Database Type

- **SQLite** - Lightweight, file-based database
- Database file: `pomodoro.db` (created automatically)

### Database Schema

#### Tables

1. **sessions**

   - Stores completed Pomodoro sessions
   - Columns: id, user_id, duration, type, completed_at, created_at

2. **tasks**

   - Stores user tasks
   - Columns: id, user_id, text, completed, time_spent, created_at, updated_at

3. **activities**

   - Stores activity history
   - Columns: id, user_id, type, title, duration, created_at

4. **statistics**
   - Stores user statistics
   - Columns: id, user_id, total_sessions, total_focus_time, updated_at

### User Management

- Each user gets a unique `user_id` (stored in localStorage)
- Data is isolated per user
- No authentication required (can be added if needed)

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```
PORT=3000
NODE_ENV=production
```

### API Endpoints

#### GET `/api/data`

Get all data for the current user

- Response: tasks, activities, statistics

#### POST `/api/sessions`

Save a completed session

- Body: `{ duration, type }`

#### POST `/api/activities`

Add an activity

- Body: `{ type, title, duration }`

#### POST `/api/tasks`

Add a task

- Body: `{ text }`

#### PUT `/api/tasks/:id`

Update a task

- Body: `{ text?, completed?, timeSpent? }`

#### DELETE `/api/tasks/:id`

Delete a task

#### DELETE `/api/activities`

Clear all activities

#### GET `/api/export`

Export all data as JSON

#### GET `/api/health`

Health check endpoint

## 🔄 How It Works

### Data Flow

1. **Client** (browser) makes API requests
2. **Server** (Express) handles requests
3. **Database** (SQLite) stores data
4. **Response** sent back to client

### Fallback Mechanism

- If server is unavailable, app falls back to localStorage
- Data syncs when server comes back online
- No data loss during offline mode

## 🛠️ Development

### Project Structure

```
work-timer/
├── index.html          # Frontend HTML
├── styles.css          # Styling
├── script.js           # Frontend logic
├── api.js              # API client
├── server.js           # Backend server
├── package.json        # Dependencies
└── pomodoro.db         # SQLite database (auto-created)
```

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` for auto-restart on file changes.

## 📦 Production Deployment

### Option 1: Local Server

```bash
npm start
```

### Option 2: PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start server.js --name pomodoro-timer
pm2 save
pm2 startup
```

### Option 3: Docker (Coming Soon)

```bash
docker build -t pomodoro-timer .
docker run -p 3000:3000 pomodoro-timer
```

## 🔐 Security Considerations

### Current Setup

- No authentication (single-user)
- User ID stored in localStorage
- SQLite database file

### For Multi-User Production

1. Add authentication (JWT, OAuth)
2. Use PostgreSQL or MySQL
3. Add rate limiting
4. Enable HTTPS
5. Add input validation and sanitization

## 📈 Performance

### Database Optimization

- Indexes on frequently queried columns
- Connection pooling
- Query optimization

### Scalability

- Current setup: Good for single user or small team
- For larger scale: Consider PostgreSQL + connection pooling

## 🐛 Troubleshooting

### Database Locked Error

```bash
# Make sure only one instance is running
pkill -f "node server.js"
npm start
```

### Port Already in Use

```bash
# Change port in server.js or use environment variable
PORT=3001 npm start
```

### Database Corruption

```bash
# Delete and recreate database
rm pomodoro.db
npm start
```

## 📝 Backup and Restore

### Backup Database

```bash
# Copy database file
cp pomodoro.db pomodoro.db.backup
```

### Restore Database

```bash
# Restore from backup
cp pomodoro.db.backup pomodoro.db
```

### Export Data

Use the built-in export feature in the app:

1. Click "Export Data" button
2. JSON file downloads automatically
3. Contains all tasks, activities, and statistics

## 🎯 Next Steps

### Possible Enhancements

- [ ] User authentication
- [ ] Multi-user support
- [ ] Data visualization (charts, graphs)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Integration with calendar apps
- [ ] Dark mode toggle
- [ ] Customizable timer durations
- [ ] Sound customization

## 📞 Support

For issues or questions:

1. Check this README
2. Check browser console for errors
3. Check server logs
4. Open an issue on GitHub

## 📄 License

MIT License - Feel free to use and modify!

---

**Happy Pomodoro-ing! 🍅**
