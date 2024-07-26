from google.cloud import firestore
from google.oauth2 import service_account

# Use service account key from Cloud IAM to authenticate
credentials = service_account.Credentials.from_service_account_file(
    "../../auth/leaf-f184f-firebase-adminsdk-2nh8n-470e3b79de.json"
)

# Connect to firestore with credentials
firestore_db = firestore.Client(credentials=credentials)

# Get a reference to Workers collection
workers_ref = firestore_db.collection('workers')

# Get all documents from collection
worker_docs = workers_ref.stream()

# Print all documents
for doc in worker_docs:
    print(f'{doc.id} => {doc.to_dict()}')
