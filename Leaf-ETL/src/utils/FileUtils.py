import shutil


def createZippedOmopReport(directory):
    shutil.make_archive(directory, 'zip', './' + directory)


def convertOmopTablesToCsv(db):
    db.connect()

    # Convert OMOP tables into CSV's
    db.read_table_into_csv('omop_person', './omop-report/')
    db.read_table_into_csv('omop_location', './omop-report/')
    db.read_table_into_csv('omop_care_site', './omop-report/')
    db.read_table_into_csv('omop_provider', './omop-report/')
    db.read_table_into_csv('omop_observation_period', './omop-report/')
    db.read_table_into_csv('omop_drug_exposure', './omop-report/')
    db.read_table_into_csv('omop_device_exposure', './omop-report/')
    db.read_table_into_csv('omop_visit_occurrence', './omop-report/')
    db.read_table_into_csv('omop_condition_occurrence', './omop-report/')
    db.read_table_into_csv('omop_procedure_occurrence', './omop-report/')
    db.read_table_into_csv('omop_measurement', './omop-report/')
    db.read_table_into_csv('omop_observation', './omop-report/')
    db.read_table_into_csv('omop_episode', './omop-report/')
    db.read_table_into_csv('omop_note', './omop-report/')

    db.close()
