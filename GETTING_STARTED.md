# 🚀 SecurePulse - Running Your Website

Your SecurePulse website is now fully functional! Here's everything you need to get it running.

## 📋 What You Have

Your project includes:

### **Frontend (HTML/CSS/JavaScript)**
- ✅ **Homepage** (`index.html`) - Hero, features, pricing, about, contact
- ✅ **Dashboard** (`dashboard.html`) - Health monitoring, device management, alerts, profile
- ✅ **Help Center** (`help-center.html`) - FAQs, troubleshooting, contact support
- ✅ **Authentication** - Login/Register modal integrated into homepage
- ✅ **Navbar Hide-on-Scroll** - Navigation disappears when scrolling down
- ✅ **API Client** (`api.js`) - JavaScript class for backend communication

### **Backend (Express.js + PostgreSQL)**
- ✅ **User Authentication** - JWT tokens, password hashing
- ✅ **User Management** - Profiles, emergency contacts
- ✅ **Device Management** - Register and manage bracelets
- ✅ **Health Tracking** - Record and monitor health metrics
- ✅ **Emergency Alerts** - Create and manage emergency alerts
- ✅ **Email/SMS Services** - Nodemailer and Twilio integration

### **Database**
- ✅ **PostgreSQL** - 5 models with relationships
- ✅ **Sequelize ORM** - Automatic schema management

---

## 🎯 Getting Started (Choose One)

### **Option 1: Local Development (Recommended for Testing)**

#### Step 1: Install PostgreSQL
- Download from https://www.postgresql.org/download/
- During installation, set password for `postgres` user (e.g., "postgres")
- Note the port (default: 5432)

#### Step 2: Create Database
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE securepulse;

# Exit
\q
```

#### Step 3: Install Node Dependencies
```bash
cd "c:\Users\aphiw\OneDrive\Documents\Documents\Absa Challenge 2025\Safety Bracelet Website"
npm install
```

#### Step 4: Configure Environment
Create `.env` file with:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=securepulse
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_super_secret_jwt_key_12345

# Optional (leave as-is for demo)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Step 5: Start the Server
```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
node server.js
```

You should see:
```
✓ PostgreSQL connected successfully
Server running on http://localhost:5000
```

#### Step 6: Open in Browser
```
http://localhost:5000
```

---

### **Option 2: Docker (Containerized)**

#### Step 1: Install Docker
- Download from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

#### Step 2: Build and Run
```bash
cd "c:\Users\aphiw\OneDrive\Documents\Documents\Absa Challenge 2025\Safety Bracelet Website"

# Build images
docker-compose build

# Start containers
docker-compose up -d
```

#### Step 3: Check Status
```bash
docker-compose ps

# Should show:
# STATUS: Up (healthy) for both securepulse-postgres and securepulse-backend
```

#### Step 4: View Logs
```bash
docker-compose logs -f securepulse-backend
```

#### Step 5: Open in Browser
```
http://localhost:5000
```

---

## 🌐 Website Features

### **Homepage** (`/`)
- Hero section with CTA buttons
- 4 key features showcase
- How it works (4-step process)
- Pricing plans (Individual, Family, Organization)
- About section
- Contact information

### **Authentication** (Modal on Homepage)
- **Login Tab**: Email + Password
- **Register Tab**: Name + Email + Password
- Integrates with backend `/api/auth/register` and `/api/auth/login`
- Token stored in localStorage
- Redirects to dashboard on successful auth

### **Dashboard** (`/dashboard.html`)
*Requires login*

**Overview Section**:
- Real-time health metrics (Heart Rate, O2, Temperature, Bracelet Status)

**My Bracelets**:
- List connected devices
- Battery level indicator
- Add new bracelet button

**Health Data**:
- Average heart rate (last 24h)
- Lowest O2 level
- Highest temperature

**Alerts**:
- Emergency alert history
- Alert type and status
- Timestamps

**Profile**:
- Update name, phone, plan
- Manage emergency contacts
- Add contact button

**Logout**:
- Clears auth token
- Returns to homepage

### **Help Center** (`/help-center.html`)
- Search functionality
- 4 categories (Getting Started, Troubleshooting, Account, Safety)
- 15+ FAQs with expandable answers
- Contact support section

---

## 🧪 Testing the API

### **Test User Registration**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john@example.com\",
    \"password\": \"SecurePassword123\"
  }"
```

Expected response:
```json
{
  "message": "User registered successfully",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### **Test Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"john@example.com\",
    \"password\": \"SecurePassword123\"
  }"
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Test Protected Endpoint**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Test Health Check**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "database": "PostgreSQL"
}
```

---

## 🛠️ Troubleshooting

### **"Port 5000 already in use"**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual number)
taskkill /PID PID /F

# Or change port in .env
PORT=5001
```

### **"Cannot connect to PostgreSQL"**
- Make sure PostgreSQL is running
- Check connection credentials in `.env`
- Verify database exists: `psql -U postgres -d securepulse`

### **"ModuleNotFound: sequelize"**
```bash
npm install
npm install sequelize pg pg-hstore
```

### **"CORS Error"**
- CORS is already configured in server.js
- If issues persist, check API base URL in `public/api.js`

### **Login not working**
- Make sure backend is running (check http://localhost:5000/api/health)
- Check browser console for errors (F12 > Console tab)
- Verify database connection is successful

---

## 📦 Project Files

```
securepulse/
├── public/                        # Frontend (served as static)
│   ├── index.html                # Homepage with auth modal
│   ├── dashboard.html            # User dashboard
│   ├── help-center.html          # Help center
│   ├── mainSP.js                 # Frontend logic
│   ├── api.js                    # API client
│   ├── styleSP.css               # Styles
│   └── images/                   # Images
├── server.js                     # Express app + Sequelize models
├── package.json                  # Dependencies
├── .env                          # Configuration (create this)
├── docker-compose.yml            # Docker setup
├── Dockerfile                    # Node container
└── README.md                     # Full documentation
```

---

## 📊 Database

Once running, your database automatically includes:

**Tables**:
- `users` - User accounts
- `bracelets` - Connected devices
- `health_data` - Health metrics
- `emergency_alerts` - Emergency records
- `emergency_contacts` - Contact numbers

**Automatic Features**:
- UUID primary keys
- Foreign key relationships
- Timestamps (createdAt, updatedAt)
- Status enums (for plans, alerts)

---

## 🔒 Security Notes

- Passwords hashed with bcryptjs
- JWT tokens expire in 7 days
- CORS enabled for localhost:5000
- Database credentials in `.env` (never commit!)
- SQL injection protected via Sequelize ORM

---

## 📝 Next Steps

1. ✅ **Running locally** - Server should be accessible at http://localhost:5000
2. ✅ **Create test account** - Use the registration form on homepage
3. ✅ **Access dashboard** - See real health data and alert history
4. ✅ **Explore Help Center** - Review all features and FAQs
5. **Configure Email/SMS** (Optional) - Update Twilio/Nodemailer credentials in `.env`
6. **Deploy to Production** - Use Docker or platform like Heroku/Render

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com
- **Sequelize ORM**: https://sequelize.org
- **PostgreSQL**: https://www.postgresql.org/docs
- **JWT Auth**: https://jwt.io/introduction
- **Docker**: https://docs.docker.com/

---

## ✨ You're All Set!

Your SecurePulse website is ready to use. Choose your deployment method and start building!

**Happy coding!** 🚀

---

*Questions? Open an issue on GitHub: https://github.com/appelirhsa/securepulse/issues*
