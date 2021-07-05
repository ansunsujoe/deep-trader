FROM python:3.9

# Make the backend root directory
RUN mkdir /usr/src/backend
WORKDIR /usr/src/backend

# Copy and install requirements
COPY requirements.txt .
RUN pip install -r backend/requirements.txt

# Install and run flask app
COPY backend/app.py .
EXPOSE 5001
ENV FLASK_ENV=development
CMD ["python", "app.py"]