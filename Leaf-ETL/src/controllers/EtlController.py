from datetime import datetime
from src.clients.FirestoreClient import FirestoreClient
from src.clients.PostgresClient import PostgresClient


class EtlController:
    def __init__(self):
        self.firestore_client = FirestoreClient("auth/leaf-f184f-firebase-adminsdk-2nh8n-470e3b79de.json")
        self.postgres_client = PostgresClient("leaf-etl", "admin", "password")

    def trigger_process(self):
        self.__extract()

    def __extract(self):
        # Create ETL Process record
        etl_record = {
            "state": "EXTRACT",
            "status": "IN_PROGRESS",
            "start_time": datetime.now(),
            "last_updated_at": datetime.now(),
            "triggered": "w",  # Hard-Coded, should be passed in to /trigger endpoint
            "file": None
        }
        self.firestore_client.write_document("etl_jobs", etl_record)

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
