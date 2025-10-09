# ChurchDonate Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/churchdonate?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# JWT Secret for custom auth
JWT_SECRET=your-jwt-secret-here

# Resend API Key for Email OTP
RESEND_API_KEY=re_your_resend_api_key

# Base URL for QR codes and public links
BASE_URL=http://localhost:3000

# Cloudinary Configuration (for QR code storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Quick Secret Generation:**

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Initial Admin Setup

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. Navigate to `/admin/setup` or click "Initial Setup"
3. Create your admin account
4. Login with 2FA (check console for OTP if Resend is not configured)
5. Start creating churches!

### 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check for code issues
```

### 🌍 Key URLs

- **Home**: http://localhost:3000
- **Admin Setup**: http://localhost:3000/admin/setup
- **Admin Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Church Page**: http://localhost:3000/church/[slug]

---

## 📋 Detailed Setup Instructions

### 1. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user:
   - Click "Database Access"
   - Add new database user
   - Set username and strong password
4. Whitelist your IP address:
   - Click "Network Access"
   - Add IP Address
   - Use `0.0.0.0/0` for development (allows all IPs)
   - In production, use specific IPs
5. Get your connection string:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
6. Add to `.env.local` as `MONGODB_URI`

### 2. Cloudinary Setup (for QR Code Storage)

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account (generous free tier: 25GB storage, 25GB bandwidth/month)
3. From your dashboard, copy:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

**Why Cloudinary?**

- ✅ QR codes are stored in the cloud (not on disk)
- ✅ Works perfectly with Vercel's read-only filesystem
- ✅ Free CDN delivery for fast loading
- ✅ Automatic backups and versioning
- ✅ No file system cleanup needed

### 3. Resend Setup (for Email OTP)

1. Go to [Resend](https://resend.com)
2. Sign up for a free account (3,000 emails/month free)
3. Create an API key:
   - Go to API Keys
   - Create new API key
   - Copy the key
4. Add the API key to `RESEND_API_KEY` in `.env.local`

**For Production:**

- Verify your domain in Resend
- Update the `from` address in `lib/email.ts` to use your domain (e.g., `noreply@yourdomain.com`)

**Note:** In development, if Resend is not configured, OTP codes will be logged to the server console.

### 4. Environment Variables Explained

| Variable                | Description                                          | Example                                           |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| `MONGODB_URI`           | MongoDB Atlas connection string                      | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `NEXTAUTH_URL`          | Your application URL                                 | `http://localhost:3000` (dev)                     |
| `NEXTAUTH_SECRET`       | Secret for NextAuth (not actively used but required) | Random 32+ char string                            |
| `JWT_SECRET`            | Secret for JWT token signing                         | Random 32+ char string                            |
| `RESEND_API_KEY`        | Resend API key for emails                            | `re_xxx...`                                       |
| `BASE_URL`              | Base URL for QR codes and links                      | `http://localhost:3000` (dev)                     |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                                | From dashboard                                    |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                   | From dashboard                                    |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                | From dashboard                                    |

### 5. Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. First-Time Admin Setup

1. Navigate to `http://localhost:3000/admin/setup`
2. Fill in the admin registration form:
   - Name
   - Email
   - Password (minimum 8 characters)
3. Click "Create Admin Account"
4. You'll be redirected to the login page

### 7. Login with 2FA

1. Go to `http://localhost:3000/admin/login`
2. Enter your email and password
3. Check your email for the 6-digit OTP
   - If Resend is not configured, check the server console:
     ```
     📧 OTP for admin@example.com: 123456
     ```
4. Enter the OTP to complete login
5. You'll be redirected to the admin dashboard

---

## 🚢 Production Deployment (Vercel)

### 1. Prepare Your Code

```bash
# Test the build
npm run build

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"
```

### 2. Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/church-donate.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

**Option A: Vercel Dashboard**

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `next build` (default)
5. Add environment variables (see below)
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 4. Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable                | Value                          | Notes                   |
| ----------------------- | ------------------------------ | ----------------------- |
| `MONGODB_URI`           | Your MongoDB connection string | Same as local           |
| `JWT_SECRET`            | Strong random secret           | **Different from dev!** |
| `RESEND_API_KEY`        | Your Resend API key            | Same as local           |
| `BASE_URL`              | `https://yourapp.vercel.app`   | Your production URL     |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name     | Same as local           |
| `CLOUDINARY_API_KEY`    | Your Cloudinary API key        | Same as local           |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret     | Same as local           |

**Important:**

- Use different, stronger secrets for production
- Update `BASE_URL` to your actual production URL
- After adding/changing env vars, redeploy the app

### 5. Post-Deployment

1. Navigate to `https://yourapp.vercel.app/admin/setup`
2. Create your production admin account (use a strong password!)
3. Login and start managing churches
4. Test all features:
   - [ ] Admin login and 2FA
   - [ ] Create church
   - [ ] View public church page
   - [ ] QR code displays correctly
   - [ ] Copy, share, and print features work

### 6. Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `churchdonate.com`)
3. Follow DNS configuration instructions
4. Update environment variables:
   - `BASE_URL` → `https://churchdonate.com`
5. Redeploy

---

## 🔒 Security Recommendations

1. ✅ **Strong Secrets**: Use 32+ character random strings for `JWT_SECRET`
2. ✅ **Different Secrets**: Never use the same secrets in dev and production
3. ✅ **MongoDB Security**:
   - Use strong database passwords
   - Whitelist specific IPs in production (not 0.0.0.0/0)
   - Enable MongoDB Atlas backups
4. ✅ **Admin Passwords**: Require strong passwords (8+ characters, mixed case, numbers)
5. ✅ **Email Domain**: Verify your domain in Resend for production
6. ✅ **Regular Updates**: Keep dependencies updated
7. ✅ **API Keys**: Rotate API keys every 90 days
8. ✅ **Monitor**: Check MongoDB and Resend dashboards regularly

---

## 🆘 Troubleshooting

### OTP Not Received

**Symptoms:** OTP email not arriving after login

**Solutions:**

- Check your spam/junk folder
- If Resend is not configured, check the server console for the OTP:
  ```
  📧 OTP for admin@example.com: 123456
  ```
- Verify your Resend API key is correct in `.env.local`
- Check Resend dashboard → Logs for delivery status
- Make sure your email address is valid
- For production, ensure your domain is verified in Resend

### MongoDB Connection Issues

**Symptoms:** "Failed to connect to MongoDB" error

**Solutions:**

- Verify your `MONGODB_URI` is correct
- Check if your IP is whitelisted in MongoDB Atlas:
  - Network Access → Add your current IP
  - For development, use `0.0.0.0/0`
- Ensure your database user exists and has correct permissions
- Check if the password in the connection string is URL-encoded
  - Special characters need encoding (e.g., `@` → `%40`)
- Test connection string in MongoDB Compass

### QR Codes Not Showing

**Symptoms:** QR code doesn't appear on church pages

**Solutions:**

- Verify all Cloudinary credentials are correct:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Check Cloudinary dashboard → Media Library → `churchdonate/qrcodes` folder
- Verify `BASE_URL` is set correctly (should match your actual URL)
- Check browser console for CORS or loading errors
- Try creating a new church to regenerate the QR code

### Build Errors

**Symptoms:** `npm run build` fails

**Solutions:**

- Clear `.next` folder and rebuild:
  ```bash
  rm -rf .next
  npm run build
  ```
- Check for TypeScript errors: `npm run lint`
- Verify all dependencies are installed: `npm install`
- Check Node.js version (requires 18+)

### Login Issues

**Symptoms:** Can't login even with correct credentials

**Solutions:**

- Check MongoDB connection (admin data stored there)
- Verify password is correct (case-sensitive)
- Check server console for errors
- Ensure admin account exists (go to `/admin/setup` if not)
- Clear browser cookies and try again
- Check if rate limiting is blocking you (wait 15 minutes)

---

## 💡 Development Tips

### Testing Emails Locally

Without Resend configured, OTP codes are logged to the terminal:

```bash
npm run dev

# When you login, you'll see:
📧 OTP for admin@example.com: 123456
```

Copy the OTP from the console and paste it into the verification form.

### Viewing MongoDB Data

**Option 1: MongoDB Compass**

- Download [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect using your `MONGODB_URI`
- Browse collections visually

**Option 2: MongoDB Atlas Web UI**

- Go to MongoDB Atlas dashboard
- Click "Browse Collections"
- View and edit data directly

### API Testing

Use curl or Postman to test API endpoints:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"tempToken":"YOUR_TEMP_TOKEN","otp":"123456"}'

# Get all churches (requires token)
curl http://localhost:3000/api/church \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create church
curl -X POST http://localhost:3000/api/church \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Church",
    "address": "123 Main St",
    "description": "A test church",
    "bankDetails": {
      "accountName": "Test Church",
      "accountNumber": "1234567890",
      "bankName": "Test Bank"
    }
  }'
```

### Hot Reload Issues

If hot reload isn't working:

```bash
# Stop the dev server (Ctrl+C)
# Clear .next cache
rm -rf .next

# Restart
npm run dev
```

---

## 📚 Additional Resources

- **API Documentation**: See `docs/API.md` for complete API reference
- **Deployment Guide**: See `docs/DEPLOYMENT.md` for detailed deployment checklist
- **Project Spec**: See `docs/ChurchDonate_Spec.txt` for original requirements
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Resend Docs**: https://resend.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

---

## ✅ Setup Checklist

Use this checklist to ensure everything is configured:

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string added to `.env.local`
- [ ] Cloudinary account created
- [ ] Cloudinary credentials added to `.env.local`
- [ ] Resend account created (optional for dev)
- [ ] Resend API key added to `.env.local`
- [ ] JWT secrets generated
- [ ] All environment variables in `.env.local`
- [ ] Development server starts successfully
- [ ] Admin account created
- [ ] Login with 2FA works
- [ ] Can create churches
- [ ] QR codes generate successfully
- [ ] Public church pages load

---

**Need help?** Check the main README.md or open an issue on GitHub.
