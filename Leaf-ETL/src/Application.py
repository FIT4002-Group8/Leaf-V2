import json
import os

from flask import Flask, Response

from src.controllers.EtlController import EtlController
from src.exceptions.DatabaseError import DatabaseError

etl_controller = EtlController()


def create_app(test_config=None):
    # Create and configure the application
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    if test_config is None:
        # Load the instance config when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Create a sample route for testing
    @app.route('/trigger')
    def trigger():
        try:
            etl_controller.trigger_process()
        except DatabaseError as e:
            print(e)
            res = {"error": "Error while accessing database"}
            return Response(status=400, mimetype="application/json", response=json.dumps(res))

        res = {"message": "Successfully extracted data from Firestore to Postgres"}
        return Response(status=200, mimetype="application/json", response=json.dumps(res))

    return app


    @app.route('/export/<table_name>', methods=['GET'])
    def export_csv(table_name):
        try:
            # Initialize PostgresClient
            postgres_client = PostgresClient(dbname="your_db", user="your_user", password="your_password")

            # Connect to the database
            postgres_client.connect()

            # Create the CSVExporter instance
            csv_exporter = CSVExporter(postgres_client)

            # Define the path for the CSV file
            csv_file_path = f"/path/to/export/{table_name}.csv"

            # Export the data to CSV
            csv_exporter.export_to_csv(table_name, csv_file_path)

            # Send the file as a response to the client
            return send_file(csv_file_path, as_attachment=True)
        except Exception as e:
            return str(e)
        finally:
            postgres_client.close()
