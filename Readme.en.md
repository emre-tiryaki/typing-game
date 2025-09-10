Click for the English version / [Türkçe versiyonu için tıklayın](Readme.md)

---

typing-game is a [TypingClub](https://www.typingclub.com) clone and aims to help users improve their typing speed on the keyboard. We made this project to learn teamwork and developing a project with git, so it may not look perfect we kindly ask for your understanding 😇.

---

# Project Link
https://typing-game-92pq.onrender.com

---

# Project Screenshots

## 1. Homepage
<img width="1869" height="935" alt="image" src="https://github.com/user-attachments/assets/11b79625-df21-45b0-af7c-5cedbb836cd3" />

## 2. Levels
<img width="1869" height="935" alt="image" src="https://github.com/user-attachments/assets/5aadb818-d0ab-49e8-a31b-d3ea79c6dd4f" />

## 3. Gameplay
<img width="1869" height="935" alt="image" src="https://github.com/user-attachments/assets/df77519a-05e9-4061-9c44-78f21aee99f6" />

---

# Contributors
| <img src="https://github.com/10sinan.png" width="150" height="150" style="border-radius: 50%;" alt="Mehmet Sinan Sönmez"> | <img src="https://github.com/emre-tiryaki.png" width="150" height="150" style="border-radius: 50%;" alt="Emre Tiryaki"> |
|:---:|:---:|
| **Mehmet Sinan Sönmez** | **Emre Tiryaki** |
| Frontend Developer | Backend Developer |
| [<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20" height="20"> GitHub](https://github.com/10sinan) | [<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20" height="20"> GitHub](https://github.com/emre-tiryaki) |

---

## Table of Contents
1. [Features](#features)  
2. [Technologies](#technologies)  
3. [Installation](#installation)  
4. [To-Do](#to-do)  

---

# Features
The main highlights of our project:
- Our project offers a user-friendly interface and educational content for users who want to improve their typing speed, providing an engaging learning experience.
- Login:
	- Our project supports creating and using accounts with JWT. This way, users can save their progress.
	- If users just want to try it without creating an account, they can log in as a guest. However, this only opens a 7-day session, and after one week, their progress will be lost.
- Usage

---

# Technologies
Details on which technologies were used in which parts of the project.

## **Frontend**:
Developed entirely by [Mehmet Sinan Sönmez](https://github.com/10sinan).

### ***Technologies Used***
- **HTML5** → For the base structure of the application.
- **CSS** → For layout, colors, and typography.
- **JavaScript** → For game mechanics (not yet implemented), interactions, etc.
### *Libraries Used:*
- **LocalStorage** → To store theme preferences (dark/light).
- **Axios API** → For communication with the backend (user sessions, saving scores).
### ***UI Features***
- **Theme Selector (Dark / Light)** → Customizable appearance.
- **Progress Bar** → To show success percentage in lessons.
- **Mobile Compatibility** → Responsive design.

## **Backend**:
Developed entirely by [Emre Tiryaki](https://github.com/emre-tiryaki).  

The backend was built using JavaScript.

### ***Technologies Used:***
- **Node.js**: For writing server-side code with JavaScript.
- **Express.js**: To make working with Node.js easier.
- **MongoDB**: A nice NoSQL database for storing user and level data.
- **JWT**: A perfect solution for authentication and account security.
- **Google OAuth**: To support login with Google.

### *Libraries Used:*
- **express**: To use Express.js.  
- **dotenv**: To fetch hidden environment variables.  
- **cookie-parser**: For handling cookies.  
- **cors**: To securely handle requests.  
- **mongoose**: A special library for working with MongoDB.  
- **bcrypt**: A powerful library for password encryption.  
- **jsonwebtoken**: Required for JWT functionality.  
- **google-auth-library**: Required for Google login.  

---

# Installation
If you want to clone and use the code, here are the steps:  

## 1. Set up the `.env` file
The project needs certain variables to run properly. These are listed in the `.env.example.env` file.

## 2. Install the modules
First, navigate into the backend folder:
```terminal
cd backend
````

Then install the modules:

```terminal
npm install
```

Once done, the project modules will be installed and ready to use.

## 3. Run the server

After setting up the `.env` file and installing the modules, you can start the server in 2 ways.

### 1. Start normally

```terminal
npm run start
```

or

```terminal
node server.js
```

### 2. Start with nodemon

For development purposes:

```terminal
npm run devStart
```

or

```terminal
nodemon server.js
```

## 4. Open the project site

To open the project site, go to the `welcome.html` file with the port you configured:

```URL
http://localhost:{your-configured-port}/html/welcome.html
```

Or simply go to the localhost address, and you’ll be redirected to the homepage automatically:

```URL
http://localhost:{your-configured-port}
```

---

# To-Do

1. Add more levels to our project.
2. Our project does not fully support Google login yet — we will fix this.
3. Our project does not support Facebook login!!! We added the button thinking we’d implement it later but gave up. Please ignore it.
4. Even though you receive a code via email during registration, there is no interface to enter the code yet — we’ll add this 😅.
5. Unfortunately, finishing levels is not supported yet — we’ll bring this in the next update.
