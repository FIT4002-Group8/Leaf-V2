import os
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import pyzipper
import tempfile

# Step 1: Authenticate
gauth = GoogleAuth()

# Load the client configuration from the downloaded `credentials.json` file
gauth.LoadClientConfigFile("client_secret.json")

# Load saved client credentials
gauth.LoadCredentialsFile("mycreds.txt")

if gauth.credentials is None:
    # Authenticate if credentials are not present
    gauth.LocalWebserverAuth()  # This will create a local webserver and auto-authenticate
elif gauth.access_token_expired:
    # Refresh if the access token has expired
    gauth.Refresh()
else:
    # Authorize if everything is fine
    gauth.Authorize()

# Save the current credentials for future use
gauth.SaveCredentialsFile("mycreds.txt")

drive = GoogleDrive(gauth)

file_id = '1TdbeTZ4gXDFXqt-OURqYKh11ZKs4MgF1'
csv_file_name = 'downloaded_file.csv'

# Determine the Downloads directory
if os.name == 'nt':  # For Windows
    downloads_dir = os.path.join(os.environ['USERPROFILE'], 'Downloads')
else:  # For macOS and Linux
    downloads_dir = os.path.join(os.path.expanduser('~'), 'Downloads')

# Create a temporary file path for the CSV file
temp_csv_path = os.path.join(tempfile.gettempdir(), csv_file_name)

# Create a file instance and download the content
downloaded_file = drive.CreateFile({'id': file_id})
downloaded_file.GetContentFile(temp_csv_path)

print(f"File {csv_file_name} downloaded successfully to {temp_csv_path}")

# Add password protection
zip_file_name = 'protected_file.zip'
zip_file_path = os.path.join(downloads_dir, zip_file_name)
password = 'password'

# Compress the CSV file into a password-protected ZIP file
with pyzipper.AESZipFile(zip_file_path, 'w', compression=pyzipper.ZIP_DEFLATED, encryption=pyzipper.WZ_AES) as zf:
    zf.setpassword(password.encode())
    zf.write(temp_csv_path, csv_file_name)

print(f"File {csv_file_name} compressed into {zip_file_name} with password protection")

# Clean up the temporary CSV file
os.remove(temp_csv_path)
