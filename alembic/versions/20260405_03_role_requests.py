"""Add role change request table for role promotion workflow

Revision ID: 20260405_03_role_requests
Revises: 20260404_02_soft_delete
Create Date: 2026-04-05 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260405_03_role_requests'
down_revision = '20260404_02_soft_delete'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create role_change_requests table
    op.create_table(
        'role_change_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('requested_role', sa.Enum('admin', 'analyst', 'viewer', name='user_role'), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('reason', sa.String(500), nullable=True),
        sa.Column('admin_notes', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reviewed_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['reviewed_by_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    # Create indexes
    op.create_index('ix_role_change_requests_user_id', 'role_change_requests', ['user_id'])
    op.create_index('ix_role_change_requests_status', 'role_change_requests', ['status'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_role_change_requests_status', table_name='role_change_requests')
    op.drop_index('ix_role_change_requests_user_id', table_name='role_change_requests')
    # Drop table
    op.drop_table('role_change_requests')
