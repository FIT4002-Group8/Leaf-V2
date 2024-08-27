import os

from src.clients.FirestoreClient import FirestoreClient
from src.clients.PostgresClient import PostgresClient
from src.clients.GDriveClient import GDriveClient


class EtlController:
    def __init__(self):
        self.firestore_client = FirestoreClient("auth/leaf-f184f-firebase-adminsdk-2nh8n-87f2279075.json")
        self.postgres_client = PostgresClient("leaf-etl", "admin", "password")
        self.gdrive_client = GDriveClient("auth/service_account_secret.json")

    def trigger_process(self):
        print("Beginning EXTRACT Stage")
        self.__extract()
        print("EXTRACT Stage Completed")

        print("Beginning TRANSFORM Stage")
        self.__transform()
        print("TRANSFORM Stage Completed")

    def __extract(self):
        # Connect to Postgres & reset the tables
        self.postgres_client.connect()
        self.postgres_client.reset_etl_tables()

        # Providers Table - Requires Workers Collection
        workers_collection = self.firestore_client.get_all_documents("workers")
        self.postgres_client.insert_providers(workers_collection)

        # Patients, Triage Cases & Events Tables - Requires Patients Collection
        patients_collection = self.firestore_client.get_all_documents("patients")
        self.postgres_client.insert_patients(patients_collection)
        self.postgres_client.insert_triage_cases(patients_collection)
        self.postgres_client.insert_events(patients_collection)
        self.postgres_client.close()

    def __transform(self):
        self.postgres_client.connect()
        sql_directory = 'postgres/transformations'

        for file in sorted(os.listdir(sql_directory)):
            filename = os.fsdecode(file)
            if filename.endswith('.sql'):
                print(f"TRANSFORM: Running {sql_directory}/{filename}")
                fd = open(sql_directory + '/' + filename, 'r')
                sqlFile = fd.read()
                fd.close()
                sqlCommands = sqlFile.split(';')

                for command in sqlCommands:
                    if command:
                        self.postgres_client.execute_query(command)
