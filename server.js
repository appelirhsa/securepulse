const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============ DATABASE SETUP ============

const sequelize = new Sequelize(
  process.env.DB_NAME || 'securepulse',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Test connection
sequelize.authenticate().then(() => {
  console.log('✓ PostgreSQL connected successfully');
}).catch(err => {
  console.error('✗ PostgreSQL connection error:', err.message);
  console.warn('⚠️ Server will run but database operations will fail until PostgreSQL is available');
});

// ============ MODELS ============

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: DataTypes.STRING,
  plan: {
    type: DataTypes.ENUM('Individual', 'Family', 'Organization'),
    defaultValue: 'Individual',
  },
  braceletCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  timestamps: true,
});

// Bracelet Model
const Bracelet = sequelize.define('Bracelet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  deviceId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  nickname: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'lost'),
    defaultValue: 'active',
  },
  battery: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
  lastSync: DataTypes.DATE,
}, {
  timestamps: true,
});

// Health Data Model
const HealthData = sequelize.define('HealthData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  braceletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Bracelet,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  heartRate: DataTypes.INTEGER,
  bloodOxygen: DataTypes.FLOAT,
  temperature: DataTypes.FLOAT,
  steps: DataTypes.INTEGER,
  timestamp: DataTypes.DATE,
}, {
  timestamps: false,
  createdAt: 'timestamp',
  updatedAt: false,
});

// Emergency Alert Model
const EmergencyAlert = sequelize.define('EmergencyAlert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  braceletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Bracelet,
      key: 'id',
    },
  },
  alertType: {
    type: DataTypes.ENUM('SOS', 'Fall', 'Tamper', 'Health', 'Geofence'),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('active', 'resolved', 'false_alarm'),
    defaultValue: 'active',
  },
  respondedAt: DataTypes.DATE,
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
});

// Emergency Contact Model
const EmergencyContact = sequelize.define('EmergencyContact', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
}, {
  timestamps: true,
});

// Define associations
User.hasMany(Bracelet, { foreignKey: 'userId' });
Bracelet.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(HealthData, { foreignKey: 'userId' });
HealthData.belongsTo(User, { foreignKey: 'userId' });

Bracelet.hasMany(HealthData, { foreignKey: 'braceletId' });
HealthData.belongsTo(Bracelet, { foreignKey: 'braceletId' });

User.hasMany(EmergencyAlert, { foreignKey: 'userId' });
EmergencyAlert.belongsTo(User, { foreignKey: 'userId' });

Bracelet.hasMany(EmergencyAlert, { foreignKey: 'braceletId' });
EmergencyAlert.belongsTo(Bracelet, { foreignKey: 'braceletId' });

User.hasMany(EmergencyContact, { foreignKey: 'userId', as: 'emergencyContacts' });
EmergencyContact.belongsTo(User, { foreignKey: 'userId' });

// Sync database
sequelize.sync({ alter: true }).catch(err => {
  console.error('Database sync error:', err.message);
});

// ============ MIDDLEWARE ============

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ============ AUTHENTICATION ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ USER ROUTES ============

// Get User Profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: EmergencyContact, as: 'emergencyContacts' }],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, plan } = req.body;
    await User.update(
      { name, phone, plan },
      { where: { id: req.user.id } }
    );
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Emergency Contact
app.post('/api/users/emergency-contacts', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const contact = await EmergencyContact.create({
      userId: req.user.id,
      name,
      phone,
      email,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ BRACELET ROUTES ============

// Register Bracelet
app.post('/api/bracelets', authenticateToken, async (req, res) => {
  try {
    const { deviceId, nickname } = req.body;

    const bracelet = await Bracelet.create({
      userId: req.user.id,
      deviceId,
      nickname: nickname || `Bracelet ${deviceId.slice(-4)}`,
    });

    res.status(201).json({ message: 'Bracelet registered', bracelet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Bracelets
app.get('/api/bracelets', authenticateToken, async (req, res) => {
  try {
    const bracelets = await Bracelet.findAll({
      where: { userId: req.user.id },
    });
    res.json(bracelets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Bracelet Status
app.put('/api/bracelets/:braceletId', authenticateToken, async (req, res) => {
  try {
    const { status, battery, nickname } = req.body;

    await Bracelet.update(
      { status, battery, nickname, lastSync: new Date() },
      { where: { id: req.params.braceletId, userId: req.user.id } }
    );

    const bracelet = await Bracelet.findByPk(req.params.braceletId);
    res.json(bracelet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH DATA ROUTES ============

// Post Health Data (from wearable)
app.post('/api/health-data', authenticateToken, async (req, res) => {
  try {
    const { braceletId, heartRate, bloodOxygen, temperature, steps } = req.body;

    const healthData = await HealthData.create({
      braceletId,
      userId: req.user.id,
      heartRate,
      bloodOxygen,
      temperature,
      steps,
      timestamp: new Date(),
    });

    // Check for anomalies
    if (heartRate > 120 || heartRate < 50) {
      await EmergencyAlert.create({
        userId: req.user.id,
        braceletId,
        alertType: 'Health',
        description: `Abnormal heart rate detected: ${heartRate} bpm`,
      });
    }

    res.status(201).json({ message: 'Health data recorded', healthData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Health Data
app.get('/api/health-data/:braceletId', authenticateToken, async (req, res) => {
  try {
    const healthData = await HealthData.findAll({
      where: {
        braceletId: req.params.braceletId,
        userId: req.user.id,
      },
      order: [['timestamp', 'DESC']],
      limit: 100,
    });

    res.json(healthData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EMERGENCY ALERT ROUTES ============

// Create Emergency Alert
app.post('/api/emergency-alerts', authenticateToken, async (req, res) => {
  try {
    const { braceletId, alertType, description, latitude, longitude } = req.body;

    const alert = await EmergencyAlert.create({
      userId: req.user.id,
      braceletId,
      alertType,
      description,
      latitude,
      longitude,
    });

    res.status(201).json({ message: 'Emergency alert created', alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Emergency Alerts
app.get('/api/emergency-alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = await EmergencyAlert.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Alert Status
app.put('/api/emergency-alerts/:alertId', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    await EmergencyAlert.update(
      { status, respondedAt: new Date() },
      { where: { id: req.params.alertId, userId: req.user.id } }
    );

    const alert = await EmergencyAlert.findByPk(req.params.alertId);
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', database: 'PostgreSQL' });
});

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
