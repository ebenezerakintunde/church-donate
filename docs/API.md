# ChurchDonate API Documentation

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

## Authentication

Most endpoints require authentication using a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Authentication

#### POST /api/auth/setup

Create initial admin account (only works if no admin exists).

**Request Body:**

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

#### GET /api/auth/setup

Check if initial setup is needed.

**Response:**

```json
{
  "setupNeeded": true,
  "adminCount": 0
}
```

#### POST /api/auth/login

Login with email and password. Returns a temporary token and sends OTP to email.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "message": "OTP sent to your email",
  "tempToken": "eyJhbGciOiJIUzI1...",
  "email": "admin@example.com"
}
```

**Rate Limiting:** 5 attempts per 15 minutes per email/IP combination

#### POST /api/auth/verify-otp

Verify OTP and get session token.

**Request Body:**

```json
{
  "tempToken": "eyJhbGciOiJIUzI1...",
  "otp": "123456"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

**Rate Limiting:** 10 attempts per 15 minutes per IP

---

### Church Management (Protected)

All church management endpoints require authentication.

#### GET /api/church

Get all churches.

**Headers:**

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

**Response:**

```json
{
  "churches": [
    {
      "_id": "...",
      "name": "Grace Community Church",
      "slug": "grace-community-church-abc123",
      "address": "123 Main St, City, State",
      "description": "A welcoming community...",
      "logo": "https://example.com/logo.png",
      "bankDetails": {
        "accountName": "Grace Community Church",
        "accountNumber": "1234567890",
        "bankName": "First National Bank",
        "swiftCode": "FNBAUS33",
        "routingNumber": "123456789",
        "additionalInfo": "Please include your name in the transfer"
      },
      "qrCodePath": "/qrcodes/grace-community-church-abc123.png",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### POST /api/church

Create a new church.

**Headers:**

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

**Request Body:**

```json
{
  "name": "Grace Community Church",
  "address": "123 Main St, City, State",
  "description": "A welcoming community church serving our neighborhood",
  "logo": "https://example.com/logo.png",
  "bankDetails": {
    "accountName": "Grace Community Church",
    "accountNumber": "1234567890",
    "bankName": "First National Bank",
    "swiftCode": "FNBAUS33",
    "routingNumber": "123456789",
    "additionalInfo": "Please include your name in the transfer"
  }
}
```

**Required Fields:**

- `name`
- `address`
- `description`
- `bankDetails.accountName`
- `bankDetails.accountNumber`
- `bankDetails.bankName`

**Optional Fields:**

- `logo`
- `bankDetails.swiftCode`
- `bankDetails.routingNumber`
- `bankDetails.additionalInfo`

**Response:**

```json
{
  "message": "Church created successfully",
  "church": {
    "_id": "...",
    "name": "Grace Community Church",
    "slug": "grace-community-church-abc123",
    "address": "123 Main St, City, State",
    "description": "A welcoming community church...",
    "logo": "https://example.com/logo.png",
    "bankDetails": { ... },
    "qrCodePath": "/qrcodes/grace-community-church-abc123.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** The slug and QR code are automatically generated.

#### GET /api/church/[id]

Get a single church by ID.

**Headers:**

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

**Response:**

```json
{
  "church": {
    "_id": "...",
    "name": "Grace Community Church",
    ...
  }
}
```

#### PUT /api/church/[id]

Update a church.

**Headers:**

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

**Request Body:**
Same as POST, but all fields are optional. Only include fields you want to update.

**Response:**

```json
{
  "message": "Church updated successfully",
  "church": { ... }
}
```

**Note:** If the name is changed, a new slug and QR code will be generated.

#### DELETE /api/church/[id]

Delete a church.

**Headers:**

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

**Response:**

```json
{
  "message": "Church deleted successfully"
}
```

**Note:** This also deletes the associated QR code file.

---

### Public Endpoints

#### GET /api/public/church/[slug]

Get church details by slug (no authentication required).

**Response:**

```json
{
  "church": {
    "_id": "...",
    "name": "Grace Community Church",
    "slug": "grace-community-church-abc123",
    "address": "123 Main St, City, State",
    "description": "A welcoming community church...",
    "logo": "https://example.com/logo.png",
    "bankDetails": { ... },
    "qrCodePath": "/qrcodes/grace-community-church-abc123.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, missing fields)
- `401` - Unauthorized (invalid or missing token)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Example Error Responses

**401 Unauthorized:**

```json
{
  "error": "Invalid or expired token"
}
```

**400 Bad Request:**

```json
{
  "error": "Missing required fields"
}
```

**429 Rate Limited:**

```json
{
  "error": "Too many login attempts. Please try again in 15 minutes."
}
```

---

## Rate Limiting

The following endpoints have rate limiting:

- **POST /api/auth/login**: 5 attempts per 15 minutes (per email/IP)
- **POST /api/auth/verify-otp**: 10 attempts per 15 minutes (per IP)

Rate limiting is based on IP address and/or email address.

---

## Testing with cURL

### Setup Admin

```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securepass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepass123"
  }'
```

### Verify OTP

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "YOUR_TEMP_TOKEN",
    "otp": "123456"
  }'
```

### Create Church

```bash
curl -X POST http://localhost:3000/api/church \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "name": "Grace Church",
    "address": "123 Main St",
    "description": "A welcoming community",
    "bankDetails": {
      "accountName": "Grace Church",
      "accountNumber": "1234567890",
      "bankName": "First Bank"
    }
  }'
```

### Get All Churches

```bash
curl http://localhost:3000/api/church \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Get Public Church Data

```bash
curl http://localhost:3000/api/public/church/grace-church-abc123
```
