import google_auth_oauthlib.flow
from google.cloud import firestore
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload

# add Chris' credentials.json
client_secrets_file = 'credentials.json'

# Set the scopes for Google Drive and Firestore
SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/datastore']

# Set the project ID
def get_firestore_client(credentials):
    return firestore.Client(project=credentials.project_id, credentials=credentials)


# Get the Google Drive service
def get_drive_service(credentials):
    return build('drive', 'v3', credentials=credentials)


# Request user authentication
def authenticate_user():
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(client_secrets_file, SCOPES)
    creds = flow.run_local_server(port=8080)
    return creds


# Save the file ID to Firestore
def save_file_id_to_firestore(file_id, db):
    doc_ref = db.collection('files').document(file_id)
    doc_ref.set({'file_id': file_id})
    print(f"File ID {file_id} saved to Firestore")


# Upload the file to Google Drive
def upload_file_to_drive(file_path, drive_service):
    file_metadata = {'name': file_path.split('/')[-1]}
    media = MediaFileUpload(file_path, resumable=True)
    request = drive_service.files().create(body=file_metadata, media_body=media, fields='id')
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Upload {int(status.progress() * 100)}%.")
    print(f"File {file_path} uploaded to Google Drive with file ID: {response.get('id')}")
    return response.get('id')


# Download the file from Google Drive
def download_file(file_id, drive_service):
    request = drive_service.files().get_media(fileId=file_id)
    file_path = f'C:/Users/lukew/Desktop/downloaded_{file_id}.txt'
    with open(file_path, 'wb') as file:
        downloader = MediaIoBaseDownload(file, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}%.")
    print(f"File {file_id} downloaded to {file_path}")


# Main function
def main():
    # Read the file ID from the file
    file_id_path = 'C:/Users/lukew/Desktop/file_id.txt'
    with open(file_id_path, 'r') as file:
        file_id = file.read().strip()

    # Authenticate the user
    credentials = authenticate_user()

    # Get Firestore client
    db = get_firestore_client(credentials)

    # Save the file ID to Firestore
    save_file_id_to_firestore(file_id, db)

    # Get the Google Drive service
    drive_service = get_drive_service(credentials)

    # Download the file
    download_file(file_id, drive_service)

    # Path of the file to upload
    upload_file_path = 'C:/Users/lukew/Desktop/upload_me.txt'
    uploaded_file_id = upload_file_to_drive(upload_file_path, drive_service)

    # Save the uploaded file ID to Firestore
    save_file_id_to_firestore(uploaded_file_id, db)

if __name__ == '__main__':
    main()
