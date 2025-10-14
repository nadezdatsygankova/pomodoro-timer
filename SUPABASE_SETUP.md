# Supabase Setup Guide for Pomodoro Timer

This guide will help you set up the Pomodoro Timer with Supabase cloud database.

## 🚀 Quick Start

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new organization (if needed)

### Step 2: Create a New Project

1. Click "New Project"
2. Fill in the project details:
   - **Name**: pomodoro-timer (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect to start
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be created

### Step 3: Get Your Credentials

1. In your project dashboard, click the **Settings** icon (⚙️) in the sidebar
2. Go to **API** section
3. You'll find:
   - **Project URL**: Copy this
   - **anon public key**: Copy this
   - **service_role key**: Keep this secret (not needed for this app)

### Step 4: Set Up the Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql` file
4. Paste it into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### Step 5: Configure Environment Variables

1. In your project root, create a `.env` file:

   ```bash
   touch .env
   ```

2. Add your Supabase credentials:

   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   PORT=3000
   ```

3. Replace the values with your actual credentials from Step 3

### Step 6: Install Dependencies

```bash
npm install
```

This will install:

- `@supabase/supabase-js` - Supabase JavaScript client
- `dotenv` - Environment variable loader
- Other dependencies

### Step 7: Start the Server

```bash
# Using the Supabase server
node server-supabase.js

# Or for development with auto-reload
npx nodemon server-supabase.js
```

### Step 8: Access the App

Open your browser and go to:

```
http://localhost:3000
```

## 🎯 What You Get with Supabase

### ✅ Advantages over SQLite

1. **Cloud Storage** - Access from anywhere
2. **Real-time Updates** - (can be enabled for live features)
3. **Authentication Ready** - Built-in auth system
4. **Automatic Backups** - Daily backups included
5. **Scalability** - Handles millions of requests
6. **Free Tier** - 500MB database, 2GB bandwidth
7. **API Auto-generated** - REST and GraphQL APIs
8. **Dashboard** - Visual database management

### 📊 Database Features

- **PostgreSQL** - Industry-standard database
- **Row Level Security (RLS)** - Data isolation
- **Triggers & Functions** - Automated logic
- **Views** - Pre-built analytics queries
- **Extensions** - Additional features

## 🔧 Configuration Options

### Update package.json Scripts

Add this to your `package.json` scripts section:

```json
"scripts": {
  "start": "node server-supabase.js",
  "dev": "nodemon server-supabase.js",
  "start:sqlite": "node server.js"
}
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use environment variables** - Don't hardcode credentials
3. **Enable RLS policies** - Restrict data access
4. **Use service_role key carefully** - Only on server-side
5. **Rotate keys regularly** - In Supabase dashboard

## 📱 Database Schema

### Tables

#### `sessions`

Stores completed Pomodoro sessions

- `id` (UUID) - Primary key
- `user_id` (TEXT) - User identifier
- `duration` (INTEGER) - Session duration in minutes
- `type` (TEXT) - Session type (work/break)
- `completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

#### `tasks`

Stores user tasks

- `id` (UUID) - Primary key
- `user_id` (TEXT) - User identifier
- `text` (TEXT) - Task description
- `completed` (BOOLEAN) - Completion status
- `time_spent` (INTEGER) - Minutes spent
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `activities`

Stores activity history

- `id` (UUID) - Primary key
- `user_id` (TEXT) - User identifier
- `type` (TEXT) - Activity type
- `title` (TEXT) - Activity title
- `duration` (TEXT) - Duration string
- `created_at` (TIMESTAMP)

#### `statistics`

Stores user statistics

- `id` (UUID) - Primary key
- `user_id` (TEXT) - Unique user identifier
- `total_sessions` (INTEGER) - Total sessions
- `total_focus_time` (INTEGER) - Total minutes
- `updated_at` (TIMESTAMP)

### Indexes

All tables have indexes on:

- `user_id` - For filtering by user
- `created_at` - For sorting by date

### Views

Pre-built views for analytics:

- `daily_stats` - Daily session statistics
- `task_completion_stats` - Task completion metrics

## 🔄 Migration from SQLite

If you were using SQLite before:

1. Export your data:

   ```bash
   # Using the export feature in the app
   # Click "Export Data" button
   ```

2. Set up Supabase (follow steps above)

3. Import data (optional):
   - Use the Supabase dashboard
   - Or write a migration script

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Connect your GitHub repo
4. Add environment variables
5. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Create app: `heroku create pomodoro-timer`
3. Set environment variables:
   ```bash
   heroku config:set SUPABASE_URL=your-url
   heroku config:set SUPABASE_ANON_KEY=your-key
   ```
4. Deploy: `git push heroku main`

## 📊 Monitoring & Analytics

### Supabase Dashboard

Access your Supabase dashboard to:

- View database tables
- Run SQL queries
- Monitor API usage
- Check logs
- Manage backups

### Database Insights

Use the built-in views:

```sql
-- Daily statistics
SELECT * FROM daily_stats;

-- Task completion stats
SELECT * FROM task_completion_stats;
```

## 🔐 Security Features

### Row Level Security (RLS)

RLS is enabled on all tables. Current policies allow all operations. For production:

1. Add authentication
2. Update policies to check user identity
3. Restrict access based on user_id

Example secure policy:

```sql
CREATE POLICY "Users can only see their own data"
ON tasks FOR SELECT
USING (auth.uid()::text = user_id);
```

## 🆘 Troubleshooting

### Connection Issues

**Error: "Missing Supabase credentials"**

- Check your `.env` file exists
- Verify credentials are correct
- Restart the server

**Error: "Failed to fetch"**

- Check Supabase project is active
- Verify RLS policies allow access
- Check network connectivity

### Database Issues

**Tables not found**

- Run the schema SQL in Supabase SQL Editor
- Check table names match exactly

**Permission denied**

- Check RLS policies
- Verify anon key is correct
- Check user_id matches

## 📈 Performance Tips

1. **Use indexes** - Already created in schema
2. **Limit queries** - Use `.limit()` for large datasets
3. **Cache data** - Store frequently accessed data
4. **Batch operations** - Group multiple inserts
5. **Monitor usage** - Check Supabase dashboard

## 🎯 Next Steps

### Enhancements You Can Add

1. **Authentication**

   - Use Supabase Auth
   - Add email/password login
   - Social login (Google, GitHub)

2. **Real-time Features**

   - Live activity feed
   - Collaborative features
   - Team workspaces

3. **Advanced Analytics**

   - Charts and graphs
   - Productivity insights
   - Weekly/monthly reports

4. **Mobile App**
   - React Native with Supabase
   - Offline support
   - Push notifications

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Discord](https://discord.supabase.com)

## 🆘 Support

Having issues?

1. Check this guide
2. Review Supabase docs
3. Check browser console for errors
4. Check server logs
5. Join Supabase Discord

---

**Happy coding with Supabase! 🚀**
