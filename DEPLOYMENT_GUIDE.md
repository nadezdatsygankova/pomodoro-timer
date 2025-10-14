# 🚀 Deployment Guide

Deploy your Pomodoro Timer to production! Choose the best option for your needs.

## 🎯 Recommended Platforms

### Option 1: Railway (Recommended) ⭐

**Best for: Full-stack Node.js apps**

- ✅ Free tier available
- ✅ Easy deployment
- ✅ Automatic HTTPS
- ✅ Environment variables
- ✅ PostgreSQL support

### Option 2: Render

**Best for: Simple deployments**

- ✅ Free tier available
- ✅ Easy setup
- ✅ Automatic deployments
- ✅ Custom domains

### Option 3: Vercel

**Best for: Frontend + Serverless**

- ✅ Excellent for static sites
- ✅ Serverless functions
- ✅ Great performance
- ⚠️ Requires backend refactoring

### Option 4: Netlify

**Best for: Static sites only**

- ✅ Great for frontend
- ⚠️ Limited backend support
- ⚠️ Requires workarounds

## 🚂 Option 1: Deploy to Railway (Recommended)

### Why Railway?

- ✅ Supports Node.js backends
- ✅ Free tier: $5 credit/month
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Environment variables management
- ✅ Built-in PostgreSQL (optional)

### Step-by-Step Deployment:

#### 1. Prepare Your Code

Make sure you have a `.env.example` file:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
```

#### 2. Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/pomodoro-timer.git
git branch -M main
git push -u origin main
```

#### 3. Deploy on Railway

1. **Sign Up/Login**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Project**

   - Railway will auto-detect Node.js
   - Set start command: `node server-auth.js`
   - Railway will automatically deploy

4. **Add Environment Variables**

   - Go to "Variables" tab
   - Add your Supabase credentials:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     PORT=3000
     ```

5. **Deploy**

   - Railway will automatically deploy
   - Get your app URL (e.g., `https://your-app.railway.app`)

6. **Update Frontend**

   - Update `api.js` to use production URL:

   ```javascript
   const API_BASE_URL = 'https://your-app.railway.app/api';
   ```

7. **Redeploy**
   - Push changes to GitHub
   - Railway auto-deploys

### Railway Commands:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open
```

### Railway Pricing:

- **Free Tier**: $5 credit/month
- **Hobby**: $5/month after free tier
- **Pro**: $20/month

---

## 🎨 Option 2: Deploy to Render

### Why Render?

- ✅ Free tier available
- ✅ Easy setup
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Auto-deploy from GitHub

### Step-by-Step Deployment:

#### 1. Push to GitHub

(Same as Railway step 2)

#### 2. Deploy on Render

1. **Sign Up/Login**

   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**

   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**

   - **Name**: pomodoro-timer
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server-auth.js`
   - **Instance Type**: Free (or paid)

4. **Add Environment Variables**

   - Click "Environment"
   - Add variables:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     PORT=3000
     ```

5. **Deploy**

   - Click "Create Web Service"
   - Render will deploy your app
   - Get your app URL (e.g., `https://pomodoro-timer.onrender.com`)

6. **Update Frontend**
   - Update `api.js` with production URL
   - Redeploy

### Render Free Tier:

- ✅ Free tier available
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ First request after spin-down is slow

---

## ⚡ Option 3: Deploy to Vercel

### Why Vercel?

- ✅ Excellent performance
- ✅ Free tier
- ✅ Serverless functions
- ✅ Automatic HTTPS
- ⚠️ Requires backend refactoring

### Step-by-Step Deployment:

#### 1. Refactor for Serverless

Create `api/index.js`:

```javascript
// This would be your serverless function
// Vercel will handle routing
```

#### 2. Deploy Frontend

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Add Environment Variables**

   - Go to Vercel dashboard
   - Project → Settings → Environment Variables
   - Add your Supabase credentials

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Vercel Free Tier:

- ✅ Generous free tier
- ✅ Great performance
- ✅ Automatic deployments

---

## 🌐 Option 4: Deploy to Netlify

### Why Netlify?

- ✅ Great for static sites
- ✅ Free tier
- ✅ Easy setup
- ⚠️ Limited backend support

### Step-by-Step Deployment:

#### Option A: Frontend Only (with separate backend)

1. **Deploy Frontend to Netlify**

   ```bash
   npm install -g netlify-cli
   netlify deploy
   netlify deploy --prod
   ```

2. **Deploy Backend Separately**
   - Use Railway or Render for backend
   - Update frontend API URL

#### Option B: Netlify Functions (Advanced)

1. **Create Netlify Functions**

   - Move API logic to `netlify/functions/`
   - Deploy to Netlify

2. **Configure**
   - Add `netlify.toml` configuration
   - Deploy

---

## 📋 Pre-Deployment Checklist

### Before Deploying:

- [ ] Test locally with `node server-auth.js`
- [ ] Verify all environment variables
- [ ] Update API URLs in frontend
- [ ] Test authentication flow
- [ ] Test all features
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify Supabase connection

### Environment Variables Needed:

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional
PORT=3000
NODE_ENV=production
```

### Update Frontend for Production:

In `api.js`, update the API URL:

```javascript
// Development
const API_BASE_URL = 'http://localhost:3000/api';

// Production (update with your deployed URL)
const API_BASE_URL = 'https://your-app.railway.app/api';
// or
const API_BASE_URL = 'https://pomodoro-timer.onrender.com/api';
```

---

## 🎯 Recommended Deployment Strategy

### For Quick Deployment:

**Railway** (easiest, best for beginners)

1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy!

### For Free Tier:

**Render** (generous free tier)

1. Push to GitHub
2. Connect to Render
3. Configure and deploy

### For Best Performance:

**Vercel** (fastest, best CDN)

1. Refactor for serverless
2. Deploy to Vercel
3. Enjoy fast performance

---

## 🔒 Security Checklist

Before going to production:

- [ ] Use HTTPS (automatic on most platforms)
- [ ] Set secure environment variables
- [ ] Enable Supabase Row Level Security
- [ ] Use strong passwords
- [ ] Enable email verification in Supabase
- [ ] Set up proper CORS policies
- [ ] Review authentication settings
- [ ] Test all security features

---

## 📊 Monitoring & Analytics

### After Deployment:

1. **Monitor Logs**

   - Railway: `railway logs`
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Functions

2. **Check Performance**

   - Use browser DevTools
   - Monitor API response times
   - Check error rates

3. **User Analytics** (Optional)
   - Add Google Analytics
   - Track user engagement
   - Monitor feature usage

---

## 🆘 Troubleshooting

### Common Issues:

**"Application Error"**

- Check environment variables
- Verify Supabase credentials
- Check server logs

**"CORS Error"**

- Add your domain to CORS settings
- Check API URL configuration

**"Authentication Failed"**

- Verify Supabase Auth settings
- Check token storage
- Clear localStorage

**"Database Connection Failed"**

- Verify Supabase URL
- Check network connectivity
- Review Supabase dashboard

---

## 🎉 Post-Deployment

### After Successful Deployment:

1. **Test All Features**

   - Sign up/Sign in
   - Create Pomodoros
   - Add tasks
   - View dashboard

2. **Share Your App**

   - Share the URL with friends
   - Get feedback
   - Iterate and improve

3. **Monitor Usage**
   - Check analytics
   - Review logs
   - Optimize performance

---

## 📚 Platform Comparison

| Feature             | Railway    | Render   | Vercel     | Netlify  |
| ------------------- | ---------- | -------- | ---------- | -------- |
| **Node.js Support** | ✅         | ✅       | ⚠️         | ⚠️       |
| **Free Tier**       | ✅         | ✅       | ✅         | ✅       |
| **Auto-Deploy**     | ✅         | ✅       | ✅         | ✅       |
| **HTTPS**           | ✅         | ✅       | ✅         | ✅       |
| **Custom Domain**   | ✅         | ✅       | ✅         | ✅       |
| **Ease of Use**     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐⭐   |
| **Performance**     | ⭐⭐⭐⭐   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🚀 Quick Start (Railway)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. Go to railway.app
# 3. Connect GitHub repo
# 4. Add environment variables
# 5. Deploy!

# Your app will be live at:
# https://your-app-name.railway.app
```

---

## 📞 Support

Need help deploying?

1. Check platform documentation
2. Review error logs
3. Test locally first
4. Check environment variables
5. Verify Supabase connection

---

**Choose Railway for the easiest deployment experience! 🚂**

**Your Pomodoro Timer will be live in minutes! 🎉**
