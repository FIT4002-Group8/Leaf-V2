import employeeID from "../employee/EmployeeID";

export interface FileFilters {
    from_date?: Date | null;
    to_date?: Date | null;
    assigned_to?: string | employeeID;
    hospital_site?: string;
    medical_unit?: string;
    sex?: string;
    triage_code?: [];
    ward?: string;
}