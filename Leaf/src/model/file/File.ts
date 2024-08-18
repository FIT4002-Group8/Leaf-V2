import employeeID from "../employee/EmployeeID";

type Filters = {
    assigned_to?: string | employeeID;
    hospital_site?: string;
    medical_unit?: string;
    sex?: string;
    triage_code?: string[];
    ward?: string;
};


class File {
    public id: string;
    protected _title: string;
    protected _author: string;
    protected _reportType: string;
    protected _password: string;
    protected _created: Date;
    protected _filters: Filters = {};

    public get title(): string {
        return this._title;
    }

    public get author(): string {
        return this._author;
    }

    public get reportType(): string {
        return this._reportType;
    }

    public get password(): string {
        return this._password;
    }

    public get created(): Date {
        return this._created;
    }

    public get filters(): Filters {
        return this._filters;
    }

    public get fileDetails(): string {
        return `Title: ${this.title}, Author: ${this.author}, Report Type: ${this.reportType}, Created: ${this.created.toISOString()}`;
    }

    constructor(
        id: string,
        title: string,
        author: string,
        reportType: string,
        password: string,
        created: Date,
        filters: Filters
    ) {
        this.id = id;
        this._title = title;
        this._author = author;
        this._reportType = reportType;
        this._password = password;
        this._created = created;
        this._filters = filters;
    }

    public setTitle(title: string) {
        this._title = title;
    }

    public setAuthor(author: string) {
        this._author = author;
    }

    public setReportType(reportType: string) {
        this._reportType = reportType;
    }

    public setCreated(created: Date) {
        this._created = created;
    }

    public setPassword(password: string) {
        this._password = password;
    }

    public setFilters(filters: Filters) {
        this._filters = filters;
    }
}

export default File;
