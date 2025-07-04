# Environment Setup Instructions

## 1. Create Environment File

Create a `.env.local` file in your project root with:

```env
# Database
DATABASE_URL="postgresql://docplus_user:docplus_password@localhost:5432/docplus_db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3001"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

## 2. Install Dependencies

Run these commands in your terminal:

```bash
# Install bcryptjs and types
npm install bcryptjs @types/bcryptjs

# Generate Prisma client
npm run generate
```

## 3. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and replace `your-super-secret-key-change-this-in-production` in your `.env.local` file.

## 4. Start Development Server

```bash
npm run dev
```

## 5. Test the Application

Visit http://localhost:3001 to test the authentication system.

## Troubleshooting

If you encounter import errors:

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check TypeScript configuration**:
   - Ensure `tsconfig.json` has the path mapping for `@/*`
   - Restart your development server

3. **Verify database connection**:
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in `.env.local`
   - Run `npm run migrate` if needed 