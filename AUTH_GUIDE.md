# 🔐 Authentication Guide

Your Pomodoro Timer now has full authentication support using Supabase Auth!

## ✅ What's Been Added

### New Files:

- **`server-auth.js`** - Server with authentication middleware
- **`auth.html`** - Sign in/Sign up page
- **`auth.js`** - Authentication logic
- **Updated `api.js`** - All API calls now use JWT tokens
- **Updated `index.html`** - Shows user info and logout button
- **Updated `script.js`** - Checks authentication on load

## 🚀 How to Use

### 1. Start the Authentication Server

```bash
node server-auth.js
```

You should see:

```
✅ Connected to Supabase with Authentication
🚀 Pomodoro Timer server running on http://localhost:3000
☁️  Database: Supabase
🔐 Authentication: Enabled
```

### 2. Access the App

Open your browser and go to:

```
http://localhost:3000
```

You'll be automatically redirected to the login page if not authenticated.

### 3. Sign Up (New Users)

1. Click **"Sign Up"** tab
2. Enter:
   - Name (optional)
   - Email
   - Password (minimum 6 characters)
3. Click **"Sign Up"**
4. Check your email for verification (if email confirmation is enabled)
5. You'll be redirected to the app

### 4. Sign In (Existing Users)

1. Enter your email and password
2. Click **"Sign In"**
3. You'll be redirected to the app

### 5. Using the App

Once logged in:

- Your email is displayed in the header
- All your data is private to your account
- Click **"Logout"** to sign out

## 🔒 Security Features

### Authentication Flow:

1. **Sign Up/Sign In** → User credentials verified by Supabase
2. **JWT Token** → Secure token stored in localStorage
3. **API Calls** → All requests include `Authorization: Bearer <token>` header
4. **Token Verification** → Server verifies token on every request
5. **Protected Routes** → Unauthenticated users redirected to login

### Security Benefits:

✅ **Secure Authentication** - Industry-standard JWT tokens
✅ **Password Hashing** - Passwords never stored in plain text
✅ **Token Expiration** - Tokens expire for security
✅ **User Isolation** - Each user only sees their own data
✅ **HTTPS Ready** - Works with SSL/TLS encryption
✅ **Email Verification** - Optional email confirmation

## 📊 Database Updates

The database now uses `user_id` from authenticated users:

```sql
-- All tables now use auth.users.id
user_id TEXT NOT NULL  -- Supabase auth user ID (UUID)
```

### Row Level Security (RLS)

RLS policies ensure users can only access their own data:

```sql
-- Example policy
CREATE POLICY "Users can only see their own data"
ON tasks FOR SELECT
USING (auth.uid()::text = user_id);
```

## 🎯 API Endpoints

### Authentication Endpoints:

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/user` - Get current user

### Protected Endpoints (require authentication):

- `GET /api/data` - Get user data
- `POST /api/sessions` - Save session
- `POST /api/tasks` - Add task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/activities` - Add activity
- `DELETE /api/activities` - Clear activities
- `GET /api/export` - Export data

## 🔄 Server Options

You now have 3 server options:

### 1. Authentication Server (Recommended)

```bash
node server-auth.js
```

- ✅ Full authentication
- ✅ Secure JWT tokens
- ✅ User isolation
- ✅ Production-ready

### 2. Supabase Server (No Auth)

```bash
node server-supabase.js
```

- ⚠️ No authentication
- ⚠️ Uses user_id header
- ⚠️ Less secure

### 3. SQLite Server (Local)

```bash
node server.js
```

- ⚠️ No authentication
- ⚠️ Local database only
- ⚠️ Single user

## 🎨 User Interface

### Login Page Features:

- **Tab Switching** - Toggle between Sign In and Sign Up
- **Form Validation** - Email and password validation
- **Error Messages** - Clear error feedback
- **Success Messages** - Confirmation messages
- **Loading States** - Visual feedback during requests
- **Responsive Design** - Works on all devices

### Main App Features:

- **User Email Display** - Shows logged-in user
- **Logout Button** - Easy sign out
- **Protected Routes** - Auto-redirect if not authenticated
- **Session Persistence** - Stays logged in across page reloads

## 🧪 Testing Authentication

### Test Sign Up:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Test Sign In:

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Protected Endpoint:

```bash
curl http://localhost:3000/api/data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Configuration

### Environment Variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
```

### Supabase Auth Settings:

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Configure:
   - Email confirmation (optional)
   - Password requirements
   - Session duration
   - OAuth providers (optional)

## 🚀 Production Deployment

### Enable HTTPS:

```javascript
// In server-auth.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
};

https.createServer(options, app).listen(PORT);
```

### Environment Variables:

```bash
# Production
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
```

## 📱 Mobile Support

The authentication system works on mobile devices:

- ✅ Responsive login page
- ✅ Touch-friendly buttons
- ✅ Mobile keyboard support
- ✅ Session persistence

## 🆘 Troubleshooting

### "Missing Supabase credentials"

- Check `.env` file has correct credentials
- Restart the server

### "Invalid token"

- Token may be expired
- Sign out and sign in again
- Check token in localStorage

### "Failed to sign in"

- Check email and password are correct
- Verify email is confirmed (if required)
- Check Supabase dashboard for errors

### "Redirect loop"

- Clear localStorage
- Check authentication check in code
- Verify server is running

## 🎉 Benefits

### Security:

- ✅ Industry-standard authentication
- ✅ Secure password storage
- ✅ JWT token security
- ✅ User data isolation

### User Experience:

- ✅ Simple sign up/sign in
- ✅ Persistent sessions
- ✅ Easy logout
- ✅ Clear error messages

### Developer Experience:

- ✅ Easy to implement
- ✅ Well-documented
- ✅ Scalable architecture
- ✅ Production-ready

## 📚 Next Steps

### Optional Enhancements:

1. **Password Reset**

   - Add "Forgot Password" functionality
   - Email reset links

2. **Social Login**

   - Google OAuth
   - GitHub OAuth
   - Facebook OAuth

3. **Two-Factor Authentication**

   - SMS verification
   - Authenticator app

4. **Profile Management**

   - Update user profile
   - Change password
   - Account settings

5. **Remember Me**
   - Extended session duration
   - Persistent login

---

**Your Pomodoro Timer is now fully secured with authentication! 🔐🍅**
