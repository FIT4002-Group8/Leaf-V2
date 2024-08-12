## Leaf ETL Processor
Run the following command from the root directory to run the Leaf-ETL app

python3 -m flask --app src/Application.py run

## OMOP Requirements
To run the Postgres database, you need to download the OMOP vocabularies from Athena. The instructions are as follows:

1. Go to Athena https://athena.ohdsi.org/
2. Create an account
3. Go to downloads
4. Download the default bundle
5. Extract it and move the CONCEPTS.csv class in to Leaf-ETL/postgres/vocabularies
6. Run the start_database.sh script to copy the csv file in to Postgres