-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('doctor', 'patient', 'admin', 'nurse', 'therapist');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('individual', 'group', 'consultation', 'therapy', 'follow_up');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('waiting', 'active', 'paused', 'ended', 'cancelled');

-- CreateEnum
CREATE TYPE "SessionRole" AS ENUM ('host', 'participant', 'observer', 'moderator');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('waiting', 'joined', 'left', 'removed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "licenseNumber" TEXT,
    "specialization" TEXT,
    "yearsOfExperience" INTEGER,
    "education" TEXT,
    "certifications" TEXT,
    "emergencyContact" JSONB,
    "insuranceInfo" JSONB,
    "medicalHistory" TEXT,
    "allergies" TEXT,
    "currentMedications" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "profileImage" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "sessionId" TEXT,
    "meetingUrl" TEXT,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER DEFAULT 0,
    "isGroupSession" BOOLEAN NOT NULL DEFAULT false,
    "allowRecording" BOOLEAN NOT NULL DEFAULT false,
    "allowScreenSharing" BOOLEAN NOT NULL DEFAULT true,
    "allowChat" BOOLEAN NOT NULL DEFAULT true,
    "waitingRoomEnabled" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "diagnosis" TEXT,
    "prescription" TEXT,
    "followUpDate" TIMESTAMP(3),
    "cost" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'USD',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancellationReason" TEXT,
    "providerId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'waiting',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "sessionType" "SessionType" NOT NULL,
    "allowRecording" BOOLEAN NOT NULL DEFAULT false,
    "allowScreenSharing" BOOLEAN NOT NULL DEFAULT true,
    "allowChat" BOOLEAN NOT NULL DEFAULT true,
    "waitingRoomEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "isRecording" BOOLEAN NOT NULL DEFAULT false,
    "recordingUrl" TEXT,
    "recordingStartedAt" TIMESTAMP(3),
    "recordingStoppedAt" TIMESTAMP(3),
    "chatLogs" JSONB,
    "notes" TEXT,
    "serverRegion" TEXT,
    "qualitySettings" JSONB,
    "errors" JSONB,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "averageConnectionQuality" DOUBLE PRECISION,
    "encryptionKey" TEXT,
    "accessToken" TEXT,
    "appointmentId" TEXT,
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionParticipant" (
    "id" TEXT NOT NULL,
    "role" "SessionRole" NOT NULL DEFAULT 'participant',
    "status" "ParticipantStatus" NOT NULL DEFAULT 'waiting',
    "joinTime" TIMESTAMP(3),
    "leaveTime" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "videoEnabled" BOOLEAN NOT NULL DEFAULT true,
    "audioEnabled" BOOLEAN NOT NULL DEFAULT true,
    "screenSharing" BOOLEAN NOT NULL DEFAULT false,
    "connectionQuality" TEXT,
    "bandwidth" DOUBLE PRECISION,
    "latency" INTEGER,
    "canRecord" BOOLEAN NOT NULL DEFAULT false,
    "canShareScreen" BOOLEAN NOT NULL DEFAULT true,
    "canChat" BOOLEAN NOT NULL DEFAULT true,
    "canAdmitOthers" BOOLEAN NOT NULL DEFAULT false,
    "deviceInfo" JSONB,
    "browserInfo" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "messagesSent" INTEGER NOT NULL DEFAULT 0,
    "recordingConsent" BOOLEAN NOT NULL DEFAULT false,
    "recordingConsentAt" TIMESTAMP(3),
    "notes" TEXT,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionId_key" ON "Session"("sessionId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionParticipant" ADD CONSTRAINT "SessionParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionParticipant" ADD CONSTRAINT "SessionParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
