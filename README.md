# SecurePulse - Health & Safety Wearable Website# securepulse

Health and Safety Bracelet's dashboard.

A complete full-stack web application for SecurePulse, an innovative wearable device designed to monitor health and ensure safety with real-time alerts.

## 📋 Features

### Frontend
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Navbar Hide-on-Scroll**: Navigation bar disappears when scrolling down for better UX
- **Authentication Modal**: Integrated login/registration with smooth transitions
- **Dashboard**: Personalized health monitoring and device management
- **Help Center**: Comprehensive FAQ and support documentation
- **Real-time Health Metrics**: Display heart rate, blood oxygen, temperature, and device status

### Backend (Express.js + PostgreSQL)
- **User Authentication**: JWT tokens with secure password hashing (bcryptjs)
- **User Management**: Profile updates, emergency contacts
- **Device Management**: Register and manage multiple bracelets
- **Health Data Tracking**: Record and monitor health metrics with anomaly detection
- **Emergency Alert System**: Create and manage emergency alerts (SOS, Fall, Tamper, Health, Geofence)
- **RESTful API**: All endpoints follow REST conventions
- **CORS Enabled**: Frontend and backend communicate seamlessly

### Database
- **PostgreSQL** with **Sequelize ORM**
- 5 models with relationships:
  - User (with plan types: individual, family, organization)
  - Bracelet (device management)
  - HealthData (metrics with anomaly detection)
  - EmergencyAlert (alert types and status tracking)
  - EmergencyContact (trusted contacts)

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 16
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/appelirhsa/securepulse.git
cd securepulse
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the project root:
```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securepulse
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps
GOOGLE_MAPS_API_KEY=your-api-key

# Stripe
STRIPE_PUBLIC_KEY=your-public-key
STRIPE_SECRET_KEY=your-secret-key
```

4. **Set up PostgreSQL Database**
```bash
# Create database
createdb securepulse

# Optionally, create a user
createuser -P postgres
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
node server.js
```

6. **Access the website**
- Open http://localhost:5000 in your browser

## 📁 Project Structure

```
securepulse/
├── public/                    # Frontend files (served as static)
│   ├── index.html            # Homepage with hero, features, pricing
│   ├── dashboard.html        # User dashboard
│   ├── help-center.html      # Help and FAQ
│   ├── about.html            # About page
│   ├── contact.html          # Contact form
│   ├── product.html          # Product details
│   ├── how.html              # How it works
│   ├── otp.html              # OTP verification
│   ├── mainSP.js             # Frontend logic (auth modal, navbar scroll)
│   ├── api.js                # API client class
│   ├── styleSP.css           # Global styles
│   └── images/               # Images
├── services/
│   ├── emailService.js       # Email notifications (Nodemailer)
│   └── smsService.js         # SMS alerts (Twilio)
├── config/
│   └── database.js           # Database utilities
├── server.js                 # Main Express application
├── package.json              # Dependencies
├── .env                      # Environment configuration (create locally)
├── docker-compose.yml        # Docker setup for PostgreSQL + Node
├── Dockerfile                # Node.js container image
├── .dockerignore             # Files to ignore in Docker build
└── README.md                 # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/emergency-contacts` - Add emergency contact

### Bracelets
- `POST /api/bracelets` - Register new bracelet
- `GET /api/bracelets` - List user's bracelets
- `PUT /api/bracelets/:id` - Update bracelet

### Health Data
- `POST /api/health-data` - Record health metrics
- `GET /api/health-data` - Get health data

### Emergency Alerts
- `POST /api/emergency-alerts` - Create emergency alert
- `GET /api/emergency-alerts` - List alerts
- `PUT /api/emergency-alerts/:id` - Update alert status

### Health Check
- `GET /api/health` - Server health status

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down -v
```

### Docker Setup Includes:
- PostgreSQL 16 database
- Node.js backend application
- Health checks for both services
- Automatic database initialization
- Volume persistence for data

## 🧪 Testing

Example API calls using curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'

# Get profile (use token from login response)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 Frontend Features

### Homepage (`index.html`)
- **Hero Section**: Compelling product introduction
- **Features Grid**: 4 key features with icons
- **How It Works**: 4-step process visualization
- **Pricing Plans**: Individual, Family, Organization
- **About Section**: Mission statement
- **Contact**: Get in touch section

### Dashboard (`dashboard.html`)
- **Overview**: Real-time health metrics (heart rate, O2, temperature)
- **My Bracelets**: Device management with battery status
- **Health Data**: Historical health information
- **Alerts**: Emergency alert history
- **Profile**: User settings and emergency contacts
- **Responsive Sidebar**: Easy navigation

### Help Center (`help-center.html`)
- **Search Functionality**: Search articles and FAQs
- **4 Categories**: Getting Started, Troubleshooting, Account, Safety
- **20+ FAQs**: Comprehensive Q&A
- **Contact Section**: Multiple support channels

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: 7-day token expiry
- **CORS Protection**: Configured origins
- **Data Encryption**: All sensitive data encrypted
- **SQL Injection Prevention**: Sequelize ORM protection
- **Input Validation**: Server-side validation on all endpoints

## 📊 Database Schema

### User
- id (UUID, Primary Key)
- name, email (unique), password
- phone, plan (enum: individual/family/organization)
- emergencyContacts (one-to-many relation)

### Bracelet
- id (UUID, Primary Key)
- userId (Foreign Key)
- deviceId (unique)
- nickname, batteryLevel, lastSync

### HealthData
- id (UUID, Primary Key)
- userId, braceletId (Foreign Keys)
- heartRate, bloodOxygen, temperature
- timestamp, anomalyDetected

### EmergencyAlert
- id (UUID, Primary Key)
- userId (Foreign Key)
- type (enum: SOS/Fall/Tamper/Health/Geofence)
- status (enum: active/resolved/false_alarm)
- location, createdAt, resolvedAt

### EmergencyContact
- id (UUID, Primary Key)
- userId (Foreign Key)
- name, phone, email

## 📝 Notes

- The dashboard requires authentication - users must login first
- All API requests to protected endpoints require JWT token
- Health data anomaly detection triggers alerts for HR>120 or HR<50
- Emergency contacts receive SMS/email notifications on alert
- Battery level displays on device status card

## 🤝 Contributing

To contribute to SecurePulse:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 📞 Support

For support, email: support@securepulse.com or visit: https://github.com/appelirhsa/securepulse

## 👨‍💻 Author

**Aphiwe Mthembu**
- Portfolio: https://appelirhsa.co.za
- GitHub: https://github.com/appelirhsa

---

**Designed in South Africa. Protecting the world.**
