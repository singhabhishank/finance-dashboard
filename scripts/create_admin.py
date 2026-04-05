"""
Script to manually add an admin user to the Finance Dashboard database.
Run this script to create admin accounts that can then log in.

Usage:
    python scripts/create_admin.py

The admin's credentials will be displayed for login.
"""

import sqlite3
from argon2 import PasswordHasher

# Database path
DB_PATH = "finance_dashboard.db"

# Initialize password hasher
ph = PasswordHasher()


def create_admin():
    """Interactively create an admin user"""
    print("\n" + "=" * 60)
    print("CREATE ADMIN USER FOR FINANCE DASHBOARD")
    print("=" * 60 + "\n")

    # Get admin details from user
    email = input("Enter admin email: ").strip().lower()
    full_name = input("Enter admin full name: ").strip()
    password = input("Enter admin password (min 8 chars): ").strip()

    # Validate inputs
    if not email or "@" not in email:
        print("❌ Invalid email format")
        return

    if not full_name:
        print("❌ Please enter a full name")
        return

    if len(password) < 8:
        print("❌ Password must be at least 8 characters")
        return

    # Hash password using argon2 (bcrypt alternative)
    try:
        hashed_password = ph.hash(password)
    except Exception as e:
        print(f"❌ Error hashing password: {e}")
        return

    # Connect to database
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if user already exists
        cursor.execute("SELECT email FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            print(f"❌ User with email {email} already exists")
            conn.close()
            return

        # Insert admin user
        cursor.execute(
            """
            INSERT INTO users (email, full_name, hashed_password, role, status)
            VALUES (?, ?, ?, ?, ?)
            """,
            (email, full_name, hashed_password, "admin", "active"),
        )
        conn.commit()
        conn.close()

        print("\n" + "=" * 60)
        print("✅ ADMIN CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"\nAdmin Email:    {email}")
        print(f"Admin Password: {password}")
        print(f"Admin Name:     {full_name}")
        print(f"\nLogin at: http://localhost:3000")
        print("=" * 60 + "\n")

    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return


def list_admins():
    """List all current admins in the database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT email, full_name, created_at FROM users WHERE role = 'admin'")
        admins = cursor.fetchall()
        conn.close()

        if not admins:
            print("\nℹ️  No admin users found in database\n")
            return

        print("\n" + "=" * 60)
        print("CURRENT ADMIN USERS")
        print("=" * 60)
        for email, full_name, created_at in admins:
            print(f"\n  Email: {email}")
            print(f"  Name:  {full_name}")
            print(f"  Since: {created_at}")
        print("\n" + "=" * 60 + "\n")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        if sys.argv[1] == "--list":
            list_admins()
        else:
            print(f"Unknown command: {sys.argv[1]}")
            print("Usage: python create_admin.py [--list]")
    else:
        create_admin()
