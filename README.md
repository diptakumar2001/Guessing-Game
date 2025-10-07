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

### Backend
```bash
# from project root
python -m venv venv
# activate venv:
venv\Scripts\activate     # Windows
# or
source venv/bin/activate  # macOS / Linux

pip install -r Dependancies.txt
python app.py

