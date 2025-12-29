# Manual Database Table Creation Guide

## Step 1: Access Aiven MySQL Console

### Option A: Using Aiven Web Console (Easiest)

1. Go to your Aiven console: https://console.aiven.io
2. Click on your **mentorconnect-db** service
3. Click on the **"Query Editor"** tab (or "Tools" → "Query Editor")
4. You'll see a SQL query interface

### Option B: Using MySQL Client (Command Line)

If you prefer command line, install MySQL client first:

**Windows:**
```powershell
# Install via Chocolatey
choco install mysql
```

**Then connect:**
```bash
mysql -h mentorconnect-db-mentor-connect-afq.i.aivencloud.com \
      -P 16499 \
      -u avnadmin \
      -p \
      --ssl-mode=REQUIRED \
      defaultdb
```
(Enter your password when prompted)

---

## Step 2: Run the SQL Script

### Using Aiven Query Editor:

1. **Open the SQL file**: Open `database_schema.sql` from your project
2. **Copy all the SQL** (Ctrl+A, then Ctrl+C)
3. **Paste into Aiven Query Editor**
4. **Click "Run"** or "Execute"
5. **Wait** for completion (~10 seconds)

You should see:
```
Query OK, 0 rows affected
```
for each table created.

### Using MySQL Client:

```bash
# Navigate to your project directory
cd "C:\Users\Nishant Singh\Desktop\mentor-connect\MentorConnect-Backend"

# Run the script
mysql -h mentorconnect-db-mentor-connect-afq.i.aivencloud.com \
      -P 16499 \
      -u avnadmin \
      -p \
      --ssl-mode=REQUIRED \
      defaultdb < database_schema.sql
```

---

## Step 3: Verify Tables Were Created

Run this query in Aiven Query Editor or MySQL client:

```sql
SHOW TABLES;
```

**Expected output:**
```
+-------------------------+
| Tables_in_defaultdb     |
+-------------------------+
| availabilities          |
| bookings                |
| mentor_previous_companies|
| mentor_profiles         |
| mentor_skills           |
| payments                |
| users                   |
+-------------------------+
7 rows in set
```

### Verify Table Structure:

```sql
DESCRIBE users;
DESCRIBE mentor_profiles;
DESCRIBE bookings;
```

---

## Step 4: Restart Your Render Service

After creating the tables manually:

1. Go to **Render Dashboard**
2. Click on your **mentorconnect-backend** service
3. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
   OR just click **"Restart"**
4. Wait for the service to restart

---

## Step 5: Test Your Backend

### Test Health Endpoint:
```
https://your-app.onrender.com/api/health
```

**Expected:**
```json
{
  "status": "UP",
  "service": "MentorConnect Backend",
  "timestamp": 1735300417000
}
```

### Test Registration:
```bash
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "role": "MENTEE"
  }'
```

**Expected:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "test@example.com",
  "role": "MENTEE"
}
```

---

## Tables Created

1. **users** - Base user accounts (mentors and mentees)
2. **mentor_profiles** - Extended mentor information
3. **mentor_skills** - Skills list for each mentor (many-to-one)
4. **mentor_previous_companies** - Previous companies (many-to-one)
5. **availabilities** - Mentor availability schedule
6. **bookings** - Session bookings between mentors and mentees
7. **payments** - Payment records for bookings

---

## Troubleshooting

### Error: "Access denied"
**Solution**: Check your Aiven password. You can reset it in Aiven Console → Service Settings → Reset Password

### Error: "Unknown database 'defaultdb'"
**Solution**: Make sure you're connecting to the correct database. The database name should be `defaultdb` (shown in your Aiven console)

### Error: "Table already exists"
**Solution**: Tables might have been partially created. You can either:
- Skip the error (use `CREATE TABLE IF NOT EXISTS`)
- Drop existing tables first (⚠️ this deletes data):
  ```sql
  DROP TABLE IF EXISTS payments;
  DROP TABLE IF EXISTS bookings;
  DROP TABLE IF EXISTS availabilities;
  DROP TABLE IF EXISTS mentor_previous_companies;
  DROP TABLE IF EXISTS mentor_skills;
  DROP TABLE IF EXISTS mentor_profiles;
  DROP TABLE IF EXISTS users;
  ```
  Then run the create script again.

### Tables Created But Application Still Errors
1. Check Render logs for the specific error
2. Verify DATABASE_URL is correct
3. Ensure all environment variables are set
4. Try restarting the Render service

---

## Next Steps

After tables are created and backend is working:

1. ✅ Test all API endpoints (registration, login, mentor listing, etc.)
2. ✅ Update your frontend to call the correct backend URL
3. ✅ Configure CORS with your frontend URL
4. ✅ Test end-to-end user flows

Your backend should now be fully functional! 🎉
