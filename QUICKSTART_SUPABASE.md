# 🚀 Quick Start with Supabase

Get your Pomodoro Timer running with Supabase in 5 minutes!

## 📋 Prerequisites

- Node.js installed
- A Supabase account (free)

## ⚡ 5-Minute Setup

### 1️⃣ Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Fill in:
   - Name: `pomodoro-timer`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Click **"Create new project"**
5. Wait 2 minutes for setup

### 2️⃣ Get Your Credentials (1 min)

1. In your project, click **Settings** (⚙️) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3️⃣ Set Up Database (1 min)

1. Click **SQL Editor** in sidebar
2. Click **"New Query"**
3. Open `supabase-schema.sql` from this folder
4. Copy ALL the SQL code
5. Paste into SQL Editor
6. Click **"Run"** (or Cmd/Ctrl + Enter)
7. ✅ Should see "Success. No rows returned"

### 4️⃣ Configure Environment (30 sec)

Create a `.env` file in the project root:

```bash
# Copy this and replace with your actual values
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3000
```

Replace:

- `your-project-id` with your actual project ID
- `your-anon-key-here` with your actual anon key

### 5️⃣ Start the App (30 sec)

```bash
# Install dependencies (if not done)
npm install

# Start the server
node server-supabase.js
```

You should see:

```
✅ Connected to Supabase
🚀 Pomodoro Timer server running on http://localhost:3000
☁️  Database: Supabase (https://...)
```

### 6️⃣ Open the App

Open your browser:

```
http://localhost:3000
```

🎉 **You're done!** Start using your Pomodoro Timer!

## 🎯 What's Different from SQLite?

| Feature     | SQLite     | Supabase            |
| ----------- | ---------- | ------------------- |
| Storage     | Local file | Cloud database      |
| Access      | One device | Any device          |
| Backups     | Manual     | Automatic           |
| Scalability | Limited    | Unlimited           |
| Cost        | Free       | Free tier available |

## 🔄 Switch Between SQLite and Supabase

### Use Supabase:

```bash
node server-supabase.js
```

### Use SQLite:

```bash
node server.js
```

## ❓ Troubleshooting

### "Missing Supabase credentials"

- Check `.env` file exists
- Verify credentials are correct
- Restart the server

### "Failed to fetch"

- Check Supabase project is active
- Verify you ran the SQL schema
- Check your internet connection

### Tables not found

- Go to Supabase dashboard
- Click **Table Editor**
- You should see 4 tables
- If not, re-run `supabase-schema.sql`

## 📚 Next Steps

- Read `SUPABASE_SETUP.md` for detailed docs
- Check out Supabase features
- Add authentication (optional)
- Deploy to production

## 🆘 Need Help?

1. Check `SUPABASE_SETUP.md` for detailed guide
2. Visit [Supabase Docs](https://supabase.com/docs)
3. Join [Supabase Discord](https://discord.supabase.com)

---

**Happy Pomodoro-ing! 🍅✨**
