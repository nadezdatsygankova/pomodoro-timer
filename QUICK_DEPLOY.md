# ⚡ Quick Deployment Guide

Deploy your Pomodoro Timer in 5 minutes!

## 🚀 Fastest Way: Railway

### Step 1: Push to GitHub (2 min)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/pomodoro-timer.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway (3 min)

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your repository
6. **Add** environment variables:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key
7. **Done!** Railway auto-deploys

### Step 3: Update Frontend

In `api.js`, change:

```javascript
const API_BASE_URL = 'https://your-app.railway.app/api';
```

Push changes:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

### ✅ Your app is live!

Visit: `https://your-app.railway.app`

---

## 🎨 Alternative: Render (Also Easy)

### Step 1: Push to GitHub

(Same as Railway)

### Step 2: Deploy on Render

1. **Go to** [render.com](https://render.com)
2. **Sign up** with GitHub
3. **Click** "New +" → "Web Service"
4. **Connect** your GitHub repo
5. **Configure**:
   - Build Command: `npm install`
   - Start Command: `node server-auth.js`
6. **Add** environment variables
7. **Click** "Create Web Service"

### ✅ Your app is live!

Visit: `https://your-app.onrender.com`

---

## 📋 Environment Variables

You need these in your deployment platform:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3000
NODE_ENV=production
```

Get them from:

- Supabase Dashboard → Settings → API

---

## 🔧 Quick Commands

### Railway:

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render:

```bash
# Just push to GitHub
git push origin main
# Render auto-deploys!
```

### Vercel:

```bash
# Install CLI
npm install -g vercel

# Deploy
vercel
```

---

## 🎯 Platform Comparison

| Platform    | Setup Time | Free Tier   | Best For              |
| ----------- | ---------- | ----------- | --------------------- |
| **Railway** | 5 min      | ✅ $5/month | Full-stack apps       |
| **Render**  | 5 min      | ✅ Yes      | Simple deployments    |
| **Vercel**  | 10 min     | ✅ Yes      | Frontend + Serverless |
| **Netlify** | 15 min     | ✅ Yes      | Static sites          |

---

## ✅ Post-Deployment Checklist

- [ ] Test sign up/sign in
- [ ] Create a Pomodoro session
- [ ] Add a task
- [ ] View dashboard
- [ ] Test on mobile
- [ ] Share with friends!

---

## 🆘 Need Help?

1. **Check logs** in platform dashboard
2. **Verify** environment variables
3. **Test** locally first
4. **Read** DEPLOYMENT_GUIDE.md

---

## 🎉 You're Live!

Your Pomodoro Timer is now:

- ✅ Publicly accessible
- ✅ Secure with authentication
- ✅ Backed by cloud database
- ✅ Production-ready

**Share your app and start being productive! 🍅✨**

---

**Pro Tip:** Use Railway for the easiest deployment experience! 🚂
