import * as FileSystem from "expo-file-system";
import {shareAsync} from "expo-sharing";
import Patient from "../model/patient/Patient";
import Environment from "../state/environment/Environment";
import {OS} from "../state/environment/types/OS";
import axios from "axios";

/**
 * Exports a list of selected patients into a CSV file format.
 *
 * @function
 * @async
 * @param {Patient[]} selectedPatients - An array of patients to be exported.
 *
 * @description
 * The function generates a CSV file with the following headers:
 * "MRN,DOB,FirstName,LastName,Gender,PhoneNumber,PostCode,TimeLastAllocated,AllocatedTo,Events".
 * The file name is generated based on the current date and time, sanitized to replace white spaces,
 * commas, colons, and slashes with underscores.
 *
 * Depending on the operating system, the function handles the file export differently:
 * 1. Android: Requests directory permissions and creates a file in the granted directory.
 * 2. iOS: Writes the CSV data directly into the file system and then shares the file.
 * 3. Web: Creates a blob and uses it to create an anchor element, which when clicked, downloads the CSV file.
 */
// Define the URL of your Flask backend endpoint
const FLASK_BACKEND_URL = 'http://127.0.0.1:5000/upload';

export const exportPatient = async (selectedPatients: Patient[], title: string) => {
    if (selectedPatients.length === 0) {
        return;
    }
    const date = new Date();
    const dateString = date.toLocaleString();
    const regex = /[,\s:\/]/g;
    const sanitizedDatestring = dateString.replace(regex, "_");

    const filename = `${title}.csv`;
    let csvData = "MRN,DOB,FirstName,LastName,Gender,PhoneNumber,PostCode,TimeLastAllocated,AllocatedTo,Events\n";
    for (const patient of selectedPatients) {
        let allEvents = "";
        for (const event of patient.events) {
            allEvents += `[${event.getExportSummary()}]`;
        }
        csvData += `${patient.mrn},${patient.dob},${patient.firstName},${patient.lastName},${patient.sex},${patient.phoneNumber},${patient.postCode},${patient.timeLastAllocated},${patient.idAllocatedTo},${allEvents}\n`;
    }

    try {
        // Create a FormData object to send the CSV file
        const formData = new FormData();
        formData.append('file', new Blob([csvData], {type: 'text/csv'}), filename);

        // Send the FormData object to the Flask backend
        const response = await axios.post(FLASK_BACKEND_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('File uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading file to backend:', error);
    }
}