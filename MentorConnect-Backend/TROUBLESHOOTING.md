# Render Deployment Troubleshooting

## Current Issues

### Issue 1: Frontend Calling Wrong URL
Your frontend is making API calls to itself (`mentor-connect-frontend-teal.vercel.app`) instead of the backend on Render.

**Screenshot shows**:
- Request URL: `https://mentor-connect-frontend-teal.vercel.app/api/auth/register`
- Status: 405 Method Not Allowed
- This means the frontend doesn't know the backend URL

### Issue 2: Health Endpoint Error
Need to verify backend is actually running and accessible.

---

## Step 1: Find Your Render Backend URL

1. Go to your Render dashboard
2. Click on your `mentorconnect-backend` service
3. Look at the top for a URL like:
   ```
   https://mentorconnect-backend.onrender.com
   ```
4. **Copy this URL** - this is your actual backend

---

## Step 2: Test Backend Health Endpoint

Open your browser and go to:
```
https://YOUR-RENDER-URL.onrender.com/api/health
```

Replace `YOUR-RENDER-URL` with your actual Render URL.

### Expected Response:
```json
{
  "status": "UP",
  "service": "MentorConnect Backend",
  "timestamp": 1735300000000
}
```

### If You Get an Error:

#### Error: "Application failed to respond"
**Cause**: Backend crashed or didn't start
**Solution**:
1. Go to Render → Your Service → **Logs** tab
2. Look for errors in the logs
3. Common issues:
   - Missing environment variables
   - Database connection failed
   - Port binding issue

#### Error: 404 Not Found on /api/health
**Cause**: HealthController not deployed
**Solution**:
1. Verify `HealthController.java` exists in your repo
2. Push to GitHub if not:
   ```bash
   git add src/main/java/com/mentorconnect/controller/HealthController.java
   git commit -m "Add health endpoint"
   git push origin main
   ```
3. Render auto-deploys

#### Error: CORS Error
**Cause**: CORS not configured for your frontend
**Solution**: See Step 3

---

## Step 3: Fix Frontend API Configuration

Your frontend needs to know the backend URL.

### For React/Next.js Frontend:

1. **Find your API configuration file**
   - Common locations:
     - `.env` or `.env.local`
     - `src/config/api.js`
     - `src/utils/api.js`

2. **Update API Base URL**:

   In your frontend `.env`:
   ```env
   NEXT_PUBLIC_API_URL=https://YOUR-RENDER-URL.onrender.com
   REACT_APP_API_URL=https://YOUR-RENDER-URL.onrender.com
   ```

3. **Update API calls** to use this variable:
   ```javascript
   // Instead of:
   fetch('/api/auth/register', ...)

   // Use:
   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, ...)
   ```

4. **Redeploy frontend** to Vercel:
   ```bash
   git add .env
   git commit -m "Update backend URL"
   git push origin main
   ```

---

## Step 4: Fix CORS on Backend

Your backend needs to allow requests from your frontend URL.

### Update CORS_ORIGINS Environment Variable on Render:

1. Go to Render Dashboard → Your Service → **Environment**
2. Find `CORS_ORIGINS` variable
3. Update it to:
   ```
   https://mentor-connect-frontend-teal.vercel.app,http://localhost:3000
   ```
   (No spaces between URLs)

4. **Save** - Render will auto-redeploy

---

## Step 5: Verify Everything Works

### Test 1: Health Endpoint
```bash
curl https://YOUR-RENDER-URL.onrender.com/api/health
```

Should return:
```json
{"status":"UP","service":"MentorConnect Backend","timestamp":...}
```

### Test 2: CORS
```bash
curl -H "Origin: https://mentor-connect-frontend-teal.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://YOUR-RENDER-URL.onrender.com/api/auth/register
```

Should return CORS headers (not 405 error).

### Test 3: Registration from Frontend
Try registering a user through your frontend UI.

---

## Common Render Deployment Errors

### Error: "Build failed"
**Check Logs**:
- Maven build errors
- Missing dependencies
- Java version mismatch

**Solution**:
- Ensure `pom.xml` is valid
- Check Dockerfile syntax

### Error: "Application failed to start"
**Check Logs for**:
- `DATABASE_URL` connection error
- Missing environment variables
- Port binding error

**Solution**:
1. Verify all env vars are set
2. Check database connectivity from Aiven
3. Ensure `SERVER_PORT=8080`

### Error: "Service keeps restarting"
**Causes**:
- Out of memory (free tier has 512MB)
- Database connection pooling issues
- Infinite crash loop

**Solution**:
- Check logs for `OutOfMemoryError`
- Reduce database connection pool size
- Fix code errors causing crashes

---

## Quick Checklist

- [ ] Backend deployed successfully on Render
- [ ] Health endpoint works: `https://YOUR-URL.onrender.com/api/health`
- [ ] Frontend knows backend URL (env variable set)
- [ ] CORS configured with frontend URL
- [ ] All environment variables set on Render
- [ ] Database connection working (check logs)

---

## Need More Help?

**Share these with me**:
1. Your Render backend URL
2. Logs from Render (Render Dashboard → Logs tab)
3. Any error messages you see
4. Screenshot of your Render environment variables (hide sensitive values)

I'll help you debug further!
