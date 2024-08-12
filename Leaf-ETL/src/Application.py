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

        res = {"message": "Successfully completed ETL process"}
        return Response(status=200, mimetype="application/json", response=json.dumps(res))

    return app
