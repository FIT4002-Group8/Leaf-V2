import unittest
from unittest.mock import patch, MagicMock
from flask import Flask, json
from src.controllers.EtlController import EtlController
from src.exceptions.DatabaseError import DatabaseError
from src.Application import create_app
import io


class TestApplication(unittest.TestCase):

    @patch('src.controllers.EtlController.EtlController')
    def setUp(self, MockEtlController):
        self.mock_etl_controller = MockEtlController.return_value
        self.app = create_app({'TESTING': True})
        self.client = self.app.test_client()

    def test_trigger_success(self):
        self.mock_etl_controller.trigger_process.return_value = 'fake_file_id'
        response = self.client.get('/trigger?title=test_report', data={'password': 'test_password'})
        data = json.loads(response.data)

    def test_trigger_database_error(self):
        self.mock_etl_controller.trigger_process.side_effect = DatabaseError('Database error')
        response = self.client.get('/trigger?title=test_report', data={'password': 'test_password'})
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], 'Error while accessing database')

    def test_upload_file_success(self):
        self.mock_etl_controller.upload.return_value = 'fake_file_id'
        data = {
            'file': (io.BytesIO(b"fake file content"), 'test_file.txt'),
            'password': 'test_password'
        }
        response = self.client.post('/upload', data=data, content_type='multipart/form-data')
        response_data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)

    def test_upload_file_no_file(self):
        response = self.client.post('/upload', data={'password': 'test_password'}, content_type='multipart/form-data')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], 'No file part in the request')

    def test_upload_file_no_password(self):
        data = {
            'file': (io.BytesIO(b"fake file content"), 'test_file.txt')
        }
        response = self.client.post('/upload', data=data, content_type='multipart/form-data')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], 'No password provided')

    def test_download_success(self):
        self.mock_etl_controller.gdrive_client.quickDownload.return_value = io.BytesIO(b"fake file content")
        response = self.client.get('/download?file_title=test_file&report_type=Quick Report&file_id=fake_file_id')

        self.assertEqual(response.mimetype, 'application/json')

    def test_download_error(self):
        self.mock_etl_controller.gdrive_client.quickDownload.side_effect = Exception('Download error')
        response = self.client.get('/download?file_title=test_file&report_type=Quick Report&file_id=fake_file_id')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], 'Error while downloading report from Google Drive')
