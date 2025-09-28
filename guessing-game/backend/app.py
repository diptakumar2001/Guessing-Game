from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'yourSecretKey'  # Change this in production

# --- Database setup ---
def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            score INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- Auth Middleware ---
def token_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            kwargs['user'] = data
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 403
    wrapper.__name__ = f.__name__
    return wrapper

# --- Routes ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password'].encode('utf-8')
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', (name, email, hashed))
        conn.commit()
        return jsonify({'message': 'Signup successful'})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'User already exists'}), 400
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password'].encode('utf-8')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()

    if not user or not bcrypt.checkpw(password, user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = jwt.encode({
        'id': user['id'],
        'name': user['name'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token, 'name': user['name']})

@app.route('/score', methods=['POST'])
@token_required
def submit_score(user):
    data = request.get_json()
    score = data['score']

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO scores (user_id, score) VALUES (?, ?)', (user['id'], score))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Score saved'})

@app.route('/top-scores', methods=['GET'])
@token_required
def top_scores(user):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT score FROM scores WHERE user_id = ? ORDER BY score DESC LIMIT 5', (user['id'],))
    scores = [row['score'] for row in cursor.fetchall()]
    conn.close()
    return jsonify({'scores': scores})

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT users.name, scores.score
        FROM scores
        JOIN users ON scores.user_id = users.id
        ORDER BY scores.score DESC, scores.created_at ASC
        LIMIT 10
    ''')
    leaderboard = [{'name': row['name'], 'score': row['score']} for row in cursor.fetchall()]
    conn.close()
    return jsonify({'leaderboard': leaderboard})

@app.route('/delete-account', methods=['DELETE'])
@token_required
def delete_account(user):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scores WHERE user_id = ?", (user['id'],))
    cursor.execute("DELETE FROM users WHERE id = ?", (user['id'],))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Account and scores deleted'})

@app.route('/reset-scores', methods=['POST'])
@token_required
def reset_scores(user):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scores WHERE user_id = ?", (user['id'],))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Scores reset'})

if __name__ == '__main__':
    app.run(debug=True) 