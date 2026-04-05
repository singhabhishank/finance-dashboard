"""Manual seed script for demo users"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.utils.enums import UserRole, UserStatus
from datetime import datetime

DEMO_USERS = [
    ("admin@demo.com", "Demo Admin", "Admin123", UserRole.admin),
    ("analyst@demo.com", "Demo Analyst", "Analyst123", UserRole.analyst),
    ("viewer@demo.com", "Demo Viewer", "Viewer123", UserRole.viewer),
]

db = SessionLocal()

try:
    for email, name, password, role in DEMO_USERS:
        # Check if user exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"✓ {email} already exists")
            continue
        
        user = User(
            email=email,
            full_name=name,
            hashed_password=get_password_hash(password),
            role=role,
            status=UserStatus.active,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(user)
    
    db.commit()
    print("✓ All demo users created successfully!")
finally:
    db.close()
