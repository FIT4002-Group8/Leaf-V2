from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from datetime import datetime


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


def csv_post(author, report_type, filters, title):
    # Call ETL function
    # TODO - ETL function call goes here

    # Create File
    drive = authenticate_drive()
    file = drive.CreateFile()
    file.SetContentFile('test.csv')
    file.Upload()

    # Add file to Firestore Database
    file_id = file['id']
    print(f'File ID: {file_id}')


csv_post()
