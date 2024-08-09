from google.cloud import firestore
from google.oauth2 import service_account


class FirestoreClient:
    def __init__(self, credentials_file):
        self.credentials = service_account.Credentials.from_service_account_file(credentials_file)
        self.client = firestore.Client(credentials=self.credentials)

    def get_all_documents(self, collection_name):
        collection_ref = self.client.collection(collection_name)
        collection_docs = collection_ref.stream()

        # Read the stream into a list before returning to save db reads
        return [doc.to_dict() for doc in collection_docs]
