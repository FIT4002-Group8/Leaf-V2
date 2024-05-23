from google.cloud import storage


def export_report_to_gcs(bucket_name, source_file_path, destination_blob_name):
    """
    Exports a file to Google Cloud Storage.

    Args:
    - bucket_name (str): Name of the target GCS bucket.
    - source_file_path (str): Path to the local file to be uploaded.
    - destination_blob_name (str): The name of the destination blob in GCS.

    Returns:
    - str: URL of the uploaded file.
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_path)
    blob.make_public()  # Optional: Make the blob publicly accessible
    return blob.public_url


if __name__ == "__main__":
    bucket_name = "your-gcs-bucket-name"
    source_file_path = "path/to/your/local/file.csv"
    destination_blob_name = "reports/omop_report.csv"
    public_url = export_report_to_gcs(bucket_name, source_file_path, destination_blob_name)
    print(f"Report uploaded to: {public_url}")
