import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

test_users = [
    {"email": "admin@test.com", "password": "admin123", "full_name": "Test Admin", "role": "admin"},
    {"email": "analyst@test.com", "password": "analyst123", "full_name": "Test Analyst", "role": "analyst"},
    {"email": "viewer@test.com", "password": "viewer123", "full_name": "Test Viewer", "role": "viewer"}
]

conn = sqlite3.connect('finance_dashboard.db')
cursor = conn.cursor()

for user in test_users:
    hashed_password = pwd_context.hash(user['password'])
    try:
        cursor.execute("INSERT INTO users (email, full_name, hashed_password, role, status) VALUES (?, ?, ?, ?, ?)",
                      (user['email'], user['full_name'], hashed_password, user['role'], 'active'))
        print(f"✓ Created {user['role']} account: {user['email']}")
    except sqlite3.IntegrityError:
        print(f"⚠ {user['email']} already exists")

conn.commit()
conn.close()
