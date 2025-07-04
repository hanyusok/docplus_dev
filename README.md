# DocPlus - Telemedicine Platform

A comprehensive telemedicine web application built with Next.js, featuring real-time video consultations, patient management, appointment scheduling, and waiting room functionality.

## 🚀 Features

### Core Telemedicine Features
- **Real-time Video Conferencing** - WebRTC-powered video calls with screen sharing and chat
- **Waiting Room Management** - Queue system with real-time updates and notifications
- **Appointment Scheduling** - Calendar-based scheduling with time slot management
- **Patient Management** - Complete patient profiles with medical records and prescriptions
- **Role-based Access Control** - Admin, Doctor, and Patient roles with appropriate permissions

### Authentication & Security
- **NextAuth.js Integration** - Secure authentication with JWT sessions
- **Role-based Authorization** - Middleware protection for all routes
- **Password Security** - bcryptjs hashing (configurable)

### Real-time Features
- **Socket.IO Integration** - Real-time notifications and waiting room updates
- **Live Chat** - In-session messaging and waiting room communication
- **Notification System** - Real-time alerts for appointments and updates

### Database & Data Management
- **PostgreSQL Database** - Robust relational database with Prisma ORM
- **Medical Records** - Patient history, prescriptions, and appointment tracking
- **Audit Trail** - Complete logging of all system activities

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Database management and migrations
- **PostgreSQL** - Primary database
- **Socket.IO Server** - Real-time WebSocket server

### Authentication & Security
- **NextAuth.js** - Authentication framework
- **JWT Tokens** - Session management
- **bcryptjs** - Password hashing

### Real-time Communication
- **Socket.IO** - WebSocket server for real-time features
- **WebRTC** - Peer-to-peer video communication

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js 18+** installed
- **PostgreSQL 12+** installed and running
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd docplus_dev
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/docplus_db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Socket.IO Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

#### Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE docplus_db;

-- Create user (optional)
CREATE USER docplus_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE docplus_db TO docplus_user;
```

#### Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
docplus_dev/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── patients/            # Patient management
│   │   ├── appointments/        # Appointment management
│   │   ├── notifications/       # Notification system
│   │   ├── schedule/            # Scheduling endpoints
│   │   └── socketio/            # Socket.IO server
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Role-based dashboards
│   ├── patients/                # Patient management pages
│   ├── scheduling/              # Appointment scheduling
│   ├── sessions/                # Video session pages
│   └── waiting-room/            # Waiting room management
├── components/                   # React Components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── notifications/           # Notification components
│   ├── patients/                # Patient management
│   ├── scheduling/              # Scheduling components
│   ├── sessions/                # Video session components
│   └── waiting-room/            # Waiting room components
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Authentication utilities
│   ├── prisma.ts                # Database client
│   └── socket.ts                # Socket.IO configuration
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
└── public/                      # Static assets
```

## 🔐 Authentication & Authorization

### User Roles

1. **Admin** - Full system access
   - User management
   - System configuration
   - Patient management
   - Appointment scheduling

2. **Doctor** - Medical professional access
   - Patient management
   - Appointment scheduling
   - Medical records
   - Video consultations

3. **Patient** - Limited access
   - View appointments
   - Join video sessions
   - Access medical records

### Authentication Flow

1. **Registration** - Users sign up with email and role selection
2. **Login** - Email/password authentication
3. **Session Management** - JWT-based sessions
4. **Route Protection** - Middleware-based authorization

## 📊 Database Schema

### Core Entities

#### Users
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- firstName (String)
- lastName (String)
- userType (Enum: admin, doctor, patient)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Patients
```sql
- id (UUID, Primary Key)
- firstName (String)
- lastName (String)
- email (String)
- phoneNumber (String)
- dateOfBirth (Date)
- gender (String)
- address (String)
- medicalHistory (Text)
- allergies (Text)
- currentMedications (Text)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Appointments
```sql
- id (UUID, Primary Key)
- title (String)
- description (Text)
- startTime (DateTime)
- endTime (DateTime)
- status (Enum: scheduled, in_progress, completed, cancelled)
- sessionType (Enum: individual, group, consultation, therapy, follow_up)
- providerId (UUID, Foreign Key)
- patientId (UUID, Foreign Key)
- notes (Text)
- allowRecording (Boolean)
- allowScreenSharing (Boolean)
- allowChat (Boolean)
- waitingRoomEnabled (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Medical Records
```sql
- id (UUID, Primary Key)
- patientId (UUID, Foreign Key)
- title (String)
- recordType (Enum: consultation, diagnosis, treatment, lab_result, imaging)
- description (Text)
- symptoms (Text)
- diagnosis (Text)
- treatment (Text)
- prescribedBy (UUID, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Prescriptions
```sql
- id (UUID, Primary Key)
- patientId (UUID, Foreign Key)
- medicationName (String)
- dosage (String)
- frequency (String)
- duration (String)
- instructions (Text)
- isActive (Boolean)
- prescribedAt (DateTime)
- expiresAt (DateTime)
- prescribedBy (UUID, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with role selection
- `POST /api/auth/signin` - User login with email/password
- `GET /api/auth/session` - Get current session information
- `POST /api/auth/signout` - User logout and session cleanup

### Patients
- `GET /api/patients` - List all patients with search and filtering
- `POST /api/patients` - Create new patient with validation
- `GET /api/patients/[id]` - Get detailed patient information
- `PUT /api/patients/[id]` - Update patient profile
- `DELETE /api/patients/[id]` - Soft delete patient record

### Appointments
- `GET /api/appointments` - List appointments with filtering by patient/provider
- `POST /api/appointments` - Create appointment with time slot validation
- `GET /api/appointments/[id]` - Get appointment details
- `PUT /api/appointments/[id]` - Update appointment status and details
- `DELETE /api/appointments/[id]` - Cancel appointment

### Medical Records
- `GET /api/patients/[id]/records` - Get patient medical records
- `POST /api/patients/[id]/records` - Create new medical record
- `GET /api/patients/[id]/records/[recordId]` - Get specific medical record
- `PUT /api/patients/[id]/records/[recordId]` - Update medical record
- `DELETE /api/patients/[id]/records/[recordId]` - Archive medical record

### Prescriptions
- `GET /api/patients/[id]/prescriptions` - Get patient prescriptions
- `POST /api/patients/[id]/prescriptions` - Create new prescription
- `GET /api/patients/[id]/prescriptions/[prescriptionId]` - Get specific prescription
- `PUT /api/patients/[id]/prescriptions/[prescriptionId]` - Update prescription
- `DELETE /api/patients/[id]/prescriptions/[prescriptionId]` - Deactivate prescription

### Notifications
- `GET /api/notifications` - Get user notifications with read status
- `POST /api/notifications/[id]/read` - Mark notification as read
- `GET /api/notifications/unread` - Get unread notification count

### Scheduling
- `GET /api/schedule/slots` - Get available time slots for provider
- `POST /api/schedule/slots` - Create new time slot
- `GET /api/schedule/slots/[id]` - Get specific time slot
- `PUT /api/schedule/slots/[id]` - Update time slot availability
- `DELETE /api/schedule/slots/[id]` - Remove time slot

### Socket.IO Events
- `join-waiting-room` - Join waiting room with user info
- `leave-waiting-room` - Leave waiting room gracefully
- `send-waiting-room-message` - Send message in waiting room
- `admit-participant` - Admit participant to video session
- `remove-participant` - Remove participant from waiting room
- `waiting-room-updated` - Real-time waiting room updates
- `notification-received` - Real-time notification delivery

## 🎥 Video Conferencing

### WebRTC Features
- **Peer-to-peer video calls** - Direct connection between participants
- **Screen sharing** - Share desktop or application windows
- **Chat functionality** - Real-time messaging during calls
- **Recording capability** - Optional session recording
- **Waiting room** - Queue system before joining calls

### Session Flow
1. **Appointment Creation** - Doctor schedules appointment
2. **Waiting Room** - Patient joins waiting room
3. **Admission** - Doctor admits patient to session
4. **Video Call** - WebRTC connection established
5. **Session End** - Call ends, records saved

## 🎨 Frontend Components

### Core Components

#### Authentication Components
- **AuthProvider** - NextAuth session provider wrapper
- **SignInForm** - Login form with validation
- **SignUpForm** - Registration form with role selection
- **AuthMiddleware** - Route protection middleware

#### Dashboard Components
- **MainDashboard** - General dashboard with stats and quick actions
- **AdminDashboard** - Admin-specific dashboard with system management
- **DoctorDashboard** - Doctor-specific dashboard with patient management
- **PatientDashboard** - Patient-specific dashboard with appointments

#### Patient Management
- **PatientList** - Searchable patient list with filtering
- **PatientProfile** - Detailed patient view with medical records
- **PatientForm** - Patient creation and editing form

#### Appointment Scheduling
- **AppointmentScheduler** - Calendar-based scheduling interface
- **TimeSlotSelector** - Available time slot selection
- **AppointmentForm** - Appointment creation and editing

#### Real-time Components
- **NotificationBell** - Real-time notification display
- **WaitingRoom** - Queue management interface
- **VideoConference** - WebRTC video call component
- **ChatComponent** - Real-time messaging interface

#### Telemedicine Features
- **MedicalRecordForm** - Medical record creation and editing
- **PrescriptionForm** - Prescription management
- **SessionList** - Active and past session management

### Component Integration

All components are fully integrated with the API endpoints:

```typescript
// Example: PatientList component integration
const loadPatients = async () => {
  const response = await fetch('/api/patients');
  if (response.ok) {
    const data = await response.json();
    setPatients(data);
  }
};

// Example: NotificationBell integration
const fetchNotifications = async () => {
  const res = await fetch("/api/notifications");
  if (res.ok) {
    const data = await res.json();
    setNotifications(data);
  }
};
```

### State Management
- **React Hooks** - Local component state
- **NextAuth Session** - Global authentication state
- **Socket.IO** - Real-time state synchronization
- **Prisma Client** - Database state management

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/docplus_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Socket.IO
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: bcryptjs for password hashing
BCRYPT_SALT_ROUNDS=12
```

### Database Configuration

The application uses Prisma with PostgreSQL. Key configuration:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Setup for Production

1. **Database** - Use managed PostgreSQL service
2. **Environment Variables** - Set production values
3. **SSL Certificate** - Configure HTTPS
4. **Domain Configuration** - Set up custom domain

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### API Testing

```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/patients
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","userType":"patient"}'
```

### Integration Testing

#### Frontend-API Integration
All frontend components are fully integrated with the API endpoints:

```bash
# Test patient management
curl -X GET http://localhost:3000/api/patients
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'

# Test appointment scheduling
curl -X GET "http://localhost:3000/api/schedule/slots?providerId=1&date=2024-01-15"
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"title":"Checkup","startTime":"2024-01-15T10:00:00Z","patientId":"1"}'

# Test notifications
curl -X GET http://localhost:3000/api/notifications
curl -X POST http://localhost:3000/api/notifications/1/read
```

#### Real-time Testing
Test Socket.IO connections and real-time features:

```bash
# Test Socket.IO server
curl http://localhost:3000/api/socketio

# Test waiting room functionality
# Use browser developer tools to test WebSocket connections
```

### Component Testing

#### Patient Management Flow
1. **Login as Doctor/Admin** - Access patient management
2. **Navigate to /patients** - View patient list
3. **Search/Filter Patients** - Test search functionality
4. **View Patient Profile** - Access detailed patient information
5. **Manage Medical Records** - Add/edit medical records
6. **Manage Prescriptions** - Add/edit prescriptions

#### Appointment Scheduling Flow
1. **Login as Doctor/Admin** - Access scheduling
2. **Navigate to /scheduling** - Open appointment scheduler
3. **Select Date** - Choose appointment date
4. **Select Time Slot** - Pick available time
5. **Fill Appointment Details** - Complete appointment form
6. **Create Appointment** - Submit appointment

#### Waiting Room Flow
1. **Login as Doctor** - Access waiting room
2. **Navigate to /waiting-room** - Open waiting room
3. **Patient Joins** - Test patient joining queue
4. **Admit Patient** - Test admission to session
5. **Start Video Call** - Test WebRTC connection

### Manual Testing Checklist

#### Authentication
- [ ] User registration with role selection
- [ ] User login with email/password
- [ ] Role-based route protection
- [ ] Session management
- [ ] Logout functionality

#### Patient Management
- [ ] Patient list with search/filter
- [ ] Patient profile creation
- [ ] Medical record management
- [ ] Prescription management
- [ ] Patient data validation

#### Appointment Scheduling
- [ ] Calendar interface
- [ ] Time slot selection
- [ ] Appointment creation
- [ ] Appointment status updates
- [ ] Conflict detection

#### Real-time Features
- [ ] Notification delivery
- [ ] Waiting room queue
- [ ] Real-time chat
- [ ] Video call functionality
- [ ] Screen sharing

#### Role-based Access
- [ ] Admin dashboard access
- [ ] Doctor dashboard access
- [ ] Patient dashboard access
- [ ] Route protection
- [ ] Feature permissions

## 🔒 Security Considerations

### Authentication Security
- **Password Hashing** - bcryptjs with configurable salt rounds
- **JWT Tokens** - Secure session management
- **CSRF Protection** - Built-in NextAuth protection
- **Rate Limiting** - API endpoint protection

### Data Security
- **Input Validation** - All user inputs validated
- **SQL Injection Protection** - Prisma ORM protection
- **XSS Protection** - React built-in protection
- **HTTPS Enforcement** - Production SSL requirement

### Privacy Compliance
- **HIPAA Considerations** - Medical data protection
- **Data Encryption** - Database and transmission encryption
- **Audit Logging** - Complete activity tracking
- **Data Retention** - Configurable retention policies

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check database connection
npx prisma db push

# Reset database
npx prisma migrate reset
```

#### Socket.IO Issues
```bash
# Check Socket.IO server
curl http://localhost:3000/api/socketio

# Verify environment variables
echo $NEXT_PUBLIC_APP_URL
```

#### Authentication Issues
```bash
# Clear NextAuth cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate
```

### Logs and Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check application logs
tail -f logs/app.log
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create feature branch** - `git checkout -b feature/new-feature`
3. **Make changes** - Follow coding standards
4. **Test thoroughly** - Run all tests
5. **Submit pull request** - Include detailed description

### Coding Standards

- **TypeScript** - Strict type checking
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)

### Contact
- **Issues** - GitHub Issues
- **Discussions** - GitHub Discussions
- **Email** - support@docplus.com

## 🗺️ Roadmap

### Upcoming Features
- [ ] **Mobile App** - React Native application
- [ ] **AI Integration** - Symptom analysis and triage
- [ ] **Payment Processing** - Stripe integration
- [ ] **Advanced Analytics** - Patient and practice analytics
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Security** - Two-factor authentication
- [ ] **Integration APIs** - EHR system integration
- [ ] **Telemedicine Compliance** - HIPAA and regional compliance

### Version History
- **v1.0.0** - Initial release with core telemedicine features
- **v1.1.0** - Enhanced security and performance improvements
- **v1.2.0** - Advanced patient management features
- **v1.3.0** - Real-time notifications and waiting room
- **v1.4.0** - Complete API integration and role-based access
- **v1.5.0** - Full frontend-backend integration with comprehensive testing

---

**Built with ❤️ for the telemedicine community** 