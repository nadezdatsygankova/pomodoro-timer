# 🍅 Pomodoro Timer - Focus & Productivity

A beautiful, modern web application for the Pomodoro Technique - a time management method that uses a 25-minute timer to break work into focused intervals.

## ✨ Features

### Timer Features

- **25-minute countdown timer** with visual progress circle
- **Start/Pause/Reset controls** for flexible time management
- **Break sessions** - automatic 5-minute breaks after each session
- **Long breaks** - 15-minute breaks after every 4 sessions
- **Skip break option** - skip breaks if you want to continue working
- **Session tracking** - tracks total sessions and focus time
- **Sound notifications** when a Pomodoro session or break completes
- **Visual feedback** with smooth animations and color-coded modes

### Task Management

- **Add tasks** to track what you're working on
- **Mark tasks as complete** with checkboxes
- **Time tracking** - automatically tracks time spent on each task
- **Delete tasks** you no longer need
- **Task statistics** - see total tasks, completed tasks, and time spent

### Additional Features

- **Multiple database options** - SQLite (local) or Supabase (cloud)
- **Activity tracking** - complete history of all your sessions
- **Data export** - download all your data as JSON
- **Local storage** - your data persists between sessions
- **Responsive design** - works on desktop, tablet, and mobile
- **Beautiful UI** - modern gradient design with smooth animations
- **Auto-save** - your progress is saved automatically

## 🚀 Getting Started

### Option 1: Open Directly

Simply open `index.html` in your web browser:

```bash
open index.html
```

### Option 2: Using a Local Server

For the best experience, use a local web server:

**Using Python:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (http-server):**

```bash
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

### Option 3: With Database Support

#### Using SQLite (Local Database)

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open `http://localhost:3000` in your browser.

#### Using Supabase (Cloud Database) - Recommended

1. **Quick Setup** (5 minutes):

   - Follow the [Quick Start Guide](QUICKSTART_SUPABASE.md)

2. **Detailed Setup**:
   - Read [Complete Supabase Setup Guide](SUPABASE_SETUP.md)

**Benefits of Supabase:**

- ☁️ Cloud storage - access from any device
- 🔄 Automatic backups
- 📊 Built-in analytics
- 🔐 Secure and scalable
- 🆓 Free tier available

## 📖 How to Use

### Using the Timer

1. Click **Start** to begin a 25-minute Pomodoro session
2. Focus on your work during the session
3. When the timer completes, you'll hear a notification sound and a break will start automatically
4. **Short breaks** (5 minutes) occur after each work session
5. **Long breaks** (15 minutes) occur after every 4 work sessions
6. Click **Skip Break** if you want to continue working immediately
7. The session count and total focus time will update automatically
8. Click **Reset** to return to work mode

### Managing Tasks

1. **Add a task**: Type your task in the input field and press Enter or click the + button
2. **Complete a task**: Click the checkbox next to the task
3. **Track time**: Time is automatically tracked for active tasks during Pomodoro sessions
4. **Delete a task**: Click the 🗑️ icon to remove a task

### Tips for Best Results

- Focus on one task per Pomodoro session
- Breaks are automatically scheduled - let the app guide you
- Short breaks (5 min) help you recharge between sessions
- Long breaks (15 min) every 4 sessions help prevent burnout
- Use the task list to plan your work ahead of time
- Don't skip breaks too often - they're important for productivity!

## 🎨 Customization

The app uses CSS custom properties (variables) that you can easily customize in `styles.css`:

```css
:root {
  --primary-color: #ff6b6b; /* Main accent color */
  --secondary-color: #4ecdc4; /* Secondary color */
  --success-color: #51cf66; /* Success/completed color */
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 💾 Data Storage

All your data (sessions, tasks, time tracking) is stored locally in your browser using localStorage. Your data persists between sessions but is specific to the browser you're using.

## 🔧 Technical Details

- **Pure HTML, CSS, and JavaScript** - no frameworks required
- **Responsive design** with CSS Grid and Flexbox
- **SVG animations** for the timer progress circle
- **Web Audio API** for notification sounds
- **LocalStorage API** for data persistence

## 🚀 Deployment

Deploy your Pomodoro Timer to production!

### Quick Deploy (5 minutes):

- **Railway** (Recommended) - [Quick Guide](QUICK_DEPLOY.md)
- **Render** - [Quick Guide](QUICK_DEPLOY.md)
- **Vercel** - [Quick Guide](QUICK_DEPLOY.md)

### Full Deployment Guide:

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Deploy with One Command:

```bash
./deploy.sh
```

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Stay focused, achieve more! 🚀**
