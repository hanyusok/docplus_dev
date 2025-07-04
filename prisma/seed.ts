import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.sessionParticipant.deleteMany();
  await prisma.session.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.waitingRoomParticipant.deleteMany();
  await prisma.waitingRoom.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create Administrators
  const administrators = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@docplus.com',
        password: 'admin123', // In production, this should be hashed
        firstName: 'Sarah',
        lastName: 'Johnson',
        userType: 'admin',
        phoneNumber: '+1-555-0101',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Female',
        address: '123 Admin Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'superadmin@docplus.com',
        password: 'super123',
        firstName: 'Michael',
        lastName: 'Chen',
        userType: 'admin',
        phoneNumber: '+1-555-0102',
        dateOfBirth: new Date('1980-07-22'),
        gender: 'Male',
        address: '456 Management Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'USA',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
  ]);

  console.log('👥 Created 2 administrators');

  // Create Doctors
  const doctors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'dr.smith@docplus.com',
        password: 'doctor123',
        firstName: 'Dr. Emily',
        lastName: 'Smith',
        userType: 'doctor',
        phoneNumber: '+1-555-0201',
        dateOfBirth: new Date('1982-05-10'),
        gender: 'Female',
        address: '789 Medical Center Dr',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'USA',
        licenseNumber: 'MD123456',
        specialization: 'Cardiology',
        yearsOfExperience: 12,
        education: 'Harvard Medical School',
        certifications: 'Board Certified Cardiologist',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.johnson@docplus.com',
        password: 'doctor123',
        firstName: 'Dr. Robert',
        lastName: 'Johnson',
        userType: 'doctor',
        phoneNumber: '+1-555-0202',
        dateOfBirth: new Date('1978-11-30'),
        gender: 'Male',
        address: '321 Health Plaza',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        licenseNumber: 'MD789012',
        specialization: 'Pediatrics',
        yearsOfExperience: 15,
        education: 'Northwestern University',
        certifications: 'Board Certified Pediatrician',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.garcia@docplus.com',
        password: 'doctor123',
        firstName: 'Dr. Maria',
        lastName: 'Garcia',
        userType: 'doctor',
        phoneNumber: '+1-555-0203',
        dateOfBirth: new Date('1985-09-18'),
        gender: 'Female',
        address: '654 Wellness Way',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA',
        licenseNumber: 'MD345678',
        specialization: 'Dermatology',
        yearsOfExperience: 8,
        education: 'University of Miami',
        certifications: 'Board Certified Dermatologist',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.williams@docplus.com',
        password: 'doctor123',
        firstName: 'Dr. David',
        lastName: 'Williams',
        userType: 'doctor',
        phoneNumber: '+1-555-0204',
        dateOfBirth: new Date('1980-12-05'),
        gender: 'Male',
        address: '987 Care Circle',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA',
        licenseNumber: 'MD567890',
        specialization: 'Neurology',
        yearsOfExperience: 10,
        education: 'University of Washington',
        certifications: 'Board Certified Neurologist',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.brown@docplus.com',
        password: 'doctor123',
        firstName: 'Dr. Lisa',
        lastName: 'Brown',
        userType: 'doctor',
        phoneNumber: '+1-555-0205',
        dateOfBirth: new Date('1983-04-25'),
        gender: 'Female',
        address: '147 Therapy Trail',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'USA',
        licenseNumber: 'MD901234',
        specialization: 'Psychiatry',
        yearsOfExperience: 9,
        education: 'University of Texas',
        certifications: 'Board Certified Psychiatrist',
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    }),
  ]);

  console.log('👨‍⚕️ Created 5 doctors');

  // Create Patients with realistic data
  const patientData = [
    { firstName: 'John', lastName: 'Davis', email: 'john.davis@email.com', phoneNumber: '+1-555-0301', dateOfBirth: new Date('1990-01-15'), gender: 'Male', address: '123 Oak Street', city: 'New York', state: 'NY', zipCode: '10001', medicalHistory: 'Hypertension, Diabetes Type 2', allergies: 'Penicillin', currentMedications: 'Metformin, Lisinopril' },
    { firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@email.com', phoneNumber: '+1-555-0302', dateOfBirth: new Date('1985-03-22'), gender: 'Female', address: '456 Pine Avenue', city: 'Los Angeles', state: 'CA', zipCode: '90001', medicalHistory: 'Asthma, Seasonal allergies', allergies: 'Dairy, Shellfish', currentMedications: 'Albuterol inhaler' },
    { firstName: 'Michael', lastName: 'Taylor', email: 'michael.taylor@email.com', phoneNumber: '+1-555-0303', dateOfBirth: new Date('1988-07-10'), gender: 'Male', address: '789 Elm Road', city: 'Chicago', state: 'IL', zipCode: '60601', medicalHistory: 'None', allergies: 'None', currentMedications: 'None' },
    { firstName: 'Emily', lastName: 'Anderson', email: 'emily.anderson@email.com', phoneNumber: '+1-555-0304', dateOfBirth: new Date('1992-11-05'), gender: 'Female', address: '321 Maple Drive', city: 'Houston', state: 'TX', zipCode: '77001', medicalHistory: 'Depression, Anxiety', allergies: 'Sulfa drugs', currentMedications: 'Sertraline, Bupropion' },
    { firstName: 'James', lastName: 'Martinez', email: 'james.martinez@email.com', phoneNumber: '+1-555-0305', dateOfBirth: new Date('1987-09-18'), gender: 'Male', address: '654 Cedar Lane', city: 'Phoenix', state: 'AZ', zipCode: '85001', medicalHistory: 'High cholesterol', allergies: 'None', currentMedications: 'Atorvastatin' },
    { firstName: 'Jennifer', lastName: 'Garcia', email: 'jennifer.garcia@email.com', phoneNumber: '+1-555-0306', dateOfBirth: new Date('1995-02-28'), gender: 'Female', address: '987 Birch Street', city: 'Philadelphia', state: 'PA', zipCode: '19101', medicalHistory: 'Migraines', allergies: 'Nuts', currentMedications: 'Sumatriptan' },
    { firstName: 'Robert', lastName: 'Rodriguez', email: 'robert.rodriguez@email.com', phoneNumber: '+1-555-0307', dateOfBirth: new Date('1983-12-14'), gender: 'Male', address: '147 Willow Way', city: 'San Antonio', state: 'TX', zipCode: '78201', medicalHistory: 'Type 1 Diabetes', allergies: 'Latex', currentMedications: 'Insulin, Glucophage' },
    { firstName: 'Amanda', lastName: 'Lee', email: 'amanda.lee@email.com', phoneNumber: '+1-555-0308', dateOfBirth: new Date('1991-06-20'), gender: 'Female', address: '258 Spruce Circle', city: 'San Diego', state: 'CA', zipCode: '92101', medicalHistory: 'Hypothyroidism', allergies: 'None', currentMedications: 'Levothyroxine' },
    { firstName: 'Christopher', lastName: 'White', email: 'christopher.white@email.com', phoneNumber: '+1-555-0309', dateOfBirth: new Date('1989-04-12'), gender: 'Male', address: '369 Aspen Avenue', city: 'Dallas', state: 'TX', zipCode: '75201', medicalHistory: 'None', allergies: 'Bee stings', currentMedications: 'EpiPen' },
    { firstName: 'Jessica', lastName: 'Harris', email: 'jessica.harris@email.com', phoneNumber: '+1-555-0310', dateOfBirth: new Date('1993-08-03'), gender: 'Female', address: '741 Poplar Road', city: 'San Jose', state: 'CA', zipCode: '95101', medicalHistory: 'PCOS', allergies: 'None', currentMedications: 'Metformin' },
    { firstName: 'Daniel', lastName: 'Clark', email: 'daniel.clark@email.com', phoneNumber: '+1-555-0311', dateOfBirth: new Date('1986-01-25'), gender: 'Male', address: '852 Oak Lane', city: 'Austin', state: 'TX', zipCode: '73301', medicalHistory: 'Hypertension', allergies: 'None', currentMedications: 'Amlodipine' },
    { firstName: 'Nicole', lastName: 'Lewis', email: 'nicole.lewis@email.com', phoneNumber: '+1-555-0312', dateOfBirth: new Date('1994-05-08'), gender: 'Female', address: '963 Pine Street', city: 'Jacksonville', state: 'FL', zipCode: '32099', medicalHistory: 'Anxiety', allergies: 'None', currentMedications: 'Buspirone' },
    { firstName: 'Matthew', lastName: 'Robinson', email: 'matthew.robinson@email.com', phoneNumber: '+1-555-0313', dateOfBirth: new Date('1984-10-17'), gender: 'Male', address: '159 Elm Drive', city: 'Fort Worth', state: 'TX', zipCode: '76101', medicalHistory: 'Sleep apnea', allergies: 'None', currentMedications: 'CPAP machine' },
    { firstName: 'Stephanie', lastName: 'Walker', email: 'stephanie.walker@email.com', phoneNumber: '+1-555-0314', dateOfBirth: new Date('1990-12-30'), gender: 'Female', address: '357 Maple Circle', city: 'Columbus', state: 'OH', zipCode: '43201', medicalHistory: 'Endometriosis', allergies: 'None', currentMedications: 'Birth control pills' },
    { firstName: 'Andrew', lastName: 'Young', email: 'andrew.young@email.com', phoneNumber: '+1-555-0315', dateOfBirth: new Date('1988-03-11'), gender: 'Male', address: '468 Cedar Avenue', city: 'Charlotte', state: 'NC', zipCode: '28201', medicalHistory: 'None', allergies: 'None', currentMedications: 'None' },
    { firstName: 'Lauren', lastName: 'Allen', email: 'lauren.allen@email.com', phoneNumber: '+1-555-0316', dateOfBirth: new Date('1992-07-24'), gender: 'Female', address: '579 Birch Lane', city: 'San Francisco', state: 'CA', zipCode: '94102', medicalHistory: 'Depression', allergies: 'None', currentMedications: 'Fluoxetine' },
    { firstName: 'Kevin', lastName: 'King', email: 'kevin.king@email.com', phoneNumber: '+1-555-0317', dateOfBirth: new Date('1985-11-06'), gender: 'Male', address: '680 Willow Way', city: 'Indianapolis', state: 'IN', zipCode: '46201', medicalHistory: 'High blood pressure', allergies: 'None', currentMedications: 'Losartan' },
    { firstName: 'Rachel', lastName: 'Wright', email: 'rachel.wright@email.com', phoneNumber: '+1-555-0318', dateOfBirth: new Date('1991-09-15'), gender: 'Female', address: '791 Spruce Road', city: 'Seattle', state: 'WA', zipCode: '98101', medicalHistory: 'Asthma', allergies: 'Dust mites', currentMedications: 'Fluticasone inhaler' },
    { firstName: 'Ryan', lastName: 'Lopez', email: 'ryan.lopez@email.com', phoneNumber: '+1-555-0319', dateOfBirth: new Date('1987-02-28'), gender: 'Male', address: '802 Poplar Street', city: 'Denver', state: 'CO', zipCode: '80201', medicalHistory: 'None', allergies: 'None', currentMedications: 'None' },
    { firstName: 'Megan', lastName: 'Hill', email: 'megan.hill@email.com', phoneNumber: '+1-555-0320', dateOfBirth: new Date('1993-04-19'), gender: 'Female', address: '913 Oak Circle', city: 'Washington', state: 'DC', zipCode: '20001', medicalHistory: 'Migraines', allergies: 'Chocolate', currentMedications: 'Rizatriptan' },
    { firstName: 'Brandon', lastName: 'Scott', email: 'brandon.scott@email.com', phoneNumber: '+1-555-0321', dateOfBirth: new Date('1989-06-02'), gender: 'Male', address: '024 Aspen Lane', city: 'Boston', state: 'MA', zipCode: '02108', medicalHistory: 'Diabetes Type 2', allergies: 'None', currentMedications: 'Metformin, Glipizide' },
    { firstName: 'Ashley', lastName: 'Green', email: 'ashley.green@email.com', phoneNumber: '+1-555-0322', dateOfBirth: new Date('1995-01-13'), gender: 'Female', address: '135 Cedar Drive', city: 'El Paso', state: 'TX', zipCode: '79901', medicalHistory: 'None', allergies: 'None', currentMedications: 'None' },
    { firstName: 'Tyler', lastName: 'Adams', email: 'tyler.adams@email.com', phoneNumber: '+1-555-0323', dateOfBirth: new Date('1986-08-07'), gender: 'Male', address: '246 Maple Avenue', city: 'Nashville', state: 'TN', zipCode: '37201', medicalHistory: 'Hypertension', allergies: 'None', currentMedications: 'Valsartan' },
    { firstName: 'Brittany', lastName: 'Baker', email: 'brittany.baker@email.com', phoneNumber: '+1-555-0324', dateOfBirth: new Date('1990-10-25'), gender: 'Female', address: '357 Pine Circle', city: 'Detroit', state: 'MI', zipCode: '48201', medicalHistory: 'Anxiety, Depression', allergies: 'None', currentMedications: 'Sertraline, Alprazolam' },
    { firstName: 'Justin', lastName: 'Gonzalez', email: 'justin.gonzalez@email.com', phoneNumber: '+1-555-0325', dateOfBirth: new Date('1988-12-09'), gender: 'Male', address: '468 Elm Street', city: 'Portland', state: 'OR', zipCode: '97201', medicalHistory: 'None', allergies: 'None', currentMedications: 'None' },
    { firstName: 'Victoria', lastName: 'Nelson', email: 'victoria.nelson@email.com', phoneNumber: '+1-555-0326', dateOfBirth: new Date('1992-03-16'), gender: 'Female', address: '579 Birch Road', city: 'Memphis', state: 'TN', zipCode: '38101', medicalHistory: 'PCOS', allergies: 'None', currentMedications: 'Spironolactone' },
    { firstName: 'Jonathan', lastName: 'Carter', email: 'jonathan.carter@email.com', phoneNumber: '+1-555-0327', dateOfBirth: new Date('1984-05-21'), gender: 'Male', address: '680 Willow Lane', city: 'Louisville', state: 'KY', zipCode: '40201', medicalHistory: 'High cholesterol', allergies: 'None', currentMedications: 'Simvastatin' },
    { firstName: 'Samantha', lastName: 'Mitchell', email: 'samantha.mitchell@email.com', phoneNumber: '+1-555-0328', dateOfBirth: new Date('1991-07-04'), gender: 'Female', address: '791 Spruce Avenue', city: 'Baltimore', state: 'MD', zipCode: '21201', medicalHistory: 'Asthma', allergies: 'Pollen', currentMedications: 'Montelukast' },
    { firstName: 'Nathan', lastName: 'Perez', email: 'nathan.perez@email.com', phoneNumber: '+1-555-0329', dateOfBirth: new Date('1987-11-12'), gender: 'Male', address: '802 Poplar Circle', city: 'Milwaukee', state: 'WI', zipCode: '53201', medicalHistory: 'None', allergies: 'None', currentMedications: 'None' },
    { firstName: 'Hannah', lastName: 'Roberts', email: 'hannah.roberts@email.com', phoneNumber: '+1-555-0330', dateOfBirth: new Date('1994-09-28'), gender: 'Female', address: '913 Oak Drive', city: 'Albuquerque', state: 'NM', zipCode: '87101', medicalHistory: 'Depression', allergies: 'None', currentMedications: 'Escitalopram' },
  ];

  const patients = await Promise.all(
    patientData.map((patient, index) =>
      prisma.user.create({
        data: {
          ...patient,
          password: 'patient123',
          userType: 'patient',
          country: 'USA',
          isActive: true,
          isVerified: true,
          lastLoginAt: new Date(),
        },
      })
    )
  );

  console.log('👥 Created 30 patients');

  // Create some sample appointments
  const appointments = await Promise.all([
    // Dr. Smith appointments
    prisma.appointment.create({
      data: {
        title: 'Cardiology Consultation',
        description: 'Follow-up appointment for heart condition',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        duration: 60,
        sessionType: 'consultation',
        status: 'scheduled',
        providerId: doctors[0].id,
        patientId: patients[0].id,
        allowRecording: false,
        allowScreenSharing: true,
        allowChat: true,
        waitingRoomEnabled: true,
      },
    }),
    prisma.appointment.create({
      data: {
        title: 'Heart Health Check',
        description: 'Routine cardiac evaluation',
        startTime: new Date('2024-01-16T14:00:00Z'),
        endTime: new Date('2024-01-16T15:00:00Z'),
        duration: 60,
        sessionType: 'follow_up',
        status: 'scheduled',
        providerId: doctors[0].id,
        patientId: patients[1].id,
        allowRecording: true,
        allowScreenSharing: true,
        allowChat: true,
        waitingRoomEnabled: true,
      },
    }),
    // Dr. Johnson appointments
    prisma.appointment.create({
      data: {
        title: 'Pediatric Checkup',
        description: 'Annual wellness visit for child',
        startTime: new Date('2024-01-17T09:00:00Z'),
        endTime: new Date('2024-01-17T09:30:00Z'),
        duration: 30,
        sessionType: 'individual',
        status: 'scheduled',
        providerId: doctors[1].id,
        patientId: patients[2].id,
        allowRecording: false,
        allowScreenSharing: false,
        allowChat: true,
        waitingRoomEnabled: true,
      },
    }),
    // Dr. Garcia appointments
    prisma.appointment.create({
      data: {
        title: 'Dermatology Consultation',
        description: 'Skin condition evaluation',
        startTime: new Date('2024-01-18T11:00:00Z'),
        endTime: new Date('2024-01-18T11:45:00Z'),
        duration: 45,
        sessionType: 'consultation',
        status: 'scheduled',
        providerId: doctors[2].id,
        patientId: patients[3].id,
        allowRecording: true,
        allowScreenSharing: true,
        allowChat: true,
        waitingRoomEnabled: true,
      },
    }),
  ]);

  console.log('📅 Created 4 sample appointments');

  // Create sample medical records
  const medicalRecords = await Promise.all([
    prisma.medicalRecord.create({
      data: {
        patientId: patients[0].id,
        providerId: doctors[0].id,
        appointmentId: appointments[0].id,
        recordType: 'consultation',
        title: 'Cardiology Consultation',
        description: 'Patient presents with chest pain and shortness of breath',
        symptoms: 'Chest pain, shortness of breath, fatigue',
        diagnosis: 'Stable angina',
        treatment: 'Prescribed nitroglycerin and lifestyle modifications',
        notes: 'Patient advised to quit smoking and exercise regularly',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[1].id,
        providerId: doctors[0].id,
        appointmentId: appointments[1].id,
        recordType: 'follow_up',
        title: 'Heart Health Follow-up',
        description: 'Routine cardiac evaluation',
        symptoms: 'None reported',
        diagnosis: 'Normal cardiac function',
        treatment: 'Continue current medications',
        notes: 'Patient doing well, no changes needed',
      },
    }),
  ]);

  console.log('📋 Created 2 sample medical records');

  // Create sample prescriptions
  const prescriptions = await Promise.all([
    prisma.prescription.create({
      data: {
        patientId: patients[0].id,
        providerId: doctors[0].id,
        appointmentId: appointments[0].id,
        medicationName: 'Nitroglycerin',
        dosage: '0.4mg',
        frequency: 'As needed for chest pain',
        duration: '30 days',
        instructions: 'Place under tongue when chest pain occurs',
        quantity: 30,
        refills: 2,
        isActive: true,
        prescribedAt: new Date(),
        expiresAt: new Date('2024-12-31'),
      },
    }),
    prisma.prescription.create({
      data: {
        patientId: patients[3].id,
        providerId: doctors[2].id,
        appointmentId: appointments[3].id,
        medicationName: 'Hydrocortisone Cream',
        dosage: '1%',
        frequency: 'Apply twice daily',
        duration: '14 days',
        instructions: 'Apply to affected areas',
        quantity: 30,
        refills: 1,
        isActive: true,
        prescribedAt: new Date(),
        expiresAt: new Date('2024-12-31'),
      },
    }),
  ]);

  console.log('💊 Created 2 sample prescriptions');

  // Create sample notifications
  const notifications = await Promise.all([
    // Appointment reminders
    prisma.notification.create({
      data: {
        userId: patients[0].id,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: 'Your cardiology consultation is scheduled for tomorrow at 10:00 AM',
        isRead: false,
        isUrgent: false,
        actionUrl: '/appointments',
        actionText: 'View Appointment',
      },
    }),
    prisma.notification.create({
      data: {
        userId: patients[1].id,
        type: 'appointment_confirmation',
        title: 'Appointment Confirmed',
        message: 'Your heart health check has been confirmed for January 16th',
        isRead: true,
        isUrgent: false,
        actionUrl: '/appointments',
        actionText: 'View Details',
      },
    }),
    // Doctor notifications
    prisma.notification.create({
      data: {
        userId: doctors[0].id,
        type: 'appointment_reminder',
        title: 'Upcoming Appointment',
        message: 'You have a cardiology consultation with John Davis tomorrow',
        isRead: false,
        isUrgent: false,
        actionUrl: '/appointments',
        actionText: 'View Schedule',
      },
    }),
    prisma.notification.create({
      data: {
        userId: doctors[1].id,
        type: 'general',
        title: 'New Patient Registration',
        message: 'A new patient has registered and requested an appointment',
        isRead: false,
        isUrgent: false,
        actionUrl: '/patients',
        actionText: 'View Patient',
      },
    }),
  ]);

  console.log('🔔 Created 4 sample notifications');

  // Create sample schedules for doctors
  const schedules = await Promise.all([
    prisma.schedule.create({
      data: {
        providerId: doctors[0].id,
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        appointmentDuration: 60,
        breakDuration: 15,
        maxAppointments: 8,
        isRecurring: true,
      },
    }),
    prisma.schedule.create({
      data: {
        providerId: doctors[0].id,
        dayOfWeek: 2, // Tuesday
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        appointmentDuration: 60,
        breakDuration: 15,
        maxAppointments: 8,
        isRecurring: true,
      },
    }),
    prisma.schedule.create({
      data: {
        providerId: doctors[1].id,
        dayOfWeek: 1, // Monday
        startTime: '08:00',
        endTime: '16:00',
        isAvailable: true,
        appointmentDuration: 30,
        breakDuration: 10,
        maxAppointments: 16,
        isRecurring: true,
      },
    }),
  ]);

  console.log('📅 Created 3 sample schedules');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${administrators.length} Administrators`);
  console.log(`- ${doctors.length} Doctors`);
  console.log(`- ${patients.length} Patients`);
  console.log(`- ${appointments.length} Appointments`);
  console.log(`- ${medicalRecords.length} Medical Records`);
  console.log(`- ${prescriptions.length} Prescriptions`);
  console.log(`- ${notifications.length} Notifications`);
  console.log(`- ${schedules.length} Schedules`);

  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@docplus.com / admin123');
  console.log('Doctor: dr.smith@docplus.com / doctor123');
  console.log('Patient: john.davis@email.com / patient123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 