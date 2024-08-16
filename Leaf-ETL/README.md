## Leaf ETL Processor
Run the following command from the root directory to run the Leaf-ETL app

python3 -m flask --app src/Application.py run

## Running Test Cases
Run the test_runner.py file in your IDE

OR

From the Leaf-ETL root directory run the following commands
- export PYTHONPATH=$(pwd)
- pytest

To generate a HTML report describing test results, use the following command instead

- pytest --html=report.html

Ensure test cases are named test_ and relative imports are used so that the test_runner can pick up the files


## OMOP Requirements
To run the Postgres database, you need to download the OMOP vocabularies from Athena. The instructions are as follows:

1. Go to Athena https://athena.ohdsi.org/
2. Create an account
3. Go to downloads
4. Download the default bundle
5. Extract it and move the CONCEPTS.csv class in to Leaf-ETL/postgres/vocabularies
6. Run the start_database.sh script to copy the csv file in to Postgres