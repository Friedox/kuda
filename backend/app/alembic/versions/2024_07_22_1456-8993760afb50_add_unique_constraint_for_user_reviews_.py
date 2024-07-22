"""Add unique constraint for user reviews on trip

Revision ID: 8993760afb50
Revises: 9bb9c17ea9a3
Create Date: 2024-07-22 14:56:19.928205

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8993760afb50"
down_revision: Union[str, None] = "9bb9c17ea9a3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        "unique_user_trip_review", "review", ["user_id", "trip_id"]
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("unique_user_trip_review", "review", type_="unique")
    # ### end Alembic commands ###