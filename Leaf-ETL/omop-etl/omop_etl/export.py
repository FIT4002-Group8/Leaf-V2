import google_auth_oauthlib.flow
from google.cloud import firestore
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload



client_secrets_file = 'credentials.json'

# Set the scopes for Google Drive and Firestore
SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/datastore']

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


# Download the file from Google Drive
def download_file(file_id, drive_service):
    request = drive_service.files().get_media(fileId=file_id)
    # Save the file to the local disk
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
    # read the file ID from the file
    file_id_path = 'C:/Users/lukew/Desktop/file_id.txt'
    with open(file_id_path, 'r') as file:
        file_id = file.read().strip()

    # Authenticate the user
    credentials = authenticate_user()

    # Get Firestore client
    db = get_firestore_client(credentials)

    # save the file ID to Firestore
    save_file_id_to_firestore(file_id, db)

    # Get the Google Drive service
    drive_service = get_drive_service(credentials)

    # Download the file
    download_file(file_id, drive_service)

if __name__ == '__main__':
    main()
