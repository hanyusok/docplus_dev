# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://docplus_user:docplus_password@localhost:5432/docplus_db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3001"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

## Installation Steps

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install bcryptjs @types/bcryptjs
   ```

2. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```
   Use this output as your `NEXTAUTH_SECRET`

3. **Database Setup**:
   - Ensure PostgreSQL is running
   - Run Prisma migrations: `npm run migrate`
   - Generate Prisma client: `npm run generate`

## Features Implemented

### Authentication
- ✅ NextAuth.js with JWT strategy
- ✅ Credentials provider (email/password)
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (ADMIN, DOCTOR, PATIENT)
- ✅ Session management
- ✅ Protected routes with middleware

### User Management
- ✅ User registration with role selection
- ✅ User login with validation
- ✅ Role-based dashboard routing
- ✅ Session persistence

### Security
- ✅ Password hashing (bcryptjs with salt rounds)
- ✅ JWT token management
- ✅ Route protection middleware
- ✅ Role-based access control

### UI Components
- ✅ Modern sign-in/sign-up forms
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Role-based dashboard components

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Home: http://localhost:3001
   - Sign In: http://localhost:3001/auth/signin
   - Sign Up: http://localhost:3001/auth/signup

3. **Role-based dashboards**:
   - Admin: http://localhost:3001/admin/dashboard
   - Doctor: http://localhost:3001/doctor/dashboard
   - Patient: http://localhost:3001/patient/dashboard

## Database Schema

The authentication system uses the existing User model with:
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `firstName`, `lastName`: User names
- `userType`: Role (ADMIN, DOCTOR, PATIENT)
- `isActive`: Account status
- `profileImage`: Optional profile picture

## Next Steps

1. **Add more providers** (Google, GitHub, etc.)
2. **Implement email verification**
3. **Add password reset functionality**
4. **Create role-specific dashboard components**
5. **Add user profile management**
6. **Implement audit logging** 