# Fix for Aiven MySQL Table Creation Issue

## Problem
Error: `Table 'defaultdb.mentor_skills' doesn't exist`

**Cause**: Aiven MySQL requires specific SSL connection parameters. Your current DATABASE_URL is missing these.

---

## Solution

### Step 1: Update DATABASE_URL on Render

1. Go to **Render Dashboard** → Your Service → **Environment**
2. Find the `DATABASE_URL` variable
3. **Update it** with these parameters:

**Old URL** (what you have):
```
jdbc:mysql://mentorconnect-db-mentor-connect-afq.i.aivencloud.com:16499/defaultdb?sslmode=require
```

**New URL** (what you need):
```
jdbc:mysql://mentorconnect-db-mentor-connect-afq.i.aivencloud.com:16499/defaultdb?useSSL=true&requireSSL=true&verifyServerCertificate=false&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
```

### Step 2: Save and Redeploy

1. Click **Save Changes** in Render
2. Render will automatically redeploy
3. Wait 2-3 minutes for deployment

### Step 3: Monitor Logs

1. Go to **Render Dashboard** → **Logs**
2. Watch for:
   ```
   Hibernate: create table mentor_skills ...
   ```
3. You should see Hibernate creating all tables

---

## What Each Parameter Does

- `useSSL=true` - Enable SSL connection (Aiven requires this)
- `requireSSL=true` - Enforce SSL (don't fallback to non-SSL)
- `verifyServerCertificate=false` - Skip certificate verification (for Aiven free tier)
- `allowPublicKeyRetrieval=true` - Allow fetching public key for authentication
- `createDatabaseIfNotExist=true` - Auto-create database if missing

---

## Verify Tables Were Created

After redeployment, test the health endpoint:
```
https://your-app.onrender.com/api/health
```

Then try the registration endpoint again - it should work now!

---

## Alternative: Manually Create Tables (If Above Doesn't Work)

If the auto-creation still fails, you can manually create tables:

### Option 1: Use Aiven Console

1. Go to Aiven Console → Your MySQL Service
2. Click **"Query Editor"** or **"Tools"**
3. Connect to your database
4. Run the SQL creation scripts (I can generate these if needed)

### Option 2: Use MySQL Client

```bash
mysql -h mentorconnect-db-mentor-connect-afq.i.aivencloud.com \
      -P 16499 \
      -u avnadmin \
      -p \
      --ssl-mode=REQUIRED \
      defaultdb
```

Then run CREATE TABLE statements.

---

## If Still Getting Errors

Share these with me:
1. Current DATABASE_URL value (hide password)
2. Full error from Render logs
3. Any Aiven connection errors

I'll help debug further!
