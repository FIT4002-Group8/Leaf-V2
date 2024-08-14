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
