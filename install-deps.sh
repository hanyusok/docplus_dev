#!/bin/bash

echo "Installing authentication dependencies..."

# Install bcryptjs and types
npm install bcryptjs @types/bcryptjs

# Generate Prisma client
npm run generate

echo "Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Create .env.local file with your environment variables"
echo "2. Generate a NextAuth secret: openssl rand -base64 32"
echo "3. Start the development server: npm run dev" 