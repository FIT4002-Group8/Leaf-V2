import psycopg2
import csv

class PostgresClient:
    def __init__(self, dbname, user, password, host, port):
        self.connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.cursor = self.connection.cursor()

    def fetch_data(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def close(self):
        self.cursor.close()
        self.connection.close()

def export_hospital_data_to_csv(client):
    query = "SELECT * FROM hospital"
    data = client.fetch_data(query)

    with open('hospital_data.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['ID', 'Code', 'Hospital Name'])  # CSV headers
        writer.writerows(data)

writer = csv.writer(csvfile, delimiter=';')
writer.writerow(['ID', 'Code', 'Hospital Name'])  # CSV headers
writer.writerows(data)


if __name__ == "__main__":
    client = PostgresClient(dbname='your_db', user='your_user', password='your_password', host='localhost', port='5432')

    export_hospital_data_to_csv(client)

    client.close()
