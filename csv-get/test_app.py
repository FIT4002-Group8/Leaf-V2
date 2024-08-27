import os
import unittest
from csv_getter import app


class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_download_zip(self):
        file_id = '1TdbeTZ4gXDFXqt-OURqYKh11ZKs4MgF1'
        response = self.app.get('/download-zip', query_string={'file_id': file_id})

        # Check that the request was successful
        self.assertEqual(response.status_code, 200, f"Expected status code 200 but got {response.status_code}")

        # Save the response content to a file
        zip_file_path = 'downloaded_protected_file.zip'
        with open(zip_file_path, 'wb') as f:
            f.write(response.data)

        # Verify the file was created
        self.assertTrue(os.path.exists(zip_file_path), f"ZIP file {zip_file_path} was not created")

        # Clean up the test file
        if os.path.exists(zip_file_path):
            os.remove(zip_file_path)

    def tearDown(self):
        pass


if __name__ == '__main__':
    unittest.main()
