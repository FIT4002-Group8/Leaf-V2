import unittest
from unittest.mock import patch, MagicMock
from src.clients.PostgresClient import PostgresClient


class TestPostgresClient(unittest.TestCase):

        # Mock constructor variables for the client
        @patch('src.clients.PostgresClient.psycopg2.connect')
        def setUp(self, MockPsycopg2):
            self.mock_connection = MockPsycopg2.return_value
            self.target = PostgresClient('test_db', 'test_user', 'test_password')

        def test_connect(self):
            # Call method
            self.target.connect()

            # Verify results are correct
            self.mock_connection.connect.assert_called_once_with(
                dbname='test_db',
                user='test_user',
                password='test_password',
                host='localhost',
                port=5432
            )

        def test_close(self):
            # Call method
            self.target.close()

            # Verify results are correct
            self.mock_connection.close.assert_called_once()

        def test_reset_etl_tables(self):
            # Mock the connection and cursor
            mock_cursor = MagicMock()
            self.mock_connection.cursor.return_value = mock_cursor

            # Call method
            self.target.reset_etl_tables()

            # Verify results are correct
            self.mock_connection.cursor.assert_called_once()
            mock_cursor.execute.assert_called_once_with('TRUNCATE provider, patient, triage_case, events;')

        def test_insert_providers(self):
            # Mock the connection and cursor
            mock_cursor = MagicMock()
            self.mock_connection.cursor.return_value = mock_cursor

            # Call method
            self.target.insert_providers([{'id': '1', 'firstName': 'John', 'lastName': 'Doe', 'email': '