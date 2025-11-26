# 🚀 GitHub Pages Deployment - Final Steps

Your SecurePulse website is ready to deploy to GitHub Pages! Follow these final steps to get it live at:
```
https://appelirhsa.github.io/securepulse/
```

---

## ✅ Step 1: Enable GitHub Pages (One-Time Setup)

### Via Web Browser:
1. Go to https://github.com/appelirhsa/securepulse
2. Click **Settings** (top right)
3. In left sidebar, click **Pages**
4. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for GitHub to build and deploy

### Result:
GitHub will show:
```
Your site is live at https://appelirhsa.github.io/securepulse/
```

---

## 📋 What's Deployed

### ✅ Frontend (Hosted on GitHub Pages)
- `index.html` - Homepage
- `dashboard.html` - User dashboard
- `help-center.html` - Help center
- `*.css` and `*.js` - Styles and scripts
- `images/` - Product images
- All HTML pages are static and work offline

### ⚠️ Backend API (Requires Separate Deployment)
The backend API needs to be deployed separately because GitHub Pages only hosts static files.

---

## 🔗 Backend Deployment (Choose One)

### Option A: Heroku (Easiest - 5 minutes)

**Step 1: Sign Up**
```bash
# Create account at https://www.heroku.com
# Download CLI from https://devcenter.heroku.com/articles/heroku-cli
```

**Step 2: Deploy**
```bash
# Switch to main branch
git checkout main

# Login to Heroku
heroku login

# Create app
heroku create securepulse-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set secrets
heroku config:set JWT_SECRET=your_super_secret_key_12345
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Get your backend URL
heroku apps:info securepulse-backend
# Look for "Web URL" - should be https://securepulse-backend.herokuapp.com
```

### Option B: Render.com (Modern - 10 minutes)

**Step 1: Sign Up**
- Go to https://render.com
- Sign in with GitHub
- Create new Web Service from `appelirhsa/securepulse`

**Step 2: Configure**
- Branch: `main`
- Build command: `npm install`
- Start command: `node server.js`

**Step 3: Add Database**
- Add PostgreSQL database (Render provides one)
- Copy connection details to environment variables

**Step 4: Deploy**
- Click Deploy
- Wait 5 minutes for build
- Your backend URL will be: `https://securepulse-api.onrender.com`

### Option C: Railway.app (Simple - 5 minutes)

**Step 1: Sign Up**
- Go to https://railway.app
- Sign in with GitHub
- New Project → Deploy from GitHub

**Step 2: Add Services**
- PostgreSQL database
- Node service from your repo

**Step 3: Configure**
- Set environment variables
- Deploy

---

## 🔧 Update Frontend with Backend URL

Once your backend is deployed, update the API configuration:

**File: `api.js` (line 3-8)**

Replace:
```javascript
const isGitHubPages = window.location.hostname === 'appelirhsa.github.io';
this.baseURL = isGitHubPages 
  ? 'https://securepulse-api.herokuapp.com' // Change this URL!
  : 'http://localhost:5000';
```

With your actual backend URL (example for Heroku):
```javascript
const isGitHubPages = window.location.hostname === 'appelirhsa.github.io';
this.baseURL = isGitHubPages 
  ? 'https://securepulse-backend.herokuapp.com' // Your Heroku URL
  : 'http://localhost:5000';
```

**Step 1: Edit the file**
```bash
# Edit api.js in your editor
# Change the URL to your deployed backend
```

**Step 2: Commit and push**
```bash
# Switch to gh-pages branch
git checkout gh-pages

# Copy updated api.js
cp ../public/api.js api.js

# OR if you edited api.js directly
git add api.js

# Commit
git commit -m "Update backend URL for production"

# Push to GitHub Pages
git push origin gh-pages
```

**Wait 1-2 minutes** for GitHub Pages to rebuild with the new URL.

---

## ✨ Test Your Live Website

### 1. Visit Your Website
```
https://appelirhsa.github.io/securepulse/
```

### 2. Test Home Page
- Check navbar scroll effect
- Click pricing buttons
- Verify images load

### 3. Test Authentication
- Click "Login" button
- Register new account (with your backend URL set correctly)
- Check browser console (F12) for API calls
- Should see response from your backend

### 4. Test Dashboard
- After login, should redirect to dashboard
- Should display health metrics
- Should connect to backend successfully

### 5. Test Help Center
- Click "Help Center" link
- Search FAQs
- Expand questions
- All should work smoothly

---

## 🐛 Troubleshooting

### Website loads but "Login doesn't work"
**Problem**: Backend API URL is wrong or backend isn't deployed

**Solution**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for error messages
5. Check Network tab to see API requests
6. Verify backend URL in `api.js`

### "CORS error" when clicking Login
**Problem**: Backend doesn't allow requests from GitHub Pages domain

**Solution**: Update `server.js` to allow GitHub Pages:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5000',
    'https://appelirhsa.github.io'
  ],
  credentials: true
}));
```

Then redeploy backend:
```bash
git add server.js
git commit -m "Allow GitHub Pages domain in CORS"
git push heroku main  # For Heroku
```

### "Database connection failed"
**Problem**: Backend can't connect to PostgreSQL

**Solution**:
1. Check environment variables on hosting platform
2. Verify PostgreSQL database is running
3. Check connection credentials
4. View backend logs for errors

---

## 📊 File Structure on GitHub

### `main` branch (Full project)
```
├── server.js
├── package.json
├── public/
│   ├── index.html
│   ├── dashboard.html
│   └── ...
├── services/
├── config/
└── README.md
```

### `gh-pages` branch (Frontend only)
```
├── index.html
├── dashboard.html
├── help-center.html
├── api.js        (with production backend URL)
├── mainSP.js
├── styleSP.css
├── images/
└── .nojekyll
```

---

## 🔄 Future Updates

### To Update Frontend:
```bash
# Edit files on gh-pages branch
git checkout gh-pages
# Make your changes
git add .
git commit -m "Update frontend"
git push origin gh-pages
# Wait 1-2 minutes for deployment
```

### To Update Backend:
```bash
# Edit files on main branch
git checkout main
# Make your changes
git add .
git commit -m "Update backend"
git push origin main
git push heroku main  # For Heroku deployment
```

---

## ✅ Deployment Checklist

- [ ] Enable GitHub Pages in repository settings
  - Set source to `gh-pages` branch
  - Set folder to `/ (root)`
  
- [ ] Deploy backend (Heroku, Render, or Railway)
  - Get backend URL (e.g., https://securepulse-backend.herokuapp.com)
  
- [ ] Update `api.js` with production URL
  - Change the `baseURL` for GitHub Pages
  
- [ ] Push updated `api.js` to `gh-pages` branch
  - Wait for GitHub Pages to rebuild
  
- [ ] Test website at GitHub Pages URL
  - Create account
  - Login
  - Access dashboard
  - Verify API calls work
  
- [ ] Monitor backend logs
  - Check for errors
  - Verify database connectivity

---

## 🎉 You're Live!

Your website is now accessible at:
```
🌐 https://appelirhsa.github.io/securepulse/
```

### What's working:
- ✅ Frontend pages (homepage, dashboard, help center)
- ✅ Navbar scroll hide effect
- ✅ Responsive design on all devices
- ✅ Static content and images
- ✅ Help center with search

### What needs backend:
- ✅ User authentication (when backend deployed)
- ✅ Dashboard data (when backend deployed)
- ✅ Profile management (when backend deployed)
- ✅ Emergency alerts (when backend deployed)

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| **Live Website** | https://appelirhsa.github.io/securepulse/ |
| **GitHub Repository** | https://github.com/appelirhsa/securepulse |
| **GitHub Pages Settings** | https://github.com/appelirhsa/securepulse/settings/pages |
| **Heroku Dashboard** | https://dashboard.heroku.com |
| **Render Dashboard** | https://dashboard.render.com |
| **Railway Dashboard** | https://railway.app/dashboard |

---

## 📞 Support

If you encounter issues:

1. **Check browser console** (F12 → Console)
2. **Check Network tab** (F12 → Network) for failed API calls
3. **View backend logs** (in Heroku/Render dashboard)
4. **Check GitHub Actions** (for deployment issues)

---

## 🎯 Next Steps

1. ✅ Website is live on GitHub Pages
2. ⏳ Deploy backend to your chosen platform
3. ⏳ Update `api.js` with backend URL
4. ⏳ Test full flow (register → login → dashboard)
5. ⏳ Configure custom domain (optional)
6. ⏳ Set up continuous deployment (optional)

---

**Your SecurePulse website is ready for the world!** 🚀

Designed in South Africa 🇿🇦 • Protecting the world 🌍
