import unittest
from unittest.mock import patch, MagicMock, mock_open
import os
import pyzipper
from src.utils import FileUtils


class TestFileUtils(unittest.TestCase):

    @patch('os.walk')
    @patch('pyzipper.AESZipFile')
    def test_createZippedOmopReport(self, MockAESZipFile, mock_os_walk):
        mock_zip_file = MockAESZipFile.return_value
        mock_os_walk.return_value = [
            ('./test_directory', ['folder1'], ['file1.txt', 'file2.txt']),
            ('./test_directory/folder1', [], ['file3.txt'])
        ]

        FileUtils.createZippedOmopReport('test_directory', 'test_password')

        MockAESZipFile.assert_called_once_with('test_directory.zip', 'w', compression=pyzipper.ZIP_DEFLATED, encryption=pyzipper.WZ_AES)
        mock_zip_file.pwd = 'test_password'
        mock_zip_file.write.assert_any_call('./test_directory/file1.txt', './test_directory/file1.txt')
        mock_zip_file.write.assert_any_call('./test_directory/file2.txt', './test_directory/file2.txt')
        mock_zip_file.close.assert_called_once()

    @patch('src.clients.PostgresClient')
    def test_convertOmopTablesToCsv(self, MockPostgresClient):
        mock_db = MockPostgresClient.return_value

        FileUtils.convertOmopTablesToCsv(mock_db, 'test_report')

        mock_db.connect.assert_called_once()
        tables = [
            'omop_person', 'omop_location', 'omop_care_site', 'omop_provider', 'omop_observation_period',
            'omop_drug_exposure', 'omop_device_exposure', 'omop_visit_occurrence', 'omop_condition_occurrence',
            'omop_procedure_occurrence', 'omop_measurement', 'omop_observation', 'omop_episode', 'omop_note'
        ]
        for table in tables:
            mock_db.read_table_into_csv.assert_any_call(table, f'./test_report/')
        mock_db.close.assert_called_once()
