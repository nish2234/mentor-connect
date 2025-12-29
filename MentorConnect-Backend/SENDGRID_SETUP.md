# SendGrid Email Setup Guide

## Why SendGrid?

- ✅ **100 emails/day free** - Forever
- ✅ **Send to anyone** after simple email verification
- ✅ **No domain required** initially
- ✅ **Works on Render** (HTTP API, no SMTP blocking)
- ✅ **Better deliverability** than Gmail

---

## Step 1: Sign Up for SendGrid

1. Go to https://app.sendgrid.com/signup
2. Sign up with your email
3. Verify your email address
4. Complete the account setup form:
   - **First Name**: Your name
   - **Last Name**: Your name
   - **Company**: MentorConnect (or anything)
   - **Website**: Can skip or use placeholder

---

## Step 2: Verify Your Sender Email

**This is the email you'll send FROM** (e.g., your Gmail)

1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name**: MentorConnect
   - **From Email Address**: `nishant2003singh@gmail.com` (your email)
   - **Reply To**: Same as above
   - **Company**: MentorConnect
   - **Address**: Your address (can be anything)
4. Click **"Create"**
5. **Check your email** (nishant2003singh@gmail.com)
6. Click the verification link
7. ✅ **Done!** Your email is verified

---

##Step 3: Create API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Fill in:
   - **API Key Name**: MentorConnect Production
   - **API Key Permissions**: **Full Access** (or Restricted Access → select "Mail Send")
4. Click **"Create & View"**
5. **Copy the API key** - it starts with `SG.`
   - Example: `SG.abc123def456ghi789...`
   - ⚠️ **Save it now** - you won't see it again!

---

## Step 4: Update Render Environment Variables

1. Go to **Render Dashboard**
2. Click on your **mentorconnect-backend** service
3. Go to **Environment** tab

4. **Remove old Resend variables** (if they exist):
   - Delete `RESEND_API_KEY`
   - Delete `RESEND_FROM_EMAIL`

5. **Add new SendGrid variables**:
   ```
   SENDGRID_API_KEY=SG.your_actual_api_key_from_step_3
   SENDGRID_FROM_EMAIL=nishant2003singh@gmail.com
   SENDGRID_FROM_NAME=MentorConnect
   ```

6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## Step 5: Deploy Code Changes

Push your updated code:

```bash
git add .
git commit -m "Switch to SendGrid for email delivery"
git push origin main
```

Render deploys automatically in ~2-3 minutes.

---

## Step 6: Test Email

After deployment:

1. Try creating a booking through your app
2. Emails should be sent to both mentor and mentee
3. Check Render logs for: `Email sent successfully to: ...`
4. Check SendGrid dashboard → **Activity** to see sent emails

---

## Troubleshooting

### Error: "The from address does not match a verified Sender Identity"

**Cause**: Email not verified in SendGrid  
**Solution**:
1. Go to SendGrid → Settings → Sender Authentication
2. Make sure your email is verified (green checkmark)
3. Use the exact same email in `SENDGRID_FROM_EMAIL`

### Error: "Forbidden"

**Cause**: Invalid API key  
**Solution**:
1. Generate a new API key in SendGrid
2. Update `SENDGRID_API_KEY` in Render
3. Redeploy

### Emails Going to Spam

**Solution**:
- This is normal initially
- Check spam folder
- Deliverability improves over time
- Eventually add SPF/DKIM records (advanced)

---

## SendGrid Free Tier Limits

✅ **100 emails/day** forever  
✅ **No credit card required**  
✅ **Unlimited contacts**  
✅ **Email activity for 30 days**  
✅ **Single sender verification** (no domain needed)

---

## Next Steps

1. ✅ Sign up for SendGrid
2. ✅ Verify your sender email
3. ✅ Get API key
4. ✅ Update Render environment variables
5. ✅ Deploy code
6. ✅ Test email delivery

**Your emails should now work perfectly!** 🎉
