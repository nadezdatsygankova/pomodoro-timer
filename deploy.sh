#!/bin/bash

# Deployment script for Pomodoro Timer

echo "🚀 Pomodoro Timer Deployment Script"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Ask for deployment platform
echo "Select deployment platform:"
echo "1) Railway (Recommended)"
echo "2) Render"
echo "3) Vercel"
echo "4) Netlify"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚂 Deploying to Railway..."
        echo ""
        echo "Steps:"
        echo "1. Push to GitHub:"
        echo "   git add ."
        echo "   git commit -m 'Ready for Railway deployment'"
        echo "   git push origin main"
        echo ""
        echo "2. Go to https://railway.app"
        echo "3. Click 'New Project'"
        echo "4. Select 'Deploy from GitHub repo'"
        echo "5. Choose your repository"
        echo "6. Add environment variables:"
        echo "   - SUPABASE_URL"
        echo "   - SUPABASE_ANON_KEY"
        echo ""
        echo "7. Railway will auto-deploy!"
        echo ""
        echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
        ;;
    2)
        echo ""
        echo "🎨 Deploying to Render..."
        echo ""
        echo "Steps:"
        echo "1. Push to GitHub:"
        echo "   git add ."
        echo "   git commit -m 'Ready for Render deployment'"
        echo "   git push origin main"
        echo ""
        echo "2. Go to https://render.com"
        echo "3. Click 'New +' → 'Web Service'"
        echo "4. Connect your GitHub repo"
        echo "5. Configure:"
        echo "   - Build Command: npm install"
        echo "   - Start Command: node server-auth.js"
        echo "6. Add environment variables"
        echo "7. Click 'Create Web Service'"
        echo ""
        echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
        ;;
    3)
        echo ""
        echo "⚡ Deploying to Vercel..."
        echo ""
        echo "Installing Vercel CLI..."
        npm install -g vercel
        echo ""
        echo "Deploying..."
        vercel
        echo ""
        echo "Add environment variables in Vercel dashboard"
        echo "Then run: vercel --prod"
        echo ""
        echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
        ;;
    4)
        echo ""
        echo "🌐 Deploying to Netlify..."
        echo ""
        echo "Note: Netlify works best for static sites."
        echo "For full-stack apps, consider Railway or Render."
        echo ""
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
        echo ""
        echo "Deploying..."
        netlify deploy
        echo ""
        echo "For production: netlify deploy --prod"
        echo ""
        echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment instructions shown above!"
echo "📚 For detailed guide, see: DEPLOYMENT_GUIDE.md"
echo ""

