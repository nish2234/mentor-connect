# Resend Email Setup Guide

## Why Resend Instead of Gmail SMTP?

Render's free tier **blocks outbound SMTP connections** (ports 587 and 465) to prevent spam. This means Gmail SMTP won't work.

**Resend** uses HTTP API instead of SMTP, so it works perfectly on Render! ✅

---

## Step 1: Sign Up for Resend

1. Go to https://resend.com/signup
2. Sign up with your email or GitHub
3. Verify your email address

---

## Step 2: Get Your API Key

1. After login, you'll be in the Resend dashboard
2. Click on **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Fill in:
   - **Name**: MentorConnect Production
   - **Permission**: Full Access (or Sending Access)
5. Click **"Add"**
6. **Copy the API key** - it starts with `re_`
   - Example: `re_123abc456def789ghi`
   - ⚠️ **Save it now** - you won't be able to see it again!

---

## Step 3: Configure Sender Email

### Option A: Use Resend Test Email (Quick Start)

For testing, you can use Resend's default domain:
- **From Email**: `onboarding@resend.dev`
- ✅ No verification needed
- ✅ Works immediately
- ⚠️ Limited to test purposes

### Option B: Add Your Own Domain (Recommended for Production)

1. In Resend dashboard, click **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `mentorconnect.com`)
4. Follow DNS verification steps (add TXT records)
5. Wait for verification (~a few minutes)
6. Use emails like `noreply@mentorconnect.com`

For now, **use Option A** to get started quickly!

---

## Step 4: Update Render Environment Variables

1. Go to **Render Dashboard**
2. Click on your **mentorconnect-backend** service
3. Go to **Environment** tab
4. **Remove old Gmail variables**:
   - Delete `MAIL_HOST`
   - Delete `MAIL_PORT`
   - Delete `MAIL_USERNAME`
   - Delete `MAIL_PASSWORD`
   - Delete `MAIL_SMTP_AUTH`
   - Delete `MAIL_SMTP_STARTTLS_ENABLE`
   - Delete `MAIL_SMTP_STARTTLS_REQUIRED`
   - Delete `MAIL_SMTP_TIMEOUT`
   - Delete `MAIL_SMTP_SSL_ENABLE`

5. **Add new Resend variables**:
   ```
   RESEND_API_KEY=re_your_actual_api_key_from_step_2
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## Step 5: Deploy Updated Code

1. Open your terminal in the project directory
2. Add, commit, and push changes:

```bash
git add .
git commit -m "Switch from Gmail SMTP to Resend API for email delivery"
git push origin main
```

Render will auto-deploy in ~2-3 minutes.

---

## Step 6: Test Email Functionality

### Test 1: Check Logs

After deployment completes:
1. Go to Render → **Logs** tab
2. Look for: `Email sent successfully to: ...`

### Test 2: Try Booking

Try creating a booking through your frontend/API:
- The system should send emails to both mentor and mentee
- Check the logs for success messages

### Test 3: Check Resend Dashboard

1. Go to Resend dashboard → **Emails**
2. You should see sent emails listed
3. Click on any email to see delivery status

---

## Troubleshooting

### Error: "Resend API key not configured"

**Cause**: API key not set in Render environment
**Solution**:
1. Check Render → Environment → `RESEND_API_KEY` is set
2. Make sure there's no extra spaces in the value
3. Restart Render service

### Error: "Failed to send email. Status: 403"

**Cause**: Invalid API key
**Solution**:
1. Generate a new API key in Resend
2. Update `RESEND_API_KEY` in Render
3. Redeploy

### Error: "Failed to send email. Status: 422"

**Cause**: Invalid sender email
**Solution**:
1. Make sure `RESEND_FROM_EMAIL` is set correctly
2. Use `onboarding@resend.dev` for testing
3. Or verify your custom domain first

### Emails Not Being Received

**Possible causes**:
1. Check spam/junk folder
2. Verify email addresses are correct
3. Check Resend dashboard for delivery status
4. Free tier might have deliverability limits to some providers

---

## Resend Free Tier Limits

✅ **3,000 emails/month** - More than enough for most projects  
✅ **No credit card required**  
✅ **100 emails/day** sending limit  
✅ **Unlimited API keys**  
✅ **Real-time analytics**  

---

## Benefits Over Gmail SMTP

- ✅ **Works on Render** (no port blocking)
- ✅ **Higher deliverability** (better inbox placement)
- ✅ **Better analytics** (track opens, clicks, bounces)
- ✅ **No 2FA/App Password hassle**
- ✅ **More reliable** (built for transactional emails)
- ✅ **Faster** (HTTP API vs SMTP handshake)

---

## Next Steps

1. ✅ Sign up for Resend
2. ✅ Get API key
3. ✅ Update Render environment variables
4. ✅ Deploy code changes
5. ✅ Test email functionality
6. 🔜 (Optional) Add custom domain for branded emails

---

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Status Page**: https://status.resend.com

**Your emails should now work perfectly on Render!** 🎉
