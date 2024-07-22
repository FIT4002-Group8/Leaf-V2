from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

# Initialize GoogleAuth object and load settings.yaml
gauth = GoogleAuth()
gauth.LoadSettingsFile("settings.yaml")
gauth.LocalWebserverAuth()

# Create GoogleDrive object
drive = GoogleDrive(gauth)

# Upload a file
file1 = drive.CreateFile({'title': 'Hello.txt'})
file1.SetContentString('Hello World!')
file1.Upload()
print('Uploaded file %s with mimeType %s' % (file1['title'], file1['mimeType']))

# List files
file_list = drive.ListFile({'q': "'root' in parents and trashed=false"}).GetList()
for file1 in file_list:
    print('Title: %s, ID: %s' % (file1['title'], file1['id']))

# Download a file
for file1 in file_list:
    if file1['title'] == 'Hello.txt':
        file1.GetContentFile('Hello_Downloaded.txt')
        print('Downloaded file %s from Google Drive' % file1['title'])
