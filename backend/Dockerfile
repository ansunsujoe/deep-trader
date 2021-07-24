FROM python:3.9

# Environment variables
ENV FLASK_ENV=development
ENV DATABASE_URL=postgresql://postgres:postgres2021@localhost:5432/deep_trader

# Make the backend root directory
RUN mkdir /usr/src/backend
WORKDIR /usr/src/backend

# Copy backend code
COPY backend .

# Install requirements and deep-trader package
RUN pip install -r requirements.txt && \
    python -m pip install .

# Run flask app
EXPOSE 5001
CMD ["python", "app.py"]