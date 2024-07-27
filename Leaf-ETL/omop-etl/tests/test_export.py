import unittest
from unittest.mock import patch, MagicMock
from export import authenticate_user, get_firestore_client, get_drive_service, save_file_id_to_firestore, upload_file_to_drive, download_file

class TestGoogleDriveFirestoreIntegration(unittest.TestCase):

    @patch('export.google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file')
    def test_authenticate_user(self, mock_from_client_secrets_file):
        mock_flow = MagicMock()
        mock_from_client_secrets_file.return_value = mock_flow
        mock_creds = MagicMock()
        mock_flow.run_local_server.return_value = mock_creds

        creds = authenticate_user()

        mock_from_client_secrets_file.assert_called_once()
        mock_flow.run_local_server.assert_called_once()
        self.assertEqual(creds, mock_creds)

    @patch('export.firestore.Client')
    def test_get_firestore_client(self, mock_firestore_client):
        mock_creds = MagicMock()
        mock_client = MagicMock()
        mock_firestore_client.return_value = mock_client

        client = get_firestore_client(mock_creds)

        mock_firestore_client.assert_called_once_with(project=mock_creds.project_id, credentials=mock_creds)
        self.assertEqual(client, mock_client)

    @patch('export.build')
    def test_get_drive_service(self, mock_build):
        mock_creds = MagicMock()
        mock_service = MagicMock()
        mock_build.return_value = mock_service

        service = get_drive_service(mock_creds)

        mock_build.assert_called_once_with('drive', 'v3', credentials=mock_creds)
        self.assertEqual(service, mock_service)

    @patch('export.firestore.Client')
    def test_save_file_id_to_firestore(self, mock_firestore_client):
        mock_db = MagicMock()
        mock_doc_ref = MagicMock()
        mock_firestore_client.return_value.collection.return_value.document.return_value = mock_doc_ref

        save_file_id_to_firestore('test_file_id', mock_db)

        mock_firestore_client.return_value.collection.assert_called_once_with('files')
        mock_firestore_client.return_value.collection.return_value.document.assert_called_once_with('test_file_id')
        mock_doc_ref.set.assert_called_once_with({'file_id': 'test_file_id'})

    @patch('export.MediaFileUpload')
    @patch('export.get_drive_service')
    def test_upload_file_to_drive(self, mock_get_drive_service, mock_media_file_upload):
        mock_drive_service = MagicMock()
        mock_get_drive_service.return_value = mock_drive_service
        mock_request = MagicMock()
        mock_drive_service.files.return_value.create.return_value = mock_request
        mock_request.next_chunk.side_effect = [(MagicMock(progress=0.5), None), (MagicMock(progress=1.0), {})]

        file_id = upload_file_to_drive('C:/Users/lukew/Desktop/upload_me.txt', mock_drive_service)

        mock_media_file_upload.assert_called_once_with('C:/Users/lukew/Desktop/upload_me.txt', resumable=True)
        mock_drive_service.files.return_value.create.assert_called_once()
        self.assertEqual(file_id, {})

    @patch('export.MediaIoBaseDownload')
    @patch('export.open')
    @patch('export.get_drive_service')
    def test_download_file(self, mock_get_drive_service, mock_open, mock_media_io_base_download):
        mock_drive_service = MagicMock()
        mock_get_drive_service.return_value = mock_drive_service
        mock_request = MagicMock()
        mock_drive_service.files.return_value.get_media.return_value = mock_request
        mock_open.return_value.__enter__.return_value = MagicMock()
        mock_downloader = MagicMock()
        mock_media_io_base_download.return_value = mock_downloader
        mock_downloader.next_chunk.side_effect = [(MagicMock(progress=0.5), False), (MagicMock(progress=1.0), True)]

        download_file('test_file_id', mock_drive_service)

        mock_drive_service.files.return_value.get_media.assert_called_once_with(fileId='test_file_id')
        mock_open.assert_called_once_with('C:/Users/lukew/Desktop/downloaded_test_file_id.txt', 'wb')
        mock_media_io_base_download.assert_called_once()
        mock_downloader.next_chunk.assert_called()

if __name__ == '__main__':
    unittest.main()
