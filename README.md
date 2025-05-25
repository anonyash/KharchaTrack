# <p align="center" ><b> KharchaTrack </b></p> 

**KharchaTrack** is a full stack web-based expense tracking application built to help users manage their daily expenses in a simple and effective way.


## 📸 Preview


<p align="center" ><b> Dashboard </b></p> 

![localhost_3000_index html (1)](https://github.com/user-attachments/assets/b312dae4-391b-45bf-96f7-076817967637)
---

<p align="center" ><b> analytics </b></p>

![localhost_3000_analytics html](https://github.com/user-attachments/assets/cd264a8d-d4a3-4752-818f-edebbcab608c)
---

<p align="center" ><b> accounts </b></p>

![localhost_3000_accounts html](https://github.com/user-attachments/assets/d134e65f-2380-410c-a845-8e84223c79e2)



## 🚀 Features
- 🔐 User authentication (Signup & Login)
- ➕ Add new expenses
- 📜 View all expenses in a list
- ❌ Delete specific expenses
- 📊 Visualize expense summaries using Chart.js
- 🌱 Minimal UI, built for simplicity and learning


## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- SQLite

**Other Tools**
- `bcrypt` for secure password hashing
- `jsonwebtoken` for session handling
- `dotenv` for managing environment variables
- `Chart.js` for data visualization

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
