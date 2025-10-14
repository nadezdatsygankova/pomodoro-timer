# 🚀 Deploy Everything Through GitHub

Deploy your Pomodoro Timer using GitHub as the central hub!

## 🎯 The Strategy

Since GitHub Pages only supports static sites, here's the best approach:

```
GitHub Repository
    ├── Frontend → GitHub Pages (free)
    └── Backend → Railway/Render (free, managed through GitHub)
```

**Everything is managed through GitHub, but the backend deploys to a free cloud platform.**

---

## 🚀 Complete Setup (10 minutes)

### Step 1: Deploy Backend via Railway (Free)

Railway offers free hosting and integrates with GitHub:

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your `pomodoro-timer` repository
6. **Railway will auto-detect** your Node.js app
7. **Add** environment variables:
   ```
   SUPABASE_URL=https://hxhklmfayeqgzrogcfql.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
8. **Deploy!** Railway auto-deploys

**You'll get a URL like:** `https://pomodoro-timer-production.up.railway.app`

### Step 2: Update Frontend with Backend URL

Edit `api.js` and update line 10:

```javascript
// Replace 'your-backend.railway.app' with your actual Railway URL
return 'https://pomodoro-timer-production.up.railway.app/api';
```

### Step 3: Push to GitHub

```bash
git add api.js
git commit -m "Update API URL for Railway backend"
git push origin main
```

### Step 4: Enable GitHub Pages

1. **Go to** your GitHub repository
2. **Click** Settings → Pages
3. **Source**: Deploy from a branch
4. **Branch**: main / (root)
5. **Click** Save

---

## 🎉 Your App is Live!

### URLs:

- **Frontend**: `https://nadezdatsygankova.github.io/pomodoro-timer/`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Supabase (cloud)

---

## 🔄 How It Works

### Automatic Deployments:

1. **You push to GitHub** → Both deploy automatically
2. **Frontend** → GitHub Pages auto-deploys
3. **Backend** → Railway auto-deploys (watches your GitHub repo)

### Architecture:

```
┌─────────────────────────────────┐
│   GitHub Repository              │
│   (Your Code)                    │
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

## 💰 Cost: $0/month

- ✅ GitHub Pages: Free
- ✅ Railway: Free tier ($5 credit/month)
- ✅ Supabase: Free tier
- ✅ **Total: $0/month**

---

## 🎯 Why This Setup?

### GitHub Pages (Frontend):

- ✅ **Free** - Completely free hosting
- ✅ **Fast** - Global CDN
- ✅ **Auto-Deploy** - Push to GitHub = deploy
- ✅ **HTTPS** - Automatic SSL
- ✅ **Custom Domain** - Use your own domain

### Railway (Backend):

- ✅ **Free Tier** - $5 credit/month
- ✅ **Auto-Deploy** - Watches GitHub
- ✅ **Node.js Support** - Full backend
- ✅ **Easy Setup** - Just connect GitHub
- ✅ **No Configuration** - Works out of the box

---

## 📋 Quick Deploy Checklist

- [ ] 1. Deploy backend to Railway (5 min)
- [ ] 2. Get backend URL from Railway
- [ ] 3. Update `api.js` with backend URL
- [ ] 4. Push to GitHub
- [ ] 5. Enable GitHub Pages
- [ ] 6. Test your live app!

---

## 🚀 Deploy Now!

### Quick Commands:

```bash
# 1. Deploy backend to Railway
# Go to railway.app and deploy

# 2. Update api.js with backend URL
# Edit: const API_BASE_URL = 'https://your-backend.railway.app/api';

# 3. Push changes
git add api.js
git commit -m "Update API URL for production"
git push origin main

# 4. Enable GitHub Pages
# Go to repository Settings → Pages → GitHub Actions

# Done! Your app is live! 🎉
```

---

## 🔧 Configuration

### Backend CORS (Update server-auth.js):

```javascript
// In server-auth.js, update CORS to allow GitHub Pages:
app.use(
  cors({
    origin: ['https://nadezdatsygankova.github.io', 'http://localhost:3000'],
  }),
);
```

Then push the changes:

```bash
git add server-auth.js
git commit -m "Update CORS for GitHub Pages"
git push origin main
```

---

## 🎉 Benefits

### Managed Through GitHub:

- ✅ All code in one place
- ✅ Version control
- ✅ Easy collaboration
- ✅ Automatic deployments
- ✅ Free hosting

### Performance:

- ✅ Fast CDN (GitHub Pages)
- ✅ Reliable backend (Railway)
- ✅ Cloud database (Supabase)
- ✅ Global availability

---

## 📊 What You Get

### Frontend (GitHub Pages):

- ✅ Beautiful UI
- ✅ Responsive design
- ✅ Fast loading
- ✅ HTTPS secure
- ✅ Free forever

### Backend (Railway):

- ✅ Full Node.js support
- ✅ Express server
- ✅ Authentication
- ✅ Database connection
- ✅ Free tier

### Database (Supabase):

- ✅ PostgreSQL
- ✅ Cloud storage
- ✅ Automatic backups
- ✅ Free tier

---

## 🆘 Troubleshooting

### "API calls failing"

- Check backend URL in `api.js`
- Verify backend is running on Railway
- Check CORS settings

### "GitHub Pages not working"

- Check Pages is enabled in Settings
- Wait a few minutes for deployment
- Check repository visibility (Public)

### "Authentication not working"

- Verify Supabase credentials
- Check environment variables in Railway
- Clear browser cache

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
- **Complete Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **GitHub Pages**: [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

---

## 🎉 You're Ready!

**Everything is managed through GitHub, with free hosting for both frontend and backend!**

**Deploy now and your app will be live! 🚀🍅✨**

---

**Your Pomodoro Timer:**

- ✅ On GitHub
- ✅ Ready to deploy
- ✅ Free hosting
- ✅ Production-ready

**Deploy to Railway and enable GitHub Pages! 🎉**
