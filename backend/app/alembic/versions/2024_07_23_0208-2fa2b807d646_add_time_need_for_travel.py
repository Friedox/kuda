"""Add time need for travel

Revision ID: 2fa2b807d646
Revises: 8993760afb50
Create Date: 2024-07-23 02:08:44.670644

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2fa2b807d646"
down_revision: Union[str, None] = "8993760afb50"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("trip", sa.Column("travel_time", sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("trip", "travel_time")
    # ### end Alembic commands ###
