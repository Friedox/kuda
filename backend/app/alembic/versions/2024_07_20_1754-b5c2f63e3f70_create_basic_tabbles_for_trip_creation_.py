"""create basic tabbles for trip creation and auth

Revision ID: b5c2f63e3f70
Revises: 2370d338af30
Create Date: 2024-07-20 17:54:24.990596

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "b5c2f63e3f70"
down_revision: Union[str, None] = "2370d338af30"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "point",
        sa.Column(
            "point_id", sa.Integer(), autoincrement=True, nullable=False
        ),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column(
            "address", postgresql.JSONB(astext_type=sa.Text()), nullable=False
        ),
        sa.PrimaryKeyConstraint("point_id", name=op.f("pk_point")),
    )
    op.create_index(
        op.f("ix_point_point_id"), "point", ["point_id"], unique=False
    )
    op.create_table(
        "tag",
        sa.Column("tag_id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("tag", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("tag_id", name=op.f("pk_tag")),
        sa.UniqueConstraint("tag", name=op.f("uq_tag_tag")),
    )

    tags = ["smoke", "child", "parcels", "with_animals", "max_two", "only_verified"]
    for tag in tags:
        op.execute(
            f"INSERT INTO tag (tag) VALUES ('{tag}')"
        )

    op.create_index(op.f("ix_tag_tag_id"), "tag", ["tag_id"], unique=False)
    op.create_table(
        "trip",
        sa.Column("trip_id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("pickup", sa.Integer(), nullable=False),
        sa.Column("dropoff", sa.Integer(), nullable=False),
        sa.Column("start_timestamp", sa.Integer(), nullable=False),
        sa.Column("end_timestamp", sa.Integer(), nullable=False),
        sa.Column("fare", sa.Integer(), nullable=False),
        sa.Column("available_sits", sa.String(), nullable=True),
        sa.Column("driver_phone", sa.String(), nullable=True),
        sa.Column("driver_tg", sa.String(), nullable=True),
        sa.Column("car_number", sa.String(), nullable=True),
        sa.Column("car_type", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(
            ["dropoff"], ["point.point_id"], name=op.f("fk_trip_dropoff_point")
        ),
        sa.ForeignKeyConstraint(
            ["pickup"], ["point.point_id"], name=op.f("fk_trip_pickup_point")
        ),
        sa.PrimaryKeyConstraint("trip_id", name=op.f("pk_trip")),
    )
    op.create_index(op.f("ix_trip_trip_id"), "trip", ["trip_id"], unique=False)
    op.create_table(
        "trip_tag",
        sa.Column(
            "trip_tag_id", sa.Integer(), autoincrement=True, nullable=False
        ),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.Column("trip_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["tag_id"], ["tag.tag_id"], name=op.f("fk_trip_tag_tag_id_tag")
        ),
        sa.ForeignKeyConstraint(
            ["trip_id"],
            ["trip.trip_id"],
            name=op.f("fk_trip_tag_trip_id_trip"),
        ),
        sa.PrimaryKeyConstraint("trip_tag_id", name=op.f("pk_trip_tag")),
    )
    op.create_index(
        op.f("ix_trip_tag_trip_tag_id"),
        "trip_tag",
        ["trip_tag_id"],
        unique=False,
    )
    op.create_table(
        "trip_user",
        sa.Column(
            "trip_user_id", sa.Integer(), autoincrement=True, nullable=False
        ),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("trip_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["trip_id"],
            ["trip.trip_id"],
            name=op.f("fk_trip_user_trip_id_trip"),
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.user_id"],
            name=op.f("fk_trip_user_user_id_user"),
        ),
        sa.PrimaryKeyConstraint("trip_user_id", name=op.f("pk_trip_user")),
    )
    op.create_index(
        op.f("ix_trip_user_trip_user_id"),
        "trip_user",
        ["trip_user_id"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_trip_user_trip_user_id"), table_name="trip_user")
    op.drop_table("trip_user")
    op.drop_index(op.f("ix_trip_tag_trip_tag_id"), table_name="trip_tag")
    op.drop_table("trip_tag")
    op.drop_index(op.f("ix_trip_trip_id"), table_name="trip")
    op.drop_table("trip")
    op.drop_index(op.f("ix_tag_tag_id"), table_name="tag")
    tags = ["smoke", "child", "parcels", "with_animals", "max_two", "only_verified"]
    for tag in tags:
        op.execute(
            f"DELETE FROM tag WHERE tag = '{tag}'"
        )
    op.drop_table("tag")
    op.drop_index(op.f("ix_point_point_id"), table_name="point")
    op.drop_table("point")
    # ### end Alembic commands ###
