import unittest
from src.exceptions.DatabaseError import DatabaseError


class TestDatabaseError(unittest.TestCase):

    def test_database_error_without_original_error(self):
        error_message = "Test error message"
        error = DatabaseError(error_message)

        self.assertEqual(str(error), error_message)
        self.assertEqual(error.message, error_message)
        self.assertIsNone(error.original_error)

    def test_database_error_with_original_error(self):
        error_message = "Test error message"
        original_exception = Exception("Original exception message")
        error = DatabaseError(error_message, original_exception)

        expected_message = f"{error_message} (Original exception: {original_exception})"
        self.assertEqual(str(error), expected_message)
        self.assertEqual(error.message, error_message)
        self.assertEqual(error.original_error, original_exception)
