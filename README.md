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

## 🛠️ Development Notes

- **Console Logs for Debugging**  
  This project contains multiple `console.log()` statements in both backend and frontend files.  
  These were intentionally added to help trace app behavior during development.  
  You can remove them or replace them with a logging library like [`winston`](https://www.npmjs.com/package/winston) or [`morgan`](https://www.npmjs.com/package/morgan) for cleaner output in production.

- **Code Organization**  
  The project is structured simply for clarity:
  - `server.js`, `database.js`, and `config.js` are at the root.
  - Routes are in the `/routes` folder.
  - Middleware lives in `/middleware`.
  - Static files are in `/public`.

- **Security Notes**  
  While authentication is implemented using `bcrypt` and `jsonwebtoken`, additional improvements could be made:
  - Input validation (e.g., using `express-validator`)
  - Rate limiting to prevent brute-force attacks
  - CSRF protection and secure cookie handling
  - HTTPS setup for production environments

- **Database Reset**  
  KharchaTrack uses SQLite.  
  (you can download a DB browser with UI to view the database)
    
  To reset your data, just delete the `mydb.db` file located in the `/db` folder.  
  The database will be recreated automatically with the basic structure on next server start.



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
This project was built as a personal initiative to learn full stack development
by building something meaningful.

Feedback and contributions are welcome!



                                       Made with ☕👩🏻‍💻 by Yashvardhan Rajpurohit
```
