import os
from flask import Flask, send_file, jsonify, request
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import pyzipper
import tempfile
from flask_cors import CORS
from io import StringIO
import csv
from google.oauth2 import service_account

app = Flask(__name__)
CORS(app)


def authenticate_drive():
    gauth = GoogleAuth()
    gauth.LoadClientConfigFile("client_secret.json")
    gauth.LoadCredentialsFile("mycreds.txt")

    if gauth.credentials is None:
        gauth.LocalWebserverAuth()
    elif gauth.access_token_expired:
        gauth.Refresh()
    else:
        gauth.Authorize()

    gauth.SaveCredentialsFile("mycreds.txt")

    # scope = ['https://www.googleapis.com/auth/drive']
    # gauth.credentials = service_account.Credentials.from_service_account_file('service_key.json', scopes=scope)

    return GoogleDrive(gauth)


@app.route('/download-zip', methods=['GET'])
def download_zip():
    file_id = request.args.get('file_id')
    file_title = request.args.get('file_title')
    password = request.args.get('password')

    if not file_id:
        return jsonify({"error": "file_id parameter is required"}), 400

    try:
        drive = authenticate_drive()

        csv_file_name = f'{file_title}.csv'
        zip_file_name = f'{file_title}.zip'

        temp_csv_path = os.path.join(tempfile.gettempdir(), csv_file_name)
        downloaded_file = drive.CreateFile({'id': file_id})
        downloaded_file.GetContentFile(temp_csv_path)

        zip_file_path = os.path.join(tempfile.gettempdir(), zip_file_name)
        with pyzipper.AESZipFile(zip_file_path, 'w', compression=pyzipper.ZIP_DEFLATED,
                                 encryption=pyzipper.WZ_AES) as zf:
            zf.setpassword(password.encode())
            zf.write(temp_csv_path, csv_file_name)

        os.remove(temp_csv_path)

        # Send the ZIP file directly as a response
        return send_file(zip_file_path, as_attachment=True, download_name=zip_file_name)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload-csv', methods=['GET'])
def upload_csv():
    title = request.args.get('title')  # Use path as title atm

    if not title:
        return jsonify({"error": "invalid data"}), 400

    # Call ETL function
    # TODO - ETL function call goes here

    try:
        # Create a CSV file in memory
        csv_buffer = StringIO()
        csv_writer = csv.writer(csv_buffer)
        csv_writer.writerow([title])  # Write the title as the content of the CSV

        # Convert the CSV content to a string and save it to a file
        csv_content = csv_buffer.getvalue()
        csv_filename = f'{title}.csv'

        with open(csv_filename, 'w') as f:
            f.write(csv_content)

        # Upload the file to Google Drive
        drive = authenticate_drive()
        file = drive.CreateFile({'title': csv_filename})
        file.SetContentFile(csv_filename)
        file.Upload()

        # Return file ID for front end and download Add file info to Firestore Database
        file_id = file['id']
        print(f'File ID: {file_id}')

        print(jsonify({"id": str(file_id)}))
        return jsonify({"id": str(file_id)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# # TEST API
# file_id = '1NKD8O09NjQG3tZ3CgCIrYl0XHZDCuDZe'
# try:
#     drive = authenticate_drive()
#
#     csv_file_name = 'downloaded_file.csv'
#     zip_file_name = 'protected_file.zip'
#     password = 'password'
#
#     temp_csv_path = os.path.join(tempfile.gettempdir(), csv_file_name)
#     downloaded_file = drive.CreateFile({'id': file_id})
#     downloaded_file.GetContentFile(temp_csv_path)
#
#     zip_file_path = os.path.join(tempfile.gettempdir(), zip_file_name)
#     with pyzipper.AESZipFile(zip_file_path, 'w', compression=pyzipper.ZIP_DEFLATED,
#                              encryption=pyzipper.WZ_AES) as zf:
#         zf.setpassword(password.encode())
#         zf.write(temp_csv_path, csv_file_name)
#
#     os.remove(temp_csv_path)
#
#     # Send the ZIP file directly as a response
#     print("SUCCESS")
#
# except Exception as e:
#     print(str(e))

if __name__ == '__main__':
    app.run(debug=True)
