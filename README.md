# ChurchDonate

ChurchDonate is a simple web application that allows an admin to create and manage profiles for churches. Each church profile includes donation bank details and automatically generates a unique public donation page with a QR code for sharing or printing.

## Features

- 🔐 Secure admin authentication with email/password + 2FA (OTP via email)
- ⛪ Church profile management (Create, Read, Update, Delete)
- 📱 Auto-generated QR codes for each church donation page
- 🔗 Unique public donation pages with shareable links
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 JWT-based authentication with rate limiting

## Technology Stack

- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: Email + Password with 2FA OTP
- **Email Service**: Resend (for OTP delivery)
- **Email Forwarding**: ImprovMX (admin@, support@, info@ → churchdonateonline@gmail.com)
- **QR Code Generation**: qrcode npm library
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Resend account (for email OTP)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd church-donate
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `JWT_SECRET`: Random secret for JWT tokens
- `RESEND_API_KEY`: Your Resend API key
- `EMAIL_FROM_NAME`: Name shown in emails (optional, default: "ChurchDonate")
- `EMAIL_FROM_EMAIL`: Email address for sending (optional, default: "onboarding@resend.dev")
- `BASE_URL`: Your app URL (http://localhost:3000 for development)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
- `MAIN_ADMIN`: Main admin email (cannot be deleted)

4. Create the QR codes directory:

```bash
mkdir -p public/qrcodes
echo "" > public/qrcodes/.gitkeep
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Initial Setup

On first run, the system will create an admin user with the credentials specified in your `.env.local` file.

1. Navigate to `/admin/login`
2. Log in with your admin credentials
3. You'll receive an OTP via email
4. Enter the OTP to complete authentication
5. Start managing churches from the admin dashboard

## Project Structure

```
church-donate/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── church/            # Public church pages
│   └── layout.tsx         # Root layout
├── lib/                   # Utility functions
│   ├── db.ts             # Database connection
│   ├── generateQr.ts     # QR code generation
│   └── auth.ts           # Auth helpers
├── models/                # Mongoose models
│   ├── Admin.ts          # Admin user model
│   └── Church.ts         # Church model
├── public/
│   └── qrcodes/          # Generated QR codes
└── docs/                 # Documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login (returns temp token, sends OTP)
- `POST /api/auth/verify-otp` - Verify OTP and get session token
- `POST /api/auth/logout` - Logout admin

### Church Management (Protected)

- `GET /api/church` - List all churches
- `POST /api/church` - Create a new church
- `PUT /api/church/:id` - Update a church
- `DELETE /api/church/:id` - Delete a church

### Public

- `GET /api/public/church/:slug` - Get church details by slug

## Database Schema

### Admin Model

- email (unique)
- password (hashed)
- name
- createdAt, updatedAt

### Church Model

- name
- slug (auto-generated, unique)
- address
- description
- logo (URL or base64)
- bankDetails (object with account info)
- qrCodePath
- createdAt, updatedAt

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm install -g vercel
vercel
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Two-Factor Authentication (Email OTP)
- ✅ Protected admin routes
- ✅ Rate limiting on login attempts
- ✅ HTTPS in production (via Vercel)

## Future Enhancements

- Admin roles & permissions
- Donation tracking and analytics
- Multi-language support
- Payment integration (Stripe/Paystack)
- SMS-based OTP option
- Email notifications for donations
- Church admin portal (separate from main admin)

## License

MIT

## Support

For issues and questions:

- Open an issue on GitHub
- Email: support@churchdonate.org (forwarded to churchdonateonline@gmail.com)
- Contact: admin@churchdonate.org or info@churchdonate.org

**Email Configuration Note**: All domain emails (admin@, support@, info@churchdonate.org) are forwarded to churchdonateonline@gmail.com using ImprovMX email forwarding service.
