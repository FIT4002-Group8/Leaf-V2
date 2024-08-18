import psycopg2

from src.exceptions.DatabaseError import DatabaseError


class PostgresClient:
    def __init__(self, dbname, user, password, host='localhost', port=5432):
        self.dbname = dbname
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.connection = None

    def connect(self):
        try:
            self.connection = psycopg2.connect(
                dbname=self.dbname,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port
            )
            print("Connection to PostgreSQL DB successful")
        except Exception as e:
            raise DatabaseError("Error connecting to PostgreSQL DB", e)

    def close(self):
        if self.connection:
            self.connection.close()
            print("Connection closed")

    def reset_etl_tables(self):
        self.__check_connection()
        self.__execute_query("TRUNCATE provider, patient, triage_case, events;")

    def insert_providers(self, workers):
        self.__check_connection()

        query = """
        INSERT INTO
            provider (id, first_name, last_name, email, hospital_id)
        VALUES 
        """

        for worker in workers:
            query += f"('{worker['id']}', '{worker['firstName']}', '{worker['lastName']}', '{worker['email']}', '{worker['currentHospitalId']}'),\n"
        query = query[:-2] + ";"

        self.__execute_query(query)

    def insert_patients(self, patients):
        self.__check_connection()

        query = """
        INSERT INTO
            patient (mrn, first_name, last_name, date_of_birth, phone_number, post_code, sex, time_last_allocated, provider_id, hospital_id) 
        VALUES 
        """

        for patient in patients:
            query += f"('{patient['mrn'].replace('-', '')}', '{patient['firstName']}', '{patient['lastName']}', '{patient['dob']}', '{patient['phoneNumber']}', '{patient['postCode']}', '{patient['sex']}', '{patient['timeLastAllocated']}', '{patient['idAllocatedTo']}', '{patient['triageCase']['hospitalId']}'),\n"
        query = query[:-2] + ";"

        self.__execute_query(query)

    def insert_triage_cases(self, patients):
        self.__check_connection()

        # Add nullable Discharge Date and Discharge Ward
        query = """
        INSERT INTO
            triage_case (id, triage_code, triage_text, patient_id, arrival_date, arrival_ward_id, hospital_id, medical_unit_id) 
        VALUES 
        """

        for patient in patients:
            triage = patient["triageCase"]
            query += f"('{triage['id']}', '{triage['triageCode']}', '{triage['triageText']}', '{patient['mrn'].replace('-', '')}', '{triage['arrivalDate']}', '{triage['arrivalWardId']}', '{triage['hospitalId']}', '{triage['medicalUnitId']}'),\n"
        query = query[:-2] + ";"

        self.__execute_query(query)

    def insert_events(self, patients):
        self.__check_connection()

        query = """
        INSERT INTO
            events (id, patient_id, title, description, category, created_at, last_completed, trigger_time) 
        VALUES 
        """

        for patient in patients:
            events = patient["events"]
            for event in events:
                query += f"('{event['id']}', '{patient['mrn'].replace('-', '')}', '{event['title']}', '{event['description']}', '{event['category'].replace(' ', '_')}', '{event['createdAt']}', '{event['lastCompleted']}', '{event['triggerTime']}'),\n"
        query = query[:-2] + ";"

        self.__execute_query(query)

    def __check_connection(self):
        if self.connection is None:
            raise DatabaseError("Connection not established. Call connect() first.")

    def __execute_query(self, query):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                self.connection.commit()
                print("Query executed successfully")
        except Exception as e:
            raise DatabaseError("Error executing query", e)


    def fetch_data(self, table_name):
            self.__check_connection()
            query = f"SELECT * FROM {table_name};"
            try:
                with self.connection.cursor() as cursor:
                    cursor.execute(query)
                    columns = [desc[0] for desc in cursor.description]
                    rows = cursor.fetchall()
                    data = [dict(zip(columns, row)) for row in rows]
                    return data
            except Exception as e:
                raise DatabaseError(f"Error fetching data from {table_name}", e)
