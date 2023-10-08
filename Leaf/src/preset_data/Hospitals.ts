import Hospital from "../model/hospital/Hospital";
import Ward from "../model/hospital/Ward";
import MedicalUnit from "../model/hospital/MedicalUnit";


const hospitalA = new Hospital("H1", "STA", "St Care A");
// add hospital A wards
hospitalA.addWard(new Ward("W1", "STA", "EMER STA"));
hospitalA.addWard(new Ward("W2", "STA", "SSU STA"));
hospitalA.addWard(new Ward("W3", "STA", "CDU STA"));
hospitalA.addWard(new Ward("W4", "STA", "2E STA"));
hospitalA.addWard(new Ward("W5", "STA", "SSUP STA"));
hospitalA.addWard(new Ward("W6", "STA", "1 WEST STA"));
hospitalA.addWard(new Ward("W7", "STA", "CDUP STA"));
hospitalA.addWard(new Ward("W8", "STA", "4E STA"));
hospitalA.addWard(new Ward("W9", "STA", "2 WEST STA"));
hospitalA.addWard(new Ward("W10", "STA", "1 NORTH STA"));
hospitalA.addWard(new Ward("W11", "STA", "TL STA"));
hospitalA.addWard(new Ward("W12", "STA", "3E STA"));
// add hospital A medical units
hospitalA.addMedUnit(new MedicalUnit("M1", "Gynaecology STA", "Women & Children"));
hospitalA.addMedUnit(new MedicalUnit("M2", "Obstetrics STA", "Women & Children"));
hospitalA.addMedUnit(new MedicalUnit("M3", "Acute Care OP STA", "Emergency and General Medicine"));
hospitalA.addMedUnit(new MedicalUnit("M4", "Clinical Decision Unit STA", "Emergency and General Medicine"));
hospitalA.addMedUnit(new MedicalUnit("M5", "Acute Medical A1 STA", "Emergency and General Medicine"));
hospitalA.addMedUnit(new MedicalUnit("M6", "Paediatrics STA", "Women & Children"));
hospitalA.addMedUnit(new MedicalUnit("M7", "Short Stay Unit STA", "Emergency and General Medicine"));
hospitalA.addMedUnit(new MedicalUnit("M8", "Gen Surg STA", "Surgery"));
hospitalA.addMedUnit(new MedicalUnit("M9", "GEM 1W STA", "Continuing Care"));

const hospitalB = new Hospital("H2", "STB", "St Care B");
// add hospital B wards
hospitalB.addWard(new Ward("W1", "STB", "Emergency STB"));
hospitalB.addWard(new Ward("W2", "STB", "4.1 STB"));
hospitalB.addWard(new Ward("W3", "STB", "ADOL IPU STB"));
hospitalB.addWard(new Ward("W4", "STB", "3.4 STB"));
hospitalB.addWard(new Ward("W5", "STB", "2.2 STB"));
hospitalB.addWard(new Ward("W6", "STB", "3.1 STB"));
hospitalB.addWard(new Ward("W7", "STB", "9.2 STB"));
hospitalB.addWard(new Ward("W8", "STB", "8.1 STB"));
hospitalB.addWard(new Ward("W9", "STB", "6.2 STB"));
hospitalB.addWard(new Ward("W10", "STB", "7.1 STB"));
hospitalB.addWard(new Ward("W11", "STB", "2.1 STB"));
hospitalB.addWard(new Ward("W12", "STB", "5.1 STB"));
hospitalB.addWard(new Ward("W13", "STB", "7.2 STB"));
hospitalB.addWard(new Ward("W14", "STB", "CDU STB"));
hospitalB.addWard(new Ward("W15", "STB", "6.1 STB"));
hospitalB.addWard(new Ward("W16", "STB", "SSU STB"));
hospitalB.addWard(new Ward("W17", "STB", "9.1 STB"));
hospitalB.addWard(new Ward("W18", "STB", "5.3 STB"));
hospitalB.addWard(new Ward("W19", "STB", "8.2 STB"));
hospitalB.addWard(new Ward("W20", "STB", "UPT HOUSE STB"));
hospitalB.addWard(new Ward("W21", "STB", "3.3 STB"));
hospitalB.addWard(new Ward("W22", "STB", "HITH STB"));
hospitalB.addWard(new Ward("W23", "STB", "Surg Admit STB"));
hospitalB.addWard(new Ward("W24", "STB", "5.2 STB"));
hospitalB.addWard(new Ward("W25", "STB", "Emergency Admissions STB"));
hospitalB.addWard(new Ward("W26", "STB", "2.3 STB"));
hospitalB.addWard(new Ward("W27", "STB", "4.3 STB"));

// add hospital B medical units
hospitalB.addMedUnit(new MedicalUnit("M1", "Short Stay Unit MA STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M2", "Renal Dialysis PJ STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M3", "Haemostasis - Thrombosis STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M4", "Rheumatology STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M5", "Maternity STB", "Women & Children"));
hospitalB.addMedUnit(new MedicalUnit("M6", "Oncology STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M7", "COVID1 suspected STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M8", "ENT STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M9", "Clinical Decision Unit STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M10", "Psych - Adult STB", "Mental Health/Turning Point/Alcohol&Drug"));
hospitalB.addMedUnit(new MedicalUnit("M11", "Orthopaedic Surgery 2 STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M12", "Neurology STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M13", "COVID - HIT STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M14", "COVID1 confirmed STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M15", "CV-Acute Medical 1 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M16", "Thoracic Surgery STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M17", "Short Stay Unit STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M18", "HIT STB", "Continuing Care"));
hospitalB.addMedUnit(new MedicalUnit("M19", "Paediatric Surgery STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M20", "Orthopaedic Surgery 1 STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M21", "Gen Surg A STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M22", "Gen Surg D STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M23", "Obs & Gynae STB", "Women & Children"));
hospitalB.addMedUnit(new MedicalUnit("M24", "Psych - Adult Upton House STB", "Mental Health/Turning Point/Alcohol&Drug"));
hospitalB.addMedUnit(new MedicalUnit("M25", "Endocrinology STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M26", "Haemostasis/Thromb/Lymphoma STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M27", "Vascular Surgery STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M28", "Plastic Surgery STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M29", "Urology STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M30", "Adolescent IPU STB", "Mental Health/Turning Point/Alcohol&Drug"));
hospitalB.addMedUnit(new MedicalUnit("M31", "Acute Medical B2 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M32", "Renal STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M33", "Respiratory STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M34", "Gastroenterology STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M35", "Acute Medical B1 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M36", "Gen Surg C STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M37", "Gen Surg B STB", "Surgery"));
hospitalB.addMedUnit(new MedicalUnit("M38", "Oncology 4.1 STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M39", "Haematology STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M40", "Paediatrics STB", "Women & Children"));
hospitalB.addMedUnit(new MedicalUnit("M41", "Oncology 5.1 STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M42", "Stroke STB", "Speciality Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M43", "Acute Medical B3 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit(new MedicalUnit("M44", "Cardiology STB", "Speciality Medicine"));

export const HospitalArray = [hospitalA, hospitalB];

export const Hospitals = HospitalArray.reduce(
    (accumulator, hospital) => {
        accumulator[hospital.id] = hospital;
        return accumulator;
    },
    {} as Record<string, Hospital>,
);