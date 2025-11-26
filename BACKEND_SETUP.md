# SecurePulse Backend Setup Guide

## Overview
This is the backend server for the SecurePulse Health & Safety Wearable platform. It handles user authentication, bracelet management, health monitoring data, and emergency alerts.

**Database: PostgreSQL** (via Sequelize ORM)

## Features
- ✓ User authentication & registration
- ✓ Bracelet device management
- ✓ Real-time health data collection
- ✓ Emergency alert system
- ✓ Email & SMS notifications
- ✓ User profile management
- ✓ Emergency contact management

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher - local or cloud)
- (Optional) Gmail account for email notifications
- (Optional) Twilio account for SMS notifications

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and fill in the following:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securepulse
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Set Up PostgreSQL
**Option A: Local PostgreSQL**
```bash
# Windows - Download from: https://www.postgresql.org/download/windows/
# Mac - brew install postgresql@16
# Linux - sudo apt-get install postgresql

# Start PostgreSQL service
# Windows: Services app
# Mac: brew services start postgresql@16
# Linux: sudo systemctl start postgresql
```

**Option B: PostgreSQL Cloud (Neon, AWS RDS, etc.)**
1. Create a PostgreSQL database on your cloud provider
2. Get the connection string
3. Update `.env` with your credentials

### 4. Start the Server

**Development Mode (with auto-reload)**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/emergency-contacts` - Add emergency contact

### Bracelet Management
- `POST /api/bracelets` - Register new bracelet
- `GET /api/bracelets` - Get user's bracelets
- `PUT /api/bracelets/:braceletId` - Update bracelet status/battery

### Health Data
- `POST /api/health-data` - Submit health data
- `GET /api/health-data/:braceletId` - Get health history

### Emergency Alerts
- `POST /api/emergency-alerts` - Create emergency alert
- `GET /api/emergency-alerts` - Get user's alerts
- `PUT /api/emergency-alerts/:alertId` - Update alert status

## Example API Calls

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure_password"
  }'
```

### Register Bracelet
```bash
curl -X POST http://localhost:5000/api/bracelets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "SP-12345",
    "nickname": "My Bracelet"
  }'
```

### Submit Health Data
```bash
curl -X POST http://localhost:5000/api/health-data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "braceletId": "BRACELET_OBJECT_ID",
    "heartRate": 85,
    "bloodOxygen": 98,
    "temperature": 36.5,
    "steps": 5000
  }'
```

### Create Emergency Alert
```bash
curl -X POST http://localhost:5000/api/emergency-alerts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "braceletId": "BRACELET_OBJECT_ID",
    "alertType": "SOS",
    "description": "User triggered emergency SOS",
    "latitude": -33.9249,
    "longitude": 18.4241
  }'
```

## Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  plan: String ('Individual', 'Family', 'Organization'),
  braceletCount: Number,
  emergencyContacts: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Bracelets
```javascript
{
  userId: ObjectId,
  deviceId: String (unique),
  nickname: String,
  status: String ('active', 'inactive', 'lost'),
  battery: Number (0-100),
  lastSync: Date
}
```

### Health Data
```javascript
{
  braceletId: ObjectId,
  userId: ObjectId,
  heartRate: Number,
  bloodOxygen: Number,
  temperature: Number,
  steps: Number,
  timestamp: Date
}
```

### Emergency Alerts
```javascript
{
  userId: ObjectId,
  braceletId: ObjectId,
  alertType: String ('SOS', 'Fall', 'Tamper', 'Health', 'Geofence'),
  description: String,
  latitude: Number,
  longitude: Number,
  status: String ('active', 'resolved', 'false_alarm'),
  createdAt: Date,
  respondedAt: Date
}
```

## Email Setup (Gmail)

1. Enable 2-factor authentication on Gmail
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use this App Password in `.env` as `EMAIL_PASSWORD`

## SMS Setup (Twilio)

1. Create account at https://www.twilio.com
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env`

## Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI, then:
heroku create securepulse-backend
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### Deploy to AWS/DigitalOcean
See deployment guides in the docs folder.

## Security Considerations

- ✓ All passwords are bcrypt hashed
- ✓ JWT tokens expire after 7 days
- ✓ CORS enabled for trusted origins only
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting
- ⚠️ Add input validation and sanitization
- ⚠️ Use environment variables for all secrets

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify username/password for MongoDB Atlas

**Email not sending**
- Enable "Less secure app access" or use App Password
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

**JWT Authentication fails**
- Verify token is included in Authorization header
- Check JWT_SECRET matches

## Support
For issues or questions: hello@securepulse.co.za

## License
MIT
