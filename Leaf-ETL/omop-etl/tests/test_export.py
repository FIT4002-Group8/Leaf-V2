# test_drive_operations.py
import unittest
from unittest.mock import patch, MagicMock
import drive_operations

class TestDriveOperations(unittest.TestCase):
    @patch('drive_operations.GoogleAuth')
    @patch('drive_operations.GoogleDrive')
    def setUp(self, MockGoogleDrive, MockGoogleAuth):
        # Mock authentication and Google Drive object
        self.mock_auth = MockGoogleAuth.return_value
        self.mock_drive = MockGoogleDrive.return_value
        self.drive = drive_operations.authenticate()

    def test_upload_file(self):
        # Mock file upload
        mock_file = MagicMock()
        mock_file.Upload.return_value = None
        mock_file.__getitem__.return_value = 'mock_file_id'
        self.mock_drive.CreateFile.return_value = mock_file

        # Call the function
        file_id = drive_operations.upload_file(self.drive, 'Hello.txt', 'Hello World!')

        # Assertions
        self.assertEqual(file_id, 'mock_file_id')
        self.mock_drive.CreateFile.assert_called_with({'title': 'Hello.txt'})
        mock_file.SetContentString.assert_called_with('Hello World!')
        mock_file.Upload.assert_called_once()

    def test_list_files(self):
        # Mock file listing
        mock_file1 = {'title': 'File1', 'id': 'id1'}
        mock_file2 = {'title': 'File2', 'id': 'id2'}
        self.mock_drive.ListFile.return_value.GetList.return_value = [mock_file1, mock_file2]

        # Call the function
        files = drive_operations.list_files(self.drive)

        # Assertions
        self.assertEqual(files, [('File1', 'id1'), ('File2', 'id2')])
        self.mock_drive.ListFile.assert_called_with({'q': "'root' in parents and trashed=false"})
        self.mock_drive.ListFile.return_value.GetList.assert_called_once()

    def test_download_file(self):
        # Mock file download
        mock_file = MagicMock()
        self.mock_drive.CreateFile.return_value = mock_file

        # Call the function
        downloaded_file = drive_operations.download_file(self.drive, 'mock_file_id', 'Hello_Downloaded.txt')

        # Assertions
        self.assertEqual(downloaded_file, 'Hello_Downloaded.txt')
        self.mock_drive.CreateFile.assert_called_with({'id': 'mock_file_id'})
        mock_file.GetContentFile.assert_called_with('Hello_Downloaded.txt')

if __name__ == '__main__':
    unittest.main()
