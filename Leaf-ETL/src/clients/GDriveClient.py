import io

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload, MediaIoBaseUpload


class GDriveClient:
    def __init__(self, client_secret):
        scope = ['https://www.googleapis.com/auth/drive']

        self.credentials = service_account.Credentials.from_service_account_file(
            filename=client_secret,
            scopes=scope
        )

        self.client = build('drive', 'v3', credentials=self.credentials)

    def downloadFile(self, file_name):
        # Call the Drive v3 API
        fileMetadata = self.client.files().list(fields="nextPageToken, files(id, name, mimeType, size, modifiedTime)",
                                                q="name = '" + file_name + "'").execute()

        print(file_name)
        print(fileMetadata)
        fileId = fileMetadata['files'][0]['id']

        downloadRequest = self.client.files().get_media(fileId=fileId)
        file = io.BytesIO()
        downloader = MediaIoBaseDownload(file, downloadRequest)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}.")

        file.seek(0)
        with open(file_name, 'wb') as f:
            f.write(file.getvalue())

        print(f"File {file_name} downloaded successfully.")

    def uploadFile(self, file_name):
        file_metadata = {"name": file_name, "parents": ['1BJ6mt9jOKF7fhK_s10l5nvi4OImzObAF']}
        media = MediaFileUpload(file_name, mimetype="text/csv")
        file = self.client.files().create(body=file_metadata, media_body=media, fields="id").execute()
        print(f'File ID: {file.get("id")}')
        return file.get("id")

    def quickUpload(self, file_stream, file_name):
        file_metadata = {"name": file_name, "parents": ['1BJ6mt9jOKF7fhK_s10l5nvi4OImzObAF']}
        media = MediaIoBaseUpload(file_stream, mimetype="application/zip")
        file = self.client.files().create(body=file_metadata, media_body=media, fields="id").execute()
        print(f'File ID: {file.get("id")}')
        return file.get("id")
