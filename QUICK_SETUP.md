# Quick Setup Guide

## Current Issue
The authentication system is failing because `bcryptjs` is not installed. I've temporarily disabled secure password hashing to get the system running.

## Immediate Fix

### 1. Install Dependencies
Run this command in your terminal:
```bash
npm install bcryptjs @types/bcryptjs
```

### 2. Create Environment File
Create a `.env.local` file in your project root:
```env
# Database
DATABASE_URL="postgresql://docplus_user:docplus_password@localhost:5432/docplus_db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3001"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

### 3. Generate NextAuth Secret
```bash
openssl rand -base64 32
```
Copy the output and replace `your-super-secret-key-change-this-in-production` in your `.env.local` file.

### 4. Generate Prisma Client
```bash
npm run generate
```

### 5. Start Development Server
```bash
npm run dev
```

## Test the System

1. Visit http://localhost:3001
2. Click "Sign Up" to create a test account
3. Try signing in with your credentials
4. Access role-based dashboards

## Security Note

⚠️ **IMPORTANT**: The current setup uses plain text passwords for testing. This is NOT secure for production.

To enable secure password hashing:

1. After installing `bcryptjs`, the system will automatically use secure password hashing
2. The temporary password validation will be replaced with proper bcrypt hashing
3. All new passwords will be properly hashed

## Available Routes

- **Home**: http://localhost:3001
- **Sign In**: http://localhost:3001/auth/signin  
- **Sign Up**: http://localhost:3001/auth/signup
- **Admin Dashboard**: http://localhost:3001/admin/dashboard

## Troubleshooting

If you still get module errors:
1. Clear Next.js cache: `rm -rf .next`
2. Restart the development server: `npm run dev`
3. Check that all dependencies are installed: `npm list bcryptjs` 