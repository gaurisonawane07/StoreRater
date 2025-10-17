# 🏪 Store Rater — Smart Store Rating Platform

A **role-based MERN stack web application** that allows users to rate stores, owners to manage their stores, and admins to oversee users and ratings.  
Built with **React, Node.js, Express, PostgreSQL, and Tailwind CSS** — this project demonstrates authentication, authorization, and CRUD operations in a clean and modern interface.

---

## 🚀 Features

### 👤 User
- Register/Login and rate stores ⭐  
- View store ratings in real time  
- Simple and responsive interface  

### 🏪 Store Owner
- Register and manage own store  
- View customer ratings  
- Update store details  

### 🛠️ Admin
- Manage all users and stores  
- Add new users or stores manually  
- View total users, stores, and ratings in a dashboard  
- Modern gradient UI with modals & analytics cards  

---

## 🧠 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React.js, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Token) |
| **Deployment (optional)** | Render / Vercel |
| **Other Tools** | React Hot Toast, Context API, REST APIs |

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/gaurisonawane07/store-rater.git
   cd store-rater

2. **Install Dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install

3. **Set up environment variables**
- Create a .env file inside the server/ folder:
   ```env
   DATABASE_URL=Your_DB_URL
   JWT_SECRET=yoursecretkey
   PORT=your_port_number


## API Endpoints Summary

| Method | Endpoint                    | Description           | Access |
| ------ | --------------------------- | --------------------- | ------ |
| POST   | `/api/auth/register`        | Register new user     | Public |
| POST   | `/api/auth/login`           | Login user            | Public |
| GET    | `/api/stores`               | List all stores       | Public |
| POST   | `/api/ratings`              | Submit rating         | User   |
| GET    | `/api/admin/dashboard`      | Admin stats           | Admin  |
| GET    | `/api/admin/users`          | List users            | Admin  |
| POST   | `/api/admin/stores`         | Add store             | Admin  |
| GET    | `/api/owner/stores/ratings` | Owner’s store ratings | Owner  |
