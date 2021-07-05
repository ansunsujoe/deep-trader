FROM postgres:13.3

ENV POSTGRES_PASSWORD postgres2021
ADD database/trading.sql /docker-entrypoint-initdb.d

EXPOSE 5432
CMD ["postgres"]