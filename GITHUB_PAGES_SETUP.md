# 📄 Deploy to GitHub Pages - Complete Setup

Deploy your Pomodoro Timer to GitHub Pages with a separate backend!

## 🎯 How It Works

```
GitHub Pages (Frontend) → Railway/Render (Backend) → Supabase (Database)
```

Your app will be live at: `https://yourusername.github.io/pomodoro-timer/`

---

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend (5 minutes)

First, we need to deploy your backend to Railway or Render:

#### Option A: Railway (Recommended)

```bash
# 1. Push to GitHub (if not already done)
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to railway.app
# 3. Sign up with GitHub
# 4. Click "New Project" → "Deploy from GitHub repo"
# 5. Select your repository
# 6. Add environment variables:
#    - SUPABASE_URL=https://hxhklmfayeqgzrogcfql.supabase.co
#    - SUPABASE_ANON_KEY=your-anon-key
# 7. Railway will auto-deploy
# 8. Copy your backend URL (e.g., https://pomodoro-timer-production.up.railway.app)
```

#### Option B: Render

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to render.com
# 3. Sign up with GitHub
# 4. Click "New +" → "Web Service"
# 5. Connect your repository
# 6. Configure:
#    - Build Command: npm install
#    - Start Command: node server-auth.js
# 7. Add environment variables
# 8. Copy your backend URL
```

---

### Part 2: Update Frontend with Backend URL

Once you have your backend URL, update `api.js`:

```javascript
// In api.js, replace line 10:
return 'https://your-backend.railway.app/api';
// or
return 'https://your-app.onrender.com/api';
```

**Example:**
```javascript
return 'https://pomodoro-timer-production.up.railway.app/api';
```

---

### Part 3: Deploy to GitHub Pages

#### Method 1: GitHub Actions (Automatic) - Recommended

Your project already has the workflow file: `.github/workflows/deploy.yml`

Just push to GitHub:

```bash
# 1. Commit changes
git add .
git commit -m "Update API URL for production"
git push origin main

# 2. Enable GitHub Pages
# Go to your repository on GitHub
# Settings → Pages → Source: GitHub Actions
```

That's it! GitHub Actions will automatically deploy your app.

#### Method 2: Manual Deployment

```bash
# 1. Create gh-pages branch
git checkout -b gh-pages

# 2. Push to gh-pages
git push origin gh-pages

# 3. Enable GitHub Pages
# Go to repository Settings → Pages
# Source: Deploy from a branch
# Branch: gh-pages / (root)
```

---

### Part 4: Access Your App

Your app will be live at:
```
https://yourusername.github.io/pomodoro-timer/
```

---

## 🔧 Configuration

### Backend CORS Settings

Update your backend to allow GitHub Pages:

```javascript
// In server-auth.js, update CORS:
app.use(cors({
    origin: [
        'https://yourusername.github.io',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ]
}));
```

---

## 📋 Complete Deployment Checklist

- [ ] 1. Deploy backend to Railway or Render
- [ ] 2. Copy backend URL
- [ ] 3. Update `api.js` with backend URL
- [ ] 4. Commit changes
- [ ] 5. Push to GitHub
- [ ] 6. Enable GitHub Pages
- [ ] 7. Test your live app!

---

## 🎯 Quick Deploy Commands

```bash
# 1. Update API URL in api.js
# Edit: const API_BASE_URL = 'https://your-backend.railway.app/api';

# 2. Commit changes
git add .
git commit -m "Ready for GitHub Pages"
git push origin main

# 3. Enable GitHub Pages
# Go to repository Settings → Pages → GitHub Actions

# Done! Your app is live! 🎉
```

---

## 🌐 Your URLs

After deployment:

- **Frontend**: `https://yourusername.github.io/pomodoro-timer/`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Supabase (cloud)

---

## ✅ Testing Your Deployment

1. **Visit** your GitHub Pages URL
2. **Sign up** for a new account
3. **Create** a Pomodoro session
4. **Add** a task
5. **View** the dashboard
6. **Everything works!** 🎉

---

## 🔒 Security

### CORS Configuration:

Your backend needs to allow requests from GitHub Pages:

```javascript
// In server-auth.js
app.use(cors({
    origin: [
        'https://yourusername.github.io',  // GitHub Pages
        'http://localhost:3000',            // Local dev
        'http://127.0.0.1:3000'            // Local dev
    ]
}));
```

---

## 🎉 Benefits of This Setup

### GitHub Pages:
- ✅ **Free** - Completely free hosting
- ✅ **Fast** - CDN delivery
- ✅ **Custom Domain** - Use your own domain
- ✅ **Auto-Deploy** - Push to GitHub = deploy
- ✅ **HTTPS** - Automatic SSL

### Railway/Render Backend:
- ✅ **Full Backend** - Node.js support
- ✅ **Database** - Supabase connection
- ✅ **Authentication** - JWT tokens
- ✅ **Free Tier** - Free hosting

---

## 📊 Architecture

```
User's Browser
      ↓
GitHub Pages (Frontend)
      ↓ API Calls
Railway/Render (Backend)
      ↓ Database
Supabase (PostgreSQL)
```

---

## 🆘 Troubleshooting

### "API calls failing"
- Check backend URL in `api.js`
- Verify backend is running
- Check CORS settings on backend

### "Authentication not working"
- Verify Supabase credentials
- Check environment variables
- Clear browser cache

### "Page not found"
- Check GitHub Pages is enabled
- Verify branch is `main` or `gh-pages`
- Wait a few minutes for deployment

---

## 🎯 Next Steps

1. **Deploy backend** to Railway (5 min)
2. **Update** `api.js` with backend URL
3. **Push** to GitHub
4. **Enable** GitHub Pages
5. **Test** your live app!

---

## 📚 Documentation

- **Railway Setup**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Netlify Guide**: [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)

---

**Your app will be live on GitHub Pages! 📄🚀**

**Share your app: https://yourusername.github.io/pomodoro-timer/ 🎉**

