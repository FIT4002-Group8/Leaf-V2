import csv

class CSVExporter:
    def __init__(self, postgres_client):
        self.postgres_client = postgres_client

    def export_to_csv(self, table_name, csv_file_path):
        # Fetch data from the Postgres table
        data = self.postgres_client.fetch_data(table_name)

        if not data:
            print(f"No data found in {table_name}. CSV file not created.")
            return

        # Write data to CSV
        try:
            with open(csv_file_path, mode='w', newline='') as file:
                writer = csv.DictWriter(file, fieldnames=data[0].keys())
                writer.writeheader()
                writer.writerows(data)
                print(f"Data from {table_name} exported successfully to {csv_file_path}")
        except Exception as e:
            raise Exception(f"Error writing data to CSV: {e}")
