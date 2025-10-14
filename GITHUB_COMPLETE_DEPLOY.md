# 🚀 Complete GitHub Deployment

Deploy BOTH frontend and backend using GitHub!

## 🎯 Architecture

```
GitHub Repository
    ├── Frontend → GitHub Pages (auto-deploy)
    └── Backend → Railway/Render (via GitHub Actions)
```

**Result:** Everything deployed automatically when you push to GitHub!

---

## 🚀 Complete Setup (10 minutes)

### Step 1: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Pomodoro Timer"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/pomodoro-timer.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend to Railway

#### Option A: Railway (Recommended)

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your repository
6. **Add** environment variables:
   ```
   SUPABASE_URL=https://hxhklmfayeqgzrogcfql.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```
7. **Deploy!** Railway will auto-deploy

8. **Get Railway Token**:

   - Go to Railway dashboard
   - Click your profile → Settings → Tokens
   - Create new token
   - Copy the token

9. **Add to GitHub Secrets**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: (paste your Railway token)

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

---

### Step 3: Update Frontend with Backend URL

Once Railway/Render deploys, you'll get a backend URL like:

```
https://pomodoro-timer-production.up.railway.app
```

Update `api.js`:

```javascript
// In api.js, line 10, replace with your actual backend URL:
return 'https://pomodoro-timer-production.up.railway.app/api';
```

---

### Step 4: Deploy Frontend to GitHub Pages

```bash
# Commit the updated API URL
git add .
git commit -m "Update API URL for production"
git push origin main
```

Then enable GitHub Pages:

1. **Go to** your GitHub repository
2. **Click** Settings → Pages
3. **Source**: Deploy from a branch
4. **Branch**: main / (root)
5. **Click** Save

GitHub Pages will automatically deploy your frontend!

---

### Step 5: Test Your Deployment

Your app will be live at:

```
https://yourusername.github.io/pomodoro-timer/
```

Test it:

1. Visit the URL
2. Sign up for an account
3. Create a Pomodoro session
4. Add tasks
5. View the dashboard

---

## 🎉 What You Get

### Automatic Deployments:

- ✅ **Push to GitHub** → Frontend auto-deploys (GitHub Pages)
- ✅ **Push to GitHub** → Backend auto-deploys (Railway/Render)
- ✅ **No manual deployment needed!**

### Your URLs:

- **Frontend**: `https://yourusername.github.io/pomodoro-timer/`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Supabase (cloud)

---

## 🔧 Configuration Files

Your project already includes:

- ✅ `.github/workflows/deploy.yml` - Frontend deployment
- ✅ `.github/workflows/deploy-backend.yml` - Backend deployment
- ✅ `railway.json` - Railway configuration
- ✅ `netlify.toml` - Netlify configuration
- ✅ `render.yaml` - Render configuration

---

## 📊 Deployment Flow

```
┌─────────────────────────────────┐
│   You push to GitHub (main)     │
└────────────┬────────────────────┘
             │
             ├──────────────┬──────────────┐
             │              │              │
             ▼              ▼              ▼
    ┌─────────────┐  ┌──────────┐  ┌──────────┐
    │   GitHub    │  │ Railway  │  │ Supabase │
    │   Pages     │  │ Backend  │  │ Database │
    │  (Frontend) │  │ (Node.js)│  │(Cloud DB)│
    └─────────────┘  └──────────┘  └──────────┘
             │              │              │
             └──────────────┴──────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Your Live App! 🎉   │
              │  github.io/pomodoro   │
              └───────────────────────┘
```

---

## 🚀 Quick Deploy Commands

```bash
# 1. Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# 2. Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/pomodoro-timer.git
git branch -M main
git push -u origin main

# 3. Deploy backend to Railway
# Go to railway.app and deploy

# 4. Update api.js with backend URL
# Edit api.js and set your Railway URL

# 5. Push changes
git add .
git commit -m "Update API URL"
git push

# 6. Enable GitHub Pages
# Go to repository Settings → Pages → GitHub Actions

# Done! Your app is live! 🎉
```

---

## 🔒 Security Setup

### GitHub Secrets:

Add these to your repository secrets:

- `RAILWAY_TOKEN` - Railway deployment token
- `SUPABASE_URL` - Your Supabase URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key

### Backend CORS:

Update your backend to allow GitHub Pages:

```javascript
// In server-auth.js
app.use(
  cors({
    origin: ['https://yourusername.github.io', 'http://localhost:3000'],
  }),
);
```

---

## 📋 Complete Checklist

- [ ] 1. Initialize git repository
- [ ] 2. Push to GitHub
- [ ] 3. Deploy backend to Railway/Render
- [ ] 4. Get backend URL
- [ ] 5. Update `api.js` with backend URL
- [ ] 6. Push changes to GitHub
- [ ] 7. Enable GitHub Pages
- [ ] 8. Test your live app!

---

## 🎯 Benefits

### GitHub Pages (Frontend):

- ✅ **Free** - Completely free
- ✅ **Fast** - CDN delivery
- ✅ **Auto-Deploy** - Push to deploy
- ✅ **HTTPS** - Automatic SSL
- ✅ **Custom Domain** - Use your own domain

### Railway/Render (Backend):

- ✅ **Full Backend** - Node.js support
- ✅ **Auto-Deploy** - Push to deploy
- ✅ **Free Tier** - Free hosting
- ✅ **Database** - Supabase connection

### GitHub Actions:

- ✅ **Automation** - Automatic deployments
- ✅ **CI/CD** - Continuous integration
- ✅ **Free** - 2000 minutes/month free

---

## 💰 Total Cost

**$0/month** - Everything is free!

- GitHub Pages: Free
- Railway: $5 credit/month (free tier)
- Render: Free tier available
- Supabase: Free tier available

---

## 🆘 Troubleshooting

### "GitHub Pages not working"

- Check Pages is enabled in Settings
- Verify branch is `main`
- Wait a few minutes for deployment

### "Backend not deploying"

- Check Railway/Render dashboard
- Verify environment variables
- Check GitHub Actions logs

### "API calls failing"

- Verify backend URL in `api.js`
- Check backend is running
- Verify CORS settings

---

## 🎉 You're Live!

After deployment:

1. **Frontend**: `https://yourusername.github.io/pomodoro-timer/`
2. **Backend**: `https://your-backend.railway.app`
3. **Database**: Supabase (cloud)

**Everything works together automatically!** 🎉

---

## 📚 Documentation

- **Quick Deploy**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **GitHub Pages**: [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md)
- **Netlify**: [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)
- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Deploy everything through GitHub! 🚀**

**Your app will be live and working! 🎉🍅✨**
