import os
from flask import Flask, send_file, jsonify, request
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import pyzipper
import tempfile
from flask_cors import CORS

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
    return GoogleDrive(gauth)


@app.route('/download-zip', methods=['GET'])
def download_zip():
    file_id = request.args.get('file_id')
    if not file_id:
        return jsonify({"error": "file_id parameter is required"}), 400

    try:
        drive = authenticate_drive()

        csv_file_name = 'downloaded_file.csv'
        zip_file_name = 'protected_file.zip'
        password = 'password'

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


# # TEST API
# authenticate_drive()
# file_id = '1TdbeTZ4gXDFXqt-OURqYKh11ZKs4MgF1'
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
#     print(jsonify({"error": str(e)}), 500)

if __name__ == '__main__':
    app.run(debug=True)
