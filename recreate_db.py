#!/usr/bin/env python
"""Recreate database with updated schema"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.base import Base, engine

def recreate_db():
    db_path = "finance_dashboard.db"
    
    # Remove old database
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"✓ Removed old database")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print(f"✓ Created database with updated schema (including is_deleted column)")
    print(f"✓ Database location: {os.path.abspath(db_path)}")

if __name__ == "__main__":
    recreate_db()
