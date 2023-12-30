import csv
import io
import json
import random
import time
import zipfile
from datetime import datetime
from kafka import KafkaProducer


# Define a class for Tweet
class Tweet:
    def __init__(self, id, user, text, date):
        self.id = int(id)
        self.date = date
        self.user = user
        self.text = text
        self.retweets = int(random.random() * 10)

    # Method to get tweet data as a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "user": self.user,
            "text": self.text,
            "retweets": self.retweets
        }


# Create a Kafka producer instance with JSON serializer for the value
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Function to process and send a line
def process_and_send(row):
    try:

        # read date from row and convert it date object
        date_obj = datetime.strptime(row[2], "%a %b %d %H:%M:%S PDT %Y")

        # convert object to string with provided format

        iso_format_date = date_obj.strftime("%Y-%m-%dT%H:%M:%S%z")

        # Create a Tweet object
        tweet = Tweet(id=row[1], user=row[4], text=row[5], date=iso_format_date)

        print(tweet.to_dict())

        # Send the tweet to kafka
        producer.send('tweets-topic', value=tweet.to_dict())

    except IndexError:
        print("Error: Line does not contain enough data.")
    except Exception as e:
        print(f"Unexpected error: {e}")


# Main processing loop
try:
    with zipfile.ZipFile('archive.zip', 'r') as z:
        with z.open('training.1600000.processed.noemoticon.csv') as f:

            text_file = io.TextIOWrapper(f, encoding='utf-8')

            reader = csv.reader(text_file)

            for i, row in enumerate(reader, 1):
                process_and_send(row)
                if i % 1000 == 0:
                    time.sleep(10)
finally:
    producer.flush()
    producer.close()


# %%

# %%
