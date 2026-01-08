

# Project Camp Application

## 📌 Project Overview

Project Camp is a comprehensive project management application designed to help teams efficiently organize projects, tasks, notes, and files. Built with the MERN stack and modern frontend tools, it focuses on scalability, security, and a clean user experience.

---

## 🚀 Key Features

* **Project Management** – Create, manage, and organize multiple projects.
* **Task Tracking** – Break work into tasks and subtasks for better planning.
* **Notes System** – Create and share notes within project spaces.
* **Project File Management** – Upload, view, and delete project-related files.
* **User Roles & Permissions** – Role-based access control (Admin, Project Admin, Member).
* **Secure Authentication** – JWT-based authentication with secure cookies.
* **Responsive & Detailed UI** – Built using Tailwind CSS and Shadcn UI.

---

## 🛠️ Tech Stack

### Frontend

* **Framework**: React (Vite) + TypeScript
* **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
* **State Management**: TanStack Query (React Query)
* **Routing**: React Router DOM
* **Forms & Validation**: React Hook Form + Zod
* **Icons**: Lucide React

### Backend

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT, BCrypt
* **File Uploads**: Multer
* **Email Service**: Nodemailer

---

## 📦 Installation & Setup

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (Local or Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Shubham45264/Project-Camp-Application-main.git
cd Project-Camp-Application-main
```

---

### 2. Backend Setup

```bash
cd "Project Camp Backend"
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/project-camp
ACCESS_TOKEN_SECRET=your_secret_key
ACCCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd "Project Camp Frontend"
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

---

## 🔮 Future Enhancements

* Real-time collaboration and notifications
* Activity logs and audit trails
* Advanced role permissions
* Project analytics and insights

---

## 👥 Contributors

* **Shubham Jamdar** – Initial Work
* **Nitanshu Tiwari**

---

## 📄 License

This project is licensed under the ISC License.


---

