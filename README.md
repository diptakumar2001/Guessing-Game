# Guessing-Game
"Guessing Game" is a full-stack web-based guessing game, where users can log in, select difficulty levels, and guess the object in the picture before time runs out. Players can view the score on the leadership board.
## Features
- User authentication (signup, login, logout)
- Image guessing gameplay with multiple categories
- Adjustable difficulty levels
- Score tracking and leaderboard system
- Account management (delete account, reset scores)
- Responsive design
---

## Technologies
**Frontend:** HTML, CSS, JavaScript  
**Backend:** Python (Flask), SQLite, bcrypt, JWT

---

## Setup
## Step 1: Clone the Repository
Clone the repository by using the GitHub repo link

## Step 2: Running the game

- After cloning the repository, go to the project folder and double-click on start(Windows Batch file).
- It should set up the backend by installing the dependencies.
- If everything is successful, you should see something like this(Running on http://127.0.0.1:5000), which will open your browser and take you to the user login page.

## Step 3: How to play
- Sign up for an Account(Log in if you already have one).
- On the home screen:
    Choose a difficulty level (Easy, Medium, Hard)
    Choose a category (Animals, Plants, Objects)
- Click Start Game.
- A silhouette image will appear. Type your guess in the input box.
- You have a limited time to guess(Based on your difficulty level). If you’re stuck, click Hint for options.
- Earn points for correct guesses.
- When finished, view your score and leaderboard.
- You can reset your scores, delete or log out your account, or play again anytime.

## Security Notes

- All passwords are securely hashed using bcrypt.
- Login sessions are protected with JWT tokens.
- CORS enabled for safe frontend-backend communication.

## Future Improvements

- Add sound effects and animations.
- Implement online multiplayer mode.
- Deploy backend to Render..
- Deploy frontend to GitHub Pages.

If you have any suggestions, please let me know.

Email: diptakmondal2001.ind@gmail.com

## Author
Dipta Kumar Mondal

Bachelor of Computer Science | Acadia University

Dean's List(2024-2025)
