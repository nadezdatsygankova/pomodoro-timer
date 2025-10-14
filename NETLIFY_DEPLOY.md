# 🌐 Deploy to Netlify

Deploy your Pomodoro Timer frontend to Netlify with a separate backend!

## 🎯 Architecture

Since your app has a Node.js backend, we'll use a **split deployment**:

- **Frontend** → Netlify (static files)
- **Backend** → Railway or Render (Node.js server)

This gives you:

- ✅ Fast CDN delivery (Netlify)
- ✅ Full backend support (Railway/Render)
- ✅ Best performance
- ✅ Free tier on both platforms

---

## 🚀 Deployment Steps

### Part 1: Deploy Backend (5 minutes)

#### Option A: Railway (Recommended)

```bash
# 1. Push backend to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/pomodoro-timer.git
git push -u origin main

# 2. Go to railway.app
# 3. Connect GitHub repo
# 4. Add environment variables:
#    - SUPABASE_URL
#    - SUPABASE_ANON_KEY
# 5. Deploy!
```

Get your backend URL: `https://your-app.railway.app`

#### Option B: Render

```bash
# 1. Push to GitHub (same as above)
# 2. Go to render.com
# 3. Create Web Service
# 4. Connect GitHub repo
# 5. Configure:
#    - Build: npm install
#    - Start: node server-auth.js
# 6. Add environment variables
# 7. Deploy!
```

Get your backend URL: `https://your-app.onrender.com`

---

### Part 2: Update Frontend for Production

#### Update `api.js`:

```javascript
// Change this line in api.js:
const API_BASE_URL = 'https://your-backend-url.railway.app/api';
// or
const API_BASE_URL = 'https://your-app.onrender.com/api';
```

Replace `your-backend-url` with your actual backend URL.

---

### Part 3: Deploy Frontend to Netlify (5 minutes)

#### Method 1: Netlify CLI (Recommended)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Deploy to Netlify
netlify deploy

# 4. For production
netlify deploy --prod
```

#### Method 2: Netlify Web Dashboard

1. **Go to** [netlify.com](https://netlify.com)
2. **Sign up/Login** with GitHub
3. **Click** "Add new site"
4. **Select** "Deploy with GitHub"
5. **Choose** your repository
6. **Configure**:
   - Build command: (leave empty)
   - Publish directory: `.` (root)
7. **Click** "Deploy site"

#### Method 3: Drag & Drop

1. **Go to** [app.netlify.com/drop](https://app.netlify.com/drop)
2. **Drag** your project folder
3. **Wait** for deployment
4. **Get** your URL

---

### Part 4: Configure Netlify

#### Add Environment Variables (Optional):

In Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   API_URL=https://your-backend-url.railway.app
   ```

#### Custom Domain (Optional):

1. Go to **Domain settings**
2. Click **Add custom domain**
3. Follow instructions

---

## 🔧 Configuration Files

Your project already includes:

- ✅ `netlify.toml` - Netlify configuration
- ✅ `.gitignore` - Excludes sensitive files
- ✅ `package.json` - Dependencies

---

## 📊 Architecture Diagram

```
┌─────────────────┐
│   Netlify CDN   │  ← Frontend (HTML/CSS/JS)
│  (Static Files) │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│  Railway/Render │  ← Backend (Node.js/Express)
│  (Node.js App)  │
└────────┬────────┘
         │ Database
         ▼
┌─────────────────┐
│    Supabase     │  ← Database (PostgreSQL)
│   (Cloud DB)    │
└─────────────────┘
```

---

## 🎯 Benefits of This Setup

### Netlify (Frontend):

- ✅ **Fast CDN** - Global content delivery
- ✅ **Free SSL** - Automatic HTTPS
- ✅ **Free Tier** - 100GB bandwidth/month
- ✅ **Auto-Deploy** - Push to GitHub = deploy
- ✅ **Custom Domain** - Easy domain setup
- ✅ **Form Handling** - Built-in forms
- ✅ **Analytics** - Usage statistics

### Railway/Render (Backend):

- ✅ **Node.js Support** - Full backend
- ✅ **Environment Variables** - Secure config
- ✅ **Database** - Supabase connection
- ✅ **Authentication** - JWT tokens
- ✅ **API** - REST endpoints

---

## 🚀 Quick Deploy Commands

### Complete Deployment:

```bash
# 1. Update API URL in api.js
# Edit api.js and set:
# const API_BASE_URL = 'https://your-backend.railway.app/api';

# 2. Deploy backend to Railway
# Go to railway.app and deploy

# 3. Deploy frontend to Netlify
netlify deploy --prod

# Done! 🎉
```

---

## 📝 Step-by-Step Example

### Example with Railway Backend:

```bash
# Backend URL: https://pomodoro-timer-production.up.railway.app

# 1. Update api.js
# Change: const API_BASE_URL = 'http://localhost:3000/api';
# To: const API_BASE_URL = 'https://pomodoro-timer-production.up.railway.app/api';

# 2. Commit changes
git add .
git commit -m "Update API URL for production"
git push

# 3. Deploy to Netlify
netlify deploy --prod

# Your app is live at:
# https://your-app-name.netlify.app
```

---

## 🔒 Security Configuration

### CORS Settings:

Your backend already handles CORS with:

```javascript
app.use(cors());
```

This allows requests from any origin. For production, you can restrict it:

```javascript
app.use(
  cors({
    origin: 'https://your-app.netlify.app',
  }),
);
```

---

## 📊 Monitoring

### Netlify Dashboard:

- **Deploy Logs** - See deployment status
- **Analytics** - Track visitors
- **Forms** - Handle form submissions
- **Functions** - Serverless functions (optional)

### Railway/Render Dashboard:

- **Application Logs** - Backend logs
- **Metrics** - CPU, memory usage
- **Environment Variables** - Manage config
- **Deployments** - Deployment history

---

## 🔄 Continuous Deployment

### Automatic Deployments:

1. **Push to GitHub** → Backend auto-deploys (Railway/Render)
2. **Push to GitHub** → Frontend auto-deploys (Netlify)

Both platforms watch your GitHub repo and auto-deploy on push!

---

## 🎨 Custom Domain

### Add Custom Domain to Netlify:

1. Go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `pomodoro.yourdomain.com`)
4. Follow DNS setup instructions
5. Netlify provides SSL automatically

---

## 💰 Cost Breakdown

### Netlify (Free Tier):

- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Form submissions: 100/month
- ✅ Custom domains

### Railway (Free Tier):

- ✅ $5 credit/month
- ✅ Enough for small apps

### Render (Free Tier):

- ✅ 750 hours/month
- ✅ Spins down after inactivity

**Total Cost: $0/month** 🎉

---

## 🆘 Troubleshooting

### "API calls failing"

- Check backend URL in `api.js`
- Verify backend is running
- Check CORS settings

### "Authentication not working"

- Verify Supabase credentials
- Check environment variables
- Clear browser cache

### "Deployment failed"

- Check build logs in Netlify
- Verify all files are committed
- Check for syntax errors

---

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 🎉 You're Live!

Your app is now:

- ✅ **Fast** - CDN delivery via Netlify
- ✅ **Secure** - HTTPS everywhere
- ✅ **Scalable** - Cloud infrastructure
- ✅ **Free** - Free tier on all platforms

**Share your app: https://your-app.netlify.app** 🚀

---

**Deploy now and share with the world! 🌍🍅✨**
