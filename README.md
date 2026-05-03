# 💼 Job Portal Web Application

A modern full-stack **Job Portal Platform** where recruiters can post jobs, candidates can apply, and admins manage approvals — built with MERN stack and modern UI tools.

---

## 🌟 Live Features

### 👨‍💼 Recruiter

* Register & create profile
* Wait for admin approval
* Post and manage job listings
* View applicants

### 👤 Candidate (User)

* Search jobs by keyword
* Filter jobs (location, industry, salary)
* Apply for jobs
* Save jobs for later
* Upload resume

### 🛡️ Admin

* Approve recruiter accounts
* Manage job postings
* Control platform access

### 📧 Email System

* Email notifications for:

  * Recruiter approval
  * Job application updates

---

## 🖼️ UI Overview

### 🔍 Home Page

* Job search bar
* Featured categories (Frontend, Backend)
* Latest & top job listings

### 📋 Job Listing Page

* Advanced filters:

  * Location
  * Industry
  * Salary range
* Job cards with:

  * Company info
  * Job type & salary
  * Save & Apply options

---

## 🛠️ Tech Stack

### 🔧 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cloudinary (file uploads)
* Nodemailer (email sending)

### 🎨 Frontend

* React (Vite)
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios

---

## 📁 Folder Structure

```
project-root/
│
├── backend/
│   ├── controller/      # Business logic (auth, jobs, users)
│   ├── middleware/      # Auth middleware, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # File storage
│   ├── utils/           # Helper utilities (email, cloudinary)
│   ├── index.js         # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/             # React app source
│   ├── components.json
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/anikmahidul9/job_portal
cd job-portal
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside **backend/**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_KEY_SECRET=your_api_secret

GMAIL_USER=your_email
GMAIL_APP_PASSWORD=your_email_password
SSLCOMMERZ_STORE_ID=your_store_name
SSLCOMMERZ_STORE_PASSWORD=your_password
FORNTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Application Flow

1. Recruiter signs up → waits for admin approval
2. Admin approves recruiter
3. Recruiter posts jobs
4. Candidates browse & apply
5. Email notifications are triggered

---

## 📌 Key Functionalities

* 🔐 Secure authentication (JWT)
* 📤 Resume upload (Cloudinary)
* 💾 Save jobs for later
* 🔎 Smart job search & filtering
* 📬 Email notifications system

---

## 📜 Available Scripts

### Backend

```bash
npm run dev   # Run server with nodemon
```

### Frontend

```bash
npm run dev   # Start dev server
npm run build # Production build
```

---

## 🚀 Future Improvements

* Real-time notifications
* Chat between recruiter & candidate
* Advanced filtering (experience, skills)
* Admin analytics dashboard

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

---

## 👨‍💻 Author

**Mahidul**

---


