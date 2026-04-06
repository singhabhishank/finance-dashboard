import os
import sqlite3
from app.core.security import get_password_hash

# Database path
DB_PATH = "finance_dashboard.db"

def create_admin():
    email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    full_name = os.getenv("ADMIN_NAME", "").strip()
    password = os.getenv("ADMIN_PASSWORD", "").strip()

    if not email or "@" not in email:
        print("Invalid ADMIN_EMAIL")
        return

    if not full_name:
        print("Invalid ADMIN_NAME")
        return

    if len(password) < 8:
        print("ADMIN_PASSWORD must be at least 8 characters")
        return

    hashed_password = get_password_hash(password)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT email FROM users WHERE email = ?", (email,))
    existing = cursor.fetchone()

    if existing:
        print(f"Admin already exists: {email}")
        conn.close()
        return

    cursor.execute(
        """
        INSERT INTO users (email, full_name, hashed_password, role, status)
        VALUES (?, ?, ?, ?, ?)
        """,
        (email, full_name, hashed_password, "admin", "active"),
    )
    conn.commit()
    conn.close()

    print(f"Admin created successfully: {email}")


if __name__ == "__main__":
    create_admin()
