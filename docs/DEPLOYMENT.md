# ChurchDonate Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for all IPs or specific IPs)
- [ ] Connection string tested and working
- [ ] Resend account created (for email OTP)
- [ ] Resend API key generated
- [ ] Domain verified in Resend (for production emails)
- [ ] All environment variables documented

### ✅ Code Preparation

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Linting passed (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] Git repository initialized
- [ ] Code committed to repository
- [ ] Repository pushed to GitHub

### ✅ Security Checks

- [ ] Strong, unique `JWT_SECRET` generated
- [ ] Strong, unique `NEXTAUTH_SECRET` generated
- [ ] Admin password meets security requirements (8+ characters)
- [ ] `.env.local` added to `.gitignore`
- [ ] No sensitive data in code
- [ ] Rate limiting tested

## Vercel Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/yourusername/church-donate.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add environment variables (see below)
6. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

### 3. Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable          | Value                          | Environment |
| ----------------- | ------------------------------ | ----------- |
| `MONGODB_URI`     | Your MongoDB connection string | Production  |
| `NEXTAUTH_URL`    | https://your-app.vercel.app    | Production  |
| `NEXTAUTH_SECRET` | Strong random secret           | Production  |
| `JWT_SECRET`      | Strong random secret           | Production  |
| `RESEND_API_KEY`  | Your Resend API key            | Production  |
| `BASE_URL`        | https://your-app.vercel.app    | Production  |

**Important:** Use different secrets for production than development!

### 4. Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` and `BASE_URL` to your custom domain

## Post-Deployment Steps

### 1. Initial Admin Setup

1. Navigate to `https://your-app.vercel.app/admin/setup`
2. Create production admin account
3. Use a strong password
4. Save credentials securely (password manager recommended)

### 2. Test All Features

- [ ] Admin login with email/password
- [ ] OTP received via email
- [ ] 2FA authentication works
- [ ] Can create churches
- [ ] QR codes generate correctly
- [ ] Public church pages load
- [ ] Copy/Share buttons work
- [ ] Print functionality works
- [ ] Mobile responsiveness
- [ ] Edit church functionality
- [ ] Delete church functionality

### 3. Configure Email

Update `lib/email.ts` with your verified domain:

```typescript
from: 'ChurchDonate <noreply@yourdomain.com>',
```

Commit and redeploy:

```bash
git add lib/email.ts
git commit -m "Update email sender"
git push
```

### 4. Monitor

- [ ] Check Vercel deployment logs
- [ ] Monitor MongoDB Atlas usage
- [ ] Check Resend email delivery
- [ ] Test from different devices
- [ ] Check analytics (if configured)

## Production Monitoring

### MongoDB Atlas

1. Monitor cluster usage in Atlas dashboard
2. Set up alerts for high usage
3. Review slow queries
4. Enable backups

### Resend

1. Monitor email delivery rates
2. Check for bounces/complaints
3. Review sending limits
4. Monitor API usage

### Vercel

1. Monitor function execution time
2. Check bandwidth usage
3. Review error logs
4. Set up status notifications

## Scaling Considerations

### Database Optimization

- [ ] Add indexes to frequently queried fields (already done for `slug`)
- [ ] Monitor query performance
- [ ] Consider upgrading MongoDB cluster if needed
- [ ] Implement database backups

### Performance

- [ ] Enable Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Optimize images (use Next.js Image component)
- [ ] Implement caching strategies

### Security

- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Implement additional rate limiting if needed
- [ ] Regular password rotation
- [ ] Review access logs

## Backup Strategy

### Database Backups

1. Enable automated backups in MongoDB Atlas
2. Test restore procedure
3. Document backup schedule
4. Store credentials securely

### Code Backups

1. GitHub repository is primary backup
2. Consider local backup of repository
3. Document deployment process
4. Tag releases in Git

## Rollback Procedure

If deployment fails:

1. **Vercel**: Rollback to previous deployment in dashboard
2. **MongoDB**: Restore from backup if needed
3. **Code**: Revert Git commits and redeploy

```bash
git revert HEAD
git push
# Vercel auto-deploys
```

## Support Checklist

- [ ] Admin contact information documented
- [ ] Support email configured
- [ ] Error reporting mechanism in place
- [ ] User documentation available
- [ ] API documentation published

## Security Best Practices

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Rotate secrets every 90 days
- [ ] Review MongoDB access logs
- [ ] Monitor failed login attempts
- [ ] Keep Next.js and dependencies updated

### Security Headers

Vercel automatically adds many security headers. Verify these are in place:

- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] Content Security Policy (if needed)

## Troubleshooting Common Issues

### Build Failures

```bash
# Test build locally
npm run build

# Check logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

### MongoDB Connection Issues

- Verify connection string format
- Check IP whitelist
- Verify user permissions
- Check network connectivity

### Email Delivery Issues

- Verify Resend API key
- Check domain verification
- Review email logs in Resend dashboard
- Check spam folders

### QR Code Generation

- Ensure write permissions on Vercel
- Verify `BASE_URL` is correct
- Check function execution logs
- Ensure `public/qrcodes` directory exists

## Success Metrics

Track these metrics to measure success:

- [ ] Deployment success rate
- [ ] Average response time
- [ ] Error rate
- [ ] Email delivery rate
- [ ] User satisfaction
- [ ] Uptime percentage (aim for 99.9%)

## Documentation

Ensure these are up to date:

- [ ] README.md
- [ ] API.md
- [ ] SETUP.md
- [ ] This deployment guide
- [ ] Change log

## Final Checklist

- [ ] All environment variables set
- [ ] Admin account created
- [ ] All features tested
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Documentation complete
- [ ] Team trained
- [ ] Support channels ready

---

## Next Steps After Deployment

1. **Create your first church** - Test the full workflow
2. **Share the platform** - Get feedback from users
3. **Monitor usage** - Track performance and errors
4. **Plan updates** - Feature roadmap
5. **Regular maintenance** - Keep system updated

---

**Deployment Date:** ********\_********

**Deployed By:** ********\_********

**Production URL:** ********\_********

**Notes:**

---

---

---
