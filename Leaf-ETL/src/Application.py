import json
import os
import io
import pyzipper
from flask import Flask, Response, request, send_file
from flask_cors import CORS

from src.controllers.EtlController import EtlController
from src.exceptions.DatabaseError import DatabaseError

etl_controller = EtlController()


def create_app(test_config=None):
    # Create and configure the application
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
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
    @app.route('/trigger', methods=['GET'])
    def trigger():
        report_name = request.args.get('title')

        try:
            fileId = etl_controller.trigger_process(report_name)
        except DatabaseError as e:
            print(e)
            res = {"error": "Error while accessing database"}
            return Response(status=400, mimetype="application/json", response=json.dumps(res))

        res = {"message": "Successfully completed ETL process", "fileId": fileId}
        return Response(status=200, mimetype="application/json", response=json.dumps(res))

    @app.route('/upload', methods=['POST'])
    def upload_file():
        file = request.files.get('file')
        password = request.form.get('password')  # Get password from the form data

        if file is None:
            return Response(
                status=400,
                mimetype="application/json",
                response=json.dumps({"error": "No file part in the request"})
            )

        if not password:
            return Response(
                status=400,
                mimetype="application/json",
                response=json.dumps({"error": "No password provided"})
            )

        # Create a password-protected ZIP file in memory using pyzipper
        zip_io = io.BytesIO()
        with pyzipper.AESZipFile(zip_io, 'w', compression=pyzipper.ZIP_DEFLATED,
                                 encryption=pyzipper.WZ_AES) as zip_file:
            zip_file.setpassword(password.encode('utf-8'))
            zip_file.writestr(file.filename, file.read())

        zip_io.seek(0)  # Go to the start of the BytesIO object

        try:
            # Upload the ZIP file to Google Drive using your etl_controller
            fileId = etl_controller.upload(zip_io, f"{file.filename}.zip")  # Provide the filename with .zip extension
            return Response(status=200, mimetype="application/json", response=json.dumps({"fileId": fileId}))

        except Exception as e:
            print(e)
            return Response(
                status=400,
                mimetype="application/json",
                response=json.dumps({"error": "Error while uploading report to Google Drive"})
            )

    @app.route('/download', methods=['GET'])
    def download():
        file_title = request.args.get('file_title') + '.zip'
        report_type = request.args.get('report_type')
        file_id = request.args.get('file_id')

        print(report_type)

        try:
            if report_type == "Full Report":
                etl_controller.gdrive_client.downloadFile(file_title)
            else:
                # Download the file as a BytesIO stream
                file_stream = etl_controller.gdrive_client.quickDownload(file_id, file_title)

                # Send the in-memory file as a response
                return send_file(
                    file_stream,
                    as_attachment=True,
                    download_name=f"{file_title}.zip",
                    mimetype="application/zip"
                )
        except Exception as e:
            print(e)
            res = {"error": "Error while downloading report from Google Drive"}
            return Response(status=400, mimetype="application/json", response=json.dumps(res))

        return send_file(f"../{file_title}", as_attachment=True, download_name=file_title)

    return app
