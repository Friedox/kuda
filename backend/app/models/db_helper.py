from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, AsyncSession, async_sessionmaker

from config import settings


class DatabaseHelper:
    def __init__(
            self,
            url: str,
            echo: bool = False,
            echo_pool: bool = False,
            max_overflow: int = 10,
            pool_size: int = 5

    ) -> None:
        self.engine: AsyncEngine = create_async_engine(
            url=url,
            echo=echo,
            echo_pool=echo_pool,
            max_overflow=max_overflow,
            pool_size=pool_size

        )
        self.session_factory: async_sessionmaker[AsyncSession] = async_sessionmaker(
            bind=self.engine,
            autocommit=False,
            autoflush=False,
            expire_on_commit=False,
        )
        self.metadata: MetaData = MetaData()

    async def dispose(self) -> None:
        await self.engine.dispose()

    async def session_getter(self) -> AsyncGenerator[AsyncSession, None]:
        async with self.session_factory() as session:
            yield session


database_helper = DatabaseHelper(
    url=f"postgresql+asyncpg://{settings.database.db_user}:{settings.database.db_password}@"
        f"{settings.database.db_host}/{settings.database.db_name}",
    echo=settings.database.echo,
    echo_pool=settings.database.echo_pool,
    max_overflow=settings.database.max_overflow,
    pool_size=settings.database.pool_size,
)

test_database_helper = DatabaseHelper(
    url=f"postgresql+asyncpg://{settings.test_database.db_user}:{settings.test_database.db_password}@"
        f"{settings.test_database.db_host}/{settings.test_database.db_name}",
    echo=settings.test_database.echo,
    echo_pool=settings.test_database.echo_pool,
    max_overflow=settings.test_database.max_overflow,
    pool_size=settings.test_database.pool_size,
)
