from setuptools import find_packages, setup

REQUIRES = [
    "Flask",
    "Flask-Cors",
    "flask-bcrypt",
    "psycopg2-binary"
]

setup(
    name="deep-trader",
    version="1.0.0",
    description="Deep Learning for Stock Market Trading",
    packages=find_packages(),
    install_requires=REQUIRES,
    python_requires=">=3.7"
)