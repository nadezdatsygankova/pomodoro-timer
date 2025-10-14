# 🚀 Push to GitHub - Quick Guide

Your repository is ready! Follow these steps to push to GitHub and deploy.

## ✅ What's Done

- ✅ Git repository initialized
- ✅ All files committed
- ✅ Branch renamed to `main`
- ✅ Ready to push!

---

## 🚀 Next Steps

### Step 1: Create GitHub Repository

1. **Go to** [github.com](https://github.com)
2. **Sign in** to your account
3. **Click** the "+" icon → "New repository"
4. **Fill in**:
   - Repository name: `pomodoro-timer`
   - Description: "Pomodoro Timer with authentication and dashboard"
   - Visibility: Public (or Private)
   - **DO NOT** initialize with README (we already have one)
5. **Click** "Create repository"

### Step 2: Push to GitHub

Copy and run these commands:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/pomodoro-timer.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Deploy Backend

Choose one option:

#### Option A: Railway (Recommended)

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your `pomodoro-timer` repository
6. **Add** environment variables:
   ```
   SUPABASE_URL=https://hxhklmfayeqgzrogcfql.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
7. **Deploy!** Railway will auto-deploy

8. **Copy** your backend URL (e.g., `https://pomodoro-timer-production.up.railway.app`)

#### Option B: Render

1. **Go to** [render.com](https://render.com)
2. **Sign up** with GitHub
3. **Click** "New +" → "Web Service"
4. **Connect** your GitHub repo
5. **Configure**:
   - Build: `npm install`
   - Start: `node server-auth.js`
6. **Add** environment variables
7. **Deploy!**

### Step 4: Update Frontend

Once you have your backend URL, update `api.js`:

```javascript
// In api.js, line 10, replace with your actual backend URL:
return 'https://your-backend.railway.app/api';
```

Example:

```javascript
return 'https://pomodoro-timer-production.up.railway.app/api';
```

### Step 5: Push Updated Frontend

```bash
# Add the updated file
git add api.js

# Commit
git commit -m "Update API URL for production backend"

# Push
git push origin main
```

### Step 6: Enable GitHub Pages

1. **Go to** your GitHub repository
2. **Click** Settings → Pages
3. **Source**: Deploy from a branch
4. **Branch**: main / (root)
5. **Click** Save

GitHub Pages will automatically deploy your frontend!

---

## 🎉 You're Live!

Your app will be at:

```
https://YOUR_USERNAME.github.io/pomodoro-timer/
```

---

## 📋 Quick Commands

```bash
# 1. Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pomodoro-timer.git

# 2. Push to GitHub
git push -u origin main

# 3. After deploying backend and updating api.js:
git add api.js
git commit -m "Update API URL"
git push origin main

# Done! 🎉
```

---

## 🔧 Configuration Needed

Before pushing, you need to:

1. **Create** GitHub repository
2. **Deploy** backend to Railway/Render
3. **Update** `api.js` with backend URL
4. **Push** to GitHub
5. **Enable** GitHub Pages

---

## 🎯 What Happens After Push

### Automatic Deployments:

- ✅ **GitHub Pages** - Frontend auto-deploys
- ✅ **Railway/Render** - Backend auto-deploys (if configured)
- ✅ **Every push** - Both deploy automatically

---

## 📚 Full Guides

- **Complete Setup**: [GITHUB_COMPLETE_DEPLOY.md](GITHUB_COMPLETE_DEPLOY.md)
- **Railway Deploy**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Netlify Deploy**: [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)

---

**Ready to push to GitHub! 🚀**

**Your Pomodoro Timer will be live in minutes! 🎉🍅✨**
