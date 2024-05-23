import unittest
from unittest.mock import patch, MagicMock
import os


class TestExportReportToGCS(unittest.TestCase):

    @patch('google.cloud.storage.Client')
    def test_export_report_to_gcs(self, MockStorageClient):
        # Arrange
        bucket_name = "test-bucket"
        source_file_path = "test_file.csv"
        destination_blob_name = "reports/test_report.csv"

        # Mock the storage client
        mock_client = MockStorageClient.return_value
        mock_bucket = mock_client.bucket.return_value
        mock_blob = mock_bucket.blob.return_value
        mock_blob.public_url = "http://example.com/test_report.csv"

        # Act
        from omop_etl.export import export_report_to_gcs
        public_url = export_report_to_gcs(bucket_name, source_file_path, destination_blob_name)

        # Assert
        mock_client.bucket.assert_called_with(bucket_name)
        mock_bucket.blob.assert_called_with(destination_blob_name)
        mock_blob.upload_from_filename.assert_called_with(source_file_path)
        self.assertEqual(public_url, "http://example.com/test_report.csv")


if __name__ == "__main__":
    unittest.main()
