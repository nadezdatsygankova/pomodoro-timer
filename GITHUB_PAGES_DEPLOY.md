# 📄 Deploy to GitHub Pages

Deploy your Pomodoro Timer frontend to GitHub Pages!

## ⚠️ Important Note

**GitHub Pages only supports static sites** (HTML/CSS/JS), not Node.js backends.

### Your Options:

1. **Frontend on GitHub Pages** + **Backend on Railway/Render** (Recommended)
2. **Everything on Railway/Render** (Simpler, recommended)

---

## 🚀 Option 1: GitHub Pages + Railway/Render (Split)

### Architecture:

```
GitHub Pages (Frontend) → Railway/Render (Backend) → Supabase (Database)
```

### Step 1: Deploy Backend

Deploy your backend to Railway or Render first:

```bash
# Deploy to Railway (easiest)
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to railway.app
# 3. Deploy from GitHub
# 4. Get backend URL: https://your-app.railway.app
```

### Step 2: Update Frontend

Update `api.js` with your backend URL:

```javascript
const API_BASE_URL = 'https://your-app.railway.app/api';
```

### Step 3: Deploy to GitHub Pages

#### Method A: GitHub Actions (Automatic)

1. **Create** `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

2. **Push** to GitHub:

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

3. **Enable** GitHub Pages:
   - Go to repository settings
   - Pages → Source: GitHub Actions

#### Method B: Manual Deployment

```bash
# 1. Create gh-pages branch
git checkout -b gh-pages

# 2. Push to gh-pages
git push origin gh-pages

# 3. Enable GitHub Pages
# Go to Settings → Pages → Source: gh-pages branch
```

### Step 4: Access Your App

Your app will be live at:

```
https://yourusername.github.io/pomodoro-timer/
```

---

## 🎯 Option 2: Everything on Railway (Recommended)

**Why Railway is better for your app:**

- ✅ Full-stack support (frontend + backend)
- ✅ Easier deployment
- ✅ Better performance
- ✅ Single URL
- ✅ No CORS issues

### Deploy Everything to Railway:

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 2. Go to railway.app
# 3. Deploy from GitHub
# 4. Done!
```

Your app will be at:

```
https://your-app.railway.app
```

---

## 📊 Comparison

| Feature      | GitHub Pages              | Railway           |
| ------------ | ------------------------- | ----------------- |
| **Frontend** | ✅ Yes                    | ✅ Yes            |
| **Backend**  | ❌ No                     | ✅ Yes            |
| **Database** | ❌ No                     | ✅ Yes            |
| **Setup**    | Complex                   | Simple            |
| **URL**      | `username.github.io/repo` | `app.railway.app` |
| **Best For** | Static sites              | Full-stack apps   |

---

## 🎯 My Recommendation

**Use Railway for everything!** 🚂

### Why?

1. **Simpler** - One deployment instead of two
2. **Faster** - No CORS issues
3. **Easier** - Single URL to manage
4. **Better** - Full-stack support
5. **Free** - $5 credit/month

### Quick Deploy to Railway:

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Railway"
git push

# 2. Go to railway.app
# 3. Deploy!

# Done in 5 minutes! ⚡
```

---

## 🌐 If You Still Want GitHub Pages

### Setup Steps:

1. **Deploy backend** to Railway/Render
2. **Update** `api.js` with backend URL
3. **Create** GitHub Actions workflow
4. **Enable** GitHub Pages
5. **Configure** CORS on backend

### Backend CORS Configuration:

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

## 🚀 Quick Deploy Script

I've created a script to help you deploy:

```bash
# Run the deployment script
./deploy.sh

# Choose your platform
# Follow the instructions
```

---

## 📚 Documentation

- **Netlify Deploy**: [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)
- **Railway Deploy**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🎉 Recommendation

**For your Pomodoro Timer app:**

✅ **Best Choice: Railway**

- Deploy everything in one place
- Easiest setup
- Best performance
- Free tier available

❌ **Not Recommended: GitHub Pages**

- Requires separate backend
- More complex setup
- CORS configuration needed
- Two URLs to manage

---

## 🚀 Deploy to Railway Now!

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for Railway"
git push origin main

# 2. Go to railway.app and deploy!

# Your app will be live in 5 minutes! ⚡
```

---

**Choose Railway for the easiest deployment! 🚂**

**Your app will be live and working in minutes! 🎉**
