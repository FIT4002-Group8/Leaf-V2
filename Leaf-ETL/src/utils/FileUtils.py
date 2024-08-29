import shutil


def createZippedOmopReport(directory):
    shutil.make_archive(directory, 'zip', './' + directory)


def convertOmopTablesToCsv(db, report_name):
    db.connect()

    # Convert OMOP tables into CSV's
    db.read_table_into_csv('omop_person', f'./{report_name}/')
    db.read_table_into_csv('omop_location', f'./{report_name}/')
    db.read_table_into_csv('omop_care_site', f'./{report_name}/')
    db.read_table_into_csv('omop_provider', f'./{report_name}/')
    db.read_table_into_csv('omop_observation_period', f'./{report_name}/')
    db.read_table_into_csv('omop_drug_exposure', f'./{report_name}/')
    db.read_table_into_csv('omop_device_exposure', f'./{report_name}/')
    db.read_table_into_csv('omop_visit_occurrence', f'./{report_name}/')
    db.read_table_into_csv('omop_condition_occurrence', f'./{report_name}/')
    db.read_table_into_csv('omop_procedure_occurrence', f'./{report_name}/')
    db.read_table_into_csv('omop_measurement', f'./{report_name}/')
    db.read_table_into_csv('omop_observation', f'./{report_name}/')
    db.read_table_into_csv('omop_episode', f'./{report_name}/')
    db.read_table_into_csv('omop_note', f'./{report_name}/')

    db.close()
