# Deployment Guide - Render + Aiven (100% Free)

This guide walks you through deploying the MentorConnect Backend to **Render** (free web service) with **Aiven for MySQL** (free database).

**Total Cost: $0/month** ✅

---

## Prerequisites

- GitHub account (where your code is hosted)
- Email account for service registrations

---

## Part 1: Set Up Aiven MySQL Database (Free)

### Step 1: Create Aiven Account

1. Go to [Aiven Console](https://console.aiven.io/signup)
2. Sign up with your email or GitHub account
3. Verify your email address

### Step 2: Create Free MySQL Database

1. In the Aiven console, click **"Create service"**
2. Select **MySQL** as the service type
3. Choose **"Free plan"** (look for the $0/month option)
   - Plan: **Hobbyist** (1 GB storage, 1 CPU, 1 GB RAM)
   - Cloud provider: Choose **Google Cloud** or **AWS**
   - Region: Choose closest to you (e.g., `us-east-1` for US)
4. Give your service a name: `mentorconnect-db`
5. Click **"Create service"**

### Step 3: Wait for Database Activation

- The database will take ~5-10 minutes to provision
- Status will change from "Rebuilding" → "Running"

### Step 4: Get Database Connection Details

Once the database is running:

1. Click on your `mentorconnect-db` service
2. Go to the **"Overview"** tab
3. Note down these values (you'll need them for Render):
   - **Host**: `mentorconnect-db-xxxxx.aivencloud.com`
   - **Port**: `13306` (or similar)
   - **User**: `avnadmin`
   - **Password**: Click "Show" to reveal
   - **Database name**: `defaultdb`

4. **Construct your DATABASE_URL**:
   ```
   jdbc:mysql://mentorconnect-db-mentor-connect-afq.i.aivencloud.com:16499/defaultdb?sslmode=require
   ```
   Example:
   ```
   jdbc:mysql://mentorconnect-db-xxxxx.aivencloud.com:13306/defaultdb?sslmode=require
   ```

---

## Part 2: Deploy Backend to Render (Free)

### Step 1: Create Render Account

1. Go to [Render](https://render.com/)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account (recommended for easier deployment)

### Step 2: Create New Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Click **"Connect account"** if not already connected
   - Grant Render access to your repositories
   - Select **"MentorConnect-Backend"** repository

### Step 3: Configure Build Settings

Render should auto-detect the `render.yaml` file and your Maven project. Verify these settings:

- **Name**: `mentorconnect-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Environment**: Auto-detected (Render detects Java/Maven via `pom.xml`)
- **Build Command**: `mvn clean package -DskipTests` (pre-filled from render.yaml)
- **Start Command**: `java -jar target/mentorconnect-backend-1.0.0.jar` (pre-filled from render.yaml)
- **Instance Type**: **Free** (select the $0/month option)

> **Note**: You don't need to manually select "Java" - Render automatically detects it from your `pom.xml` file.

#### If Auto-Detection Doesn't Work

If Render doesn't detect your project automatically, **use Docker**:

1. Select **"Docker"** as the Environment
2. Render will use the Dockerfile (I'll create one for you below)
3. Leave Build Command blank (Docker handles it)
4. Leave Start Command blank (defined in Dockerfile)

### Step 4: Add Environment Variables

Click on **"Environment"** tab and add these variables:

#### Database Configuration (from Aiven)
```
DATABASE_URL=jdbc:mysql://your-aiven-host:13306/defaultdb?sslmode=require
DATABASE_USERNAME=avnadmin
DATABASE_PASSWORD=your-aiven-password
```

#### Email Configuration (Gmail)
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
MAIL_SMTP_STARTTLS_REQUIRED=true
MAIL_SMTP_TIMEOUT=5000
```

> **Note**: For `MAIL_PASSWORD`, you need a Gmail App Password:
> 1. Go to [Google Account Security](https://myaccount.google.com/security)
> 2. Enable 2-Step Verification
> 3. Generate an App Password for "Mail"
> 4. Use that 16-character password

#### JWT & Server Configuration
```
SERVER_PORT=8080
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-long-change-this-in-production
JWT_EXPIRATION=86400000
```

> **⚠️ IMPORTANT**: Generate a strong JWT secret (at least 32 characters). You can use:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

#### CORS Configuration
```
CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
```
(Update with your actual frontend URL once deployed)

#### Logging
```
LOG_LEVEL_APP=INFO
LOG_LEVEL_SECURITY=INFO
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. First deployment takes ~5-10 minutes

### Step 6: Monitor Deployment

- Watch the **Logs** tab for build progress
- Once you see "Bound to port 8080", deployment is successful
- Your backend URL will be: `https://mentorconnect-backend.onrender.com`

---

## Part 3: Test Your Deployment

### Health Check

Visit in your browser:
```
https://your-app-name.onrender.com/api/health
```

You should see a successful response (status 200).

### Test API Endpoints

Use Postman or curl to test:

```bash
# Test registration
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "role": "MENTEE"
  }'
```

---

## Important Notes

### Render Free Tier Limitations

⚠️ **Service Sleep**: Render free tier services **spin down after 15 minutes** of inactivity
- **Cold start time**: ~30-60 seconds when service wakes up
- **Solution**: Use a service like [UptimeRobot](https://uptimerobot.com/) (free) to ping your API every 5 minutes

⚠️ **Monthly Hours**: 750 free hours/month (enough for 1 service running 24/7)

⚠️ **Custom Domains**: Not available on free tier (you get `*.onrender.com`)

### Aiven Free Tier Limitations

✅ **Always On**: Database doesn't sleep
- **Storage**: 1 GB
- **RAM**: 1 GB  
- **Backup**: 2-day retention
- **Connections**: Limited (should be sufficient for small apps)

### Security Recommendations

1. **Never commit `.env` to Git** (already in `.gitignore`)
2. **Use strong passwords** for database and JWT secret
3. **Enable HTTPS** (Render provides this automatically)
4. **Rotate JWT secret** periodically
5. **Use Gmail App Passwords**, not your actual Gmail password

---

## Troubleshooting

### Build Fails

**Issue**: Maven build fails
- **Solution**: Check logs for specific error. Ensure `pom.xml` is valid
- **Common fix**: Clear build cache in Render settings

### Database Connection Failed

**Issue**: Can't connect to Aiven MySQL
- **Solution**: 
  - Verify `DATABASE_URL` format includes `?sslmode=require`
  - Check Aiven service is "Running" (not "Rebuilding")
  - Verify credentials match Aiven console

### Service Keeps Crashing

**Issue**: Application starts but crashes
- **Solution**:
  - Check logs for `OutOfMemoryError` (free tier has 512MB RAM)
  - Ensure `SERVER_PORT=8080` (Render expects this)
  - Verify all required env variables are set

### Cold Starts Too Slow

**Issue**: First request after sleep takes too long
- **Solution**: 
  - Use [UptimeRobot](https://uptimerobot.com/) to ping `/api/health` every 5 minutes
  - Keep service warm during business hours

---

## Auto-Deploy Setup

Render automatically deploys when you push to your connected GitHub branch.

To configure:
1. Go to Render dashboard → Your service
2. **Settings** → **Build & Deploy**
3. Ensure **"Auto-Deploy"** is enabled for your branch

Now every git push triggers a new deployment! 🚀

---

## Migration from Railway

If you previously deployed on Railway:

1. **Export Data**: If you have existing data in Railway MySQL, export it
2. **Import to Aiven**: Use MySQL tools to import data:
   ```bash
   mysqldump -h railway-host -u user -p dbname > backup.sql
   mysql -h aiven-host -u avnadmin -p defaultdb < backup.sql
   ```
3. **Update Frontend**: Change API base URL to new Render URL
4. **Delete Railway Service**: Cancel Railway to stop charges

---

## Monitoring & Maintenance

### View Logs
- Render Dashboard → Your Service → **Logs** tab
- Real-time log streaming available

### Database Monitoring
- Aiven Console → Your Service → **Metrics** tab
- Monitor storage usage, connections, query performance

### Scaling (Optional)
If you outgrow the free tier:
- Render: Upgrade to $7/month for always-on service
- Aiven: Upgrade for more storage/performance

---

## Next Steps

1. ✅ Deploy backend to Render
2. Update frontend to use new API URL
3. Test all features end-to-end
4. Set up UptimeRobot to prevent cold starts
5. Monitor logs for any issues

---

## Support

- **Render Docs**: https://render.com/docs
- **Aiven Docs**: https://docs.aiven.io/
- **Issues**: Open a GitHub issue in your repository

**Congratulations! You're now running a completely free production backend!** 🎉
