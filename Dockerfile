FROM python:slim

WORKDIR /app
COPY . .

RUN pip install pipenv
RUN pipenv install --system --deploy --ignore-pipfile

CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]