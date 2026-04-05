"""Add soft delete support to financial records

Revision ID: 20260404_02_soft_delete
Revises: 20260403_01
Create Date: 2026-04-04 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260404_02_soft_delete'
down_revision = '20260403_01'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_deleted column to financial_records table
    op.add_column('financial_records', sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='0'))
    # Create index for soft delete queries
    op.create_index('ix_financial_records_is_deleted', 'financial_records', ['is_deleted'])


def downgrade() -> None:
    # Remove index
    op.drop_index('ix_financial_records_is_deleted', table_name='financial_records')
    # Remove column
    op.drop_column('financial_records', 'is_deleted')
