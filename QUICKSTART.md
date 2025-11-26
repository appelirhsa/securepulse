# Quick Start Guide - SecurePulse Backend

## 🚀 Fastest Setup (5 minutes with Docker)

### Prerequisites
- Docker & Docker Compose installed

### Run Everything
```bash
# 1. Navigate to project directory
cd "Safety Bracelet Website"

# 2. Start all services (MongoDB + Node.js server)
docker-compose up

# 3. Server is ready!
# Backend: http://localhost:5000
# MongoDB: mongodb://localhost:27017
```

Server will be running on `http://localhost:5000` ✅

---

## 📦 Manual Setup (without Docker)

### Prerequisites
- Node.js v14+
- MongoDB installed locally

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure .env
```bash
# Edit .env file with your configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securepulse
JWT_SECRET=your_secret_key_here
```

### Step 3: Start MongoDB
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### Step 4: Start Backend
```bash
npm run dev
```

Server will be running on `http://localhost:5000` ✅

---

## 🧪 Test the API

### 1. Check Server Health
```bash
curl http://localhost:5000/api/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the `token` from response - you'll need it for other requests.

### 4. Get User Profile (Replace TOKEN with your token)
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 📱 Use in Frontend

Add this to your HTML:
```html
<script src="api.js"></script>
<script>
  const api = new SecurePulseAPI('http://localhost:5000');

  // Register
  api.register('John Doe', 'john@example.com', 'password123')
    .then(res => console.log('Registered!', res));

  // Login
  api.login('john@example.com', 'password123')
    .then(res => console.log('Logged in!', res));

  // Get profile
  api.getProfile()
    .then(user => console.log('User:', user));
</script>
```

---

## 📊 View Database Data

### Using MongoDB Compass (GUI)
1. Download MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Browse `securepulse` database

### Using MongoDB Shell
```bash
mongosh mongodb://localhost:27017/securepulse
```

---

## 🔧 Troubleshooting

**Port 5000 already in use?**
```bash
# Change PORT in .env
PORT=3000
```

**MongoDB connection failed?**
```bash
# Check if MongoDB is running
# Windows: Services app
# Mac/Linux: brew services list
```

**API returns 401 Unauthorized?**
- You need to login first and include the token in headers
- Token format: `Authorization: Bearer YOUR_TOKEN`

---

## 📚 More Resources
- Full documentation: See `BACKEND_SETUP.md`
- API endpoints: See `server.js`
- Database schemas: See `BACKEND_SETUP.md`

Happy coding! 🎉
