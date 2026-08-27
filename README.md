# IT Department Leave Portal

Leave Application System for IT Department - SRM Easwari Engineering College

## Features

- Student Login (roll number as password)
- Apply for Leave / On-Duty
- Faculty Panel to Approve/Reject
- Leave History & Balance Tracking

## Login Credentials

### Students
- Email: `rollnumber@eec.srmrmp.edu.in` (e.g., `310624205001@eec.srmrmp.edu.in`)
- Password: Your roll number (e.g., `310624205001`)

### Faculty/Mentor
- Email: `sundar.k@eec.srmrmp.edu.in`
- Password: `faculty123`

## How to Run

### 1. Install MongoDB
Make sure MongoDB is running on your computer.

### 2. Setup Backend
```bash
cd leave-portal/backend
npm install
npm run seed    # This adds all students to database
npm run dev     # Starts backend on port 5000
```

### 3. Setup Frontend
```bash
cd leave-portal/frontend
npm install
npm run dev     # Starts frontend on port 3000
```

### 4. Open Browser
Go to http://localhost:3000

## Project Structure

```
leave-portal/
├── backend/
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── middleware/    # Auth & role checking
│   ├── seed.js       # Student data seeder
│   └── server.js     # Backend entry
└── frontend/
    ├── app/          # Pages
    ├── components/   # UI components
    └── lib/          # API helper
```
