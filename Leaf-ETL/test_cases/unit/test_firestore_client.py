import unittest
from unittest.mock import patch, MagicMock
from src.clients.FirestoreClient import FirestoreClient


class TestFirestoreClient(unittest.TestCase):

    # Mock constructor variables for the client
    @patch('src.clients.FirestoreClient.firestore.Client')
    @patch('src.clients.FirestoreClient.service_account.Credentials')
    def setUp(self, MockCredentials, MockFirestoreClient):
        self.mock_credentials = MockCredentials.from_service_account_file.return_value
        self.mock_firestore_client = MockFirestoreClient.return_value

        self.target = FirestoreClient('fake_credentials_file.json')

    def test_get_all_documents(self):
        # Mock the collection and document retrieved from Firestore
        mock_collection_ref = MagicMock()
        mock_document = MagicMock()
        mock_document.to_dict.return_value = {'field': 'value'}
        mock_collection_ref.stream.return_value = [mock_document]
        self.target.client.collection.return_value = mock_collection_ref

        # Call method
        result = self.target.get_all_documents('test_collection')

        # Verify results are correct
        self.target.client.collection.assert_called_once_with('test_collection')
        mock_collection_ref.stream.assert_called_once()
        self.assertEqual(result, [{'field': 'value'}])
