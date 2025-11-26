# PostgreSQL Setup Guide for SecurePulse

## Quick Start with PostgreSQL

Your backend now uses **PostgreSQL** instead of MongoDB. This guide will help you get it running quickly.

## Option 1: Docker (Easiest - Recommended)

If you have Docker installed:

```bash
docker-compose up --build
```

This will automatically:
- Start PostgreSQL container
- Create the `securepulse` database
- Run the Node.js backend
- Auto-create all tables

The server runs on `http://localhost:5000`

**Stop containers:**
```bash
docker-compose down
```

## Option 2: Local PostgreSQL Setup

### Windows

1. **Download PostgreSQL Installer**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 16 (latest)

2. **Run Installer**
   - Click through the installer
   - **Important:** Remember the postgres password you set!
   - Choose default port 5432
   - Install pgAdmin (optional, for GUI management)

3. **Verify Installation**
   ```powershell
   psql --version
   ```

4. **Create Database**
   ```powershell
   psql -U postgres
   ```
   Then in psql console:
   ```sql
   CREATE DATABASE securepulse;
   \q
   ```

5. **Update .env**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=securepulse
   DB_USER=postgres
   DB_PASSWORD=<your_password_from_install>
   ```

6. **Start Backend**
   ```powershell
   npm run dev
   ```

### Mac

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb securepulse

# Verify
psql -U postgres -l
```

Update `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securepulse
DB_USER=postgres
DB_PASSWORD=postgres
```

Then start:
```bash
npm run dev
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb securepulse

# Create user (optional)
sudo -u postgres psql
```

In psql:
```sql
CREATE USER securepulse WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE securepulse TO securepulse;
\q
```

Then start:
```bash
npm run dev
```

## Option 3: Cloud PostgreSQL (Easiest for Production)

### Using Neon (Recommended - Free tier available)

1. Go to: https://neon.tech
2. Sign up for free
3. Create a project
4. Copy your connection string
5. Update `.env`:
   ```
   DB_HOST=your-neon-host.neon.tech
   DB_PORT=5432
   DB_NAME=securepulse
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```
6. Start: `npm run dev`

### Using AWS RDS

1. Create RDS PostgreSQL instance
2. Allow inbound traffic on port 5432
3. Get endpoint and credentials
4. Update `.env` with your details
5. Start: `npm run dev`

## Verify Setup

Test that everything is working:

```bash
# Health check endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running","database":"PostgreSQL"}
```

## Database Management

### Using psql CLI

```bash
# Connect to database
psql -U postgres -d securepulse

# List tables
\dt

# View schema
\d users

# Quit
\q
```

### Using pgAdmin (GUI)

1. Open pgAdmin (installed with PostgreSQL on Windows/Mac)
2. Connect to localhost:5432
3. Password: your postgres password
4. Browse databases and tables visually

### View Data with SQL

```bash
# Connect
psql -U postgres -d securepulse

# View users
SELECT * FROM "Users";

# View bracelets
SELECT * FROM "Bracelets";

# View health data
SELECT * FROM "HealthData" LIMIT 10;

# View alerts
SELECT * FROM "EmergencyAlerts";
```

## Troubleshooting

### "Connection refused" error

**Check if PostgreSQL is running:**

Windows:
```powershell
# Check services
Get-Service postgresql-x64-*
```

Mac:
```bash
brew services list
```

Linux:
```bash
sudo systemctl status postgresql
```

**Start PostgreSQL if not running:**

Windows: Use Services app or `net start postgresql-x64-16`
Mac: `brew services start postgresql@16`
Linux: `sudo systemctl start postgresql`

### "Database 'securepulse' does not exist"

Create it:
```bash
createdb -U postgres securepulse
```

Or using psql:
```bash
psql -U postgres
CREATE DATABASE securepulse;
```

### "Role 'postgres' does not exist"

Linux-specific issue. Create the role:
```bash
sudo -u postgres psql
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER ROLE postgres SUPERUSER;
```

### Tables not created

The app auto-creates tables on first run. Check server logs:
```bash
npm run dev
```

Look for `✓ PostgreSQL connected successfully` message.

If tables still don't create, manually run:
```bash
psql -U postgres -d securepulse
-- Tables created automatically by Sequelize
```

## Switching Between Databases

If you need to switch back to MongoDB or use multiple databases:

1. Keep separate `.env` files: `.env.postgres`, `.env.mongodb`
2. Update package.json to use different servers
3. Or modify `server.js` to support both

## Security Notes

**⚠️ For Production:**
- Change default `postgres` password
- Use strong, random passwords in `.env`
- Never commit `.env` to version control
- Use cloud database services (Neon, AWS RDS) instead of local
- Enable SSL/TLS connections
- Restrict database user permissions

## Next Steps

Your backend is now set up with PostgreSQL! 

✅ Tables auto-created on first run
✅ Ready for API testing
✅ All endpoints work with PostgreSQL

Test with:
```bash
curl http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Happy coding! 🚀
