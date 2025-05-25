# KharchaTrack

**KharchaTrack** is a full stack web-based expense tracking application built to help users manage their daily expenses in a simple and effective way.

## 🚀 Features

- User authentication (Signup & Login)
- Add, view, and delete expenses
- Track daily spending habits
- Simple, intuitive interface
- Built with lightweight technologies and no external dashboards

## 🛠️ Tech Stack

**Frontend**  
- HTML, CSS, JavaScript

**Backend**  
- Node.js with Express

**Database**  
- SQLite

**Other Tools**  
- bcrypt (password hashing)  
- jsonwebtoken (authentication)  
- dotenv (environment configuration)  
- Chart.js (visualization)

## 📁 Project Structure


KharchaTrack/  
└── KharchaTrack v0.1/  
├── .env  
├── .gitignore  
├── config.js  
├── database.js  
├── package.json  
├── package-lock.json  
├── server.js  
├── db/  
│ └── mydb.db  
├── middleware/  
│ └── auth.js  
├── public/  
│ ├── index.html  
│ ├── login.html  
│ ├── signup.html  
│ ├── style.css  
│ └── script.js  
└── routes/  
├── auth.js  
└── expenses.js  


## 🚀 Getting Started

### Prerequisites

- Node.js installed (version 16+ recommended)
- Git installed

### Installation

```bash
git clone https://github.com/anonyash/KharchaTrack.git
cd "KharchaTrack/KharchaTrack v0.1"
npm install
```

### Configure Environment  
Create a .env file in the root with the following:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

Running the App
For development (auto-restarts on changes):
```bash
npm run devstart
```
For production:
```bash
npm start
```
**The app will be available at http://localhost:3000 (or the port defined in .env).**


## 🔧 Future Improvements
- Expense categories and filters
- Monthly/weekly summaries
- User profile settings
- Responsive/mobile-friendly UI
- Dark mode

## 📜 License  
**This project is licensed under the ISC License.**

<br><br>
---
```yaml
This project was built as a personal initiative to learn full stack development by building something meaningful.
Feedback and contributions are welcome!



                                       Made with ☕👩🏻‍💻 by Yashvardhan Rajpurohit
```
