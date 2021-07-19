FROM python:3.9

# Make the backend root directory
RUN mkdir /usr/src/backend
WORKDIR /usr/src/backend

# Copy and install requirements
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Environment variables
ENV FLASK_ENV=development
ENV DATABASE_URL=postgresql://postgres:postgres2021@localhost:5432/deep-trader

# Install and run flask app
COPY backend/app.py .
EXPOSE 5001

CMD ["python", "app.py"]