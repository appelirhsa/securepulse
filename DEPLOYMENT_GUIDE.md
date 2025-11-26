# 🚀 Deploying SecurePulse Backend to Production

Since GitHub Pages only hosts **static files**, the backend API needs to be deployed separately. Here are the recommended deployment options:

## Option 1: Heroku (Easiest - Free tier available)

### Step 1: Create Heroku Account
1. Go to https://www.heroku.com
2. Sign up for a free account
3. Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Deploy from GitHub
```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create securepulse-api

# Add PostgreSQL database
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_jwt_secret_key
heroku config:set NODE_ENV=production

# Deploy from GitHub
git push heroku main
```

### Step 3: Update Frontend Configuration
In `api.js`, change the production URL:
```javascript
const isGitHubPages = window.location.hostname === 'appelirhsa.github.io';
this.baseURL = isGitHubPages 
  ? 'https://securepulse-api.herokuapp.com'
  : 'http://localhost:5000';
```

### Step 4: Push Updated Code
```bash
git add api.js
git commit -m "Update backend URL for production"
git push origin gh-pages
```

---

## Option 2: Render.com (Modern, Generous Free Tier)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Create a new Web Service

### Step 2: Connect Repository
1. Select your GitHub repository
2. Set branch to `main`
3. Set build command: `npm install`
4. Set start command: `node server.js`

### Step 3: Add Environment Variables
In Render dashboard:
```
PORT=5000
NODE_ENV=production
DB_HOST=[your-postgres-host]
DB_USER=postgres
DB_PASSWORD=[secure-password]
DB_NAME=securepulse
JWT_SECRET=[jwt-secret]
```

### Step 4: Add PostgreSQL Database
1. Create a PostgreSQL database on Render
2. Use the connection details in environment variables
3. Deploy will happen automatically

### Step 5: Update Frontend URL
```javascript
this.baseURL = isGitHubPages 
  ? 'https://securepulse-backend.onrender.com'
  : 'http://localhost:5000';
```

---

## Option 3: Railway.app (Simple & Powerful)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign in with GitHub
3. Create new project

### Step 2: Add Services
1. Add PostgreSQL database
2. Add Node.js service from GitHub

### Step 3: Configure
Set environment variables in Railway dashboard and deploy

---

## Option 4: AWS Elastic Beanstalk (Enterprise)

For larger scale deployments, use AWS Elastic Beanstalk with RDS PostgreSQL.

---

## 🔄 Connecting Frontend to Backend

### Current Configuration
The frontend (`api.js`) automatically detects the environment:

```javascript
const isGitHubPages = window.location.hostname === 'appelirhsa.github.io';
this.baseURL = isGitHubPages 
  ? 'https://your-backend-url.com' // Production backend
  : 'http://localhost:5000';        // Local development
```

### Local Development
- Frontend: http://localhost:5000 (served by Express)
- Backend: http://localhost:5000 (same Express server)
- API calls work automatically

### Production with GitHub Pages + Separate Backend
- Frontend: https://appelirhsa.github.io/securepulse/
- Backend: https://your-backend-url.com
- API calls use the backend URL from environment detection

---

## 📋 Deployment Checklist

- [ ] Choose backend hosting (Heroku, Render, Railway, AWS)
- [ ] Deploy backend with PostgreSQL database
- [ ] Get production backend URL
- [ ] Update `api.js` with production URL
- [ ] Push changes to `gh-pages` branch
- [ ] Enable GitHub Pages in repository settings
- [ ] Test at https://appelirhsa.github.io/securepulse/

---

## ✅ Testing Production Deployment

### 1. Test Frontend on GitHub Pages
```
https://appelirhsa.github.io/securepulse/
```

### 2. Test API Connection
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try registering an account
4. Check Network tab to see API calls
5. Verify calls go to your backend URL

### 3. Test Full Flow
1. Register new account
2. Login
3. Access dashboard
4. View health data
5. Update profile

---

## 🐛 Troubleshooting

### "API is not responding"
- Check if backend is deployed and running
- Verify backend URL in `api.js`
- Check CORS settings in `server.js`
- View browser console for detailed errors

### "CORS Error"
- Backend needs CORS enabled for GitHub Pages domain
- In `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5000', 'https://appelirhsa.github.io'],
  credentials: true
}));
```

### "Database connection failed"
- Verify PostgreSQL database is running on hosting platform
- Check connection credentials in environment variables
- Ensure database name is correct

### "Authentication not working"
- Check JWT_SECRET is set in environment variables
- Verify token is saved in localStorage
- Check browser DevTools Storage tab for authToken

---

## 🔗 Quick Links

- **GitHub Pages**: https://appelirhsa.github.io/securepulse/
- **Heroku**: https://www.heroku.com
- **Render**: https://render.com
- **Railway**: https://railway.app
- **AWS**: https://aws.amazon.com/elasticbeanstalk/

---

## 📝 After Deployment

1. **Monitor Backend**
   - Use hosting platform's dashboard
   - Set up error alerts
   - Monitor database usage

2. **Scale Database**
   - As users grow, upgrade PostgreSQL tier
   - Enable automated backups
   - Set up replication for redundancy

3. **Optimize Performance**
   - Add CDN for static files
   - Enable database indexing
   - Implement caching strategies

4. **Security**
   - Enable HTTPS (automatic on most platforms)
   - Rotate JWT secret regularly
   - Monitor for suspicious activity
   - Keep dependencies updated

---

**Need help?** Check the main README.md for more information.

Designed in South Africa 🇿🇦 • Protecting the world 🌍
