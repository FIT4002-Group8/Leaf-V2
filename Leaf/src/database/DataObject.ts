class DataObject {
    // The JSON this wrapper represents
    private json: { [key: string]: any } = {};

    // Public accessor to data
    public get data(): { [key: string]: any } {
        return this.json;
    }

    public get str(): string {
        return JSON.stringify(this.json);
    }

    constructor() {
    }

    public static fromJSON(json: { [key: string]: any }): DataObject {
        const dataObject = new DataObject();
        dataObject.json = json;
        return dataObject;
    }

    public addString(key: string, value: string | undefined | null): DataObject {
        this.json[key] = value ?? null;
        return this;
    }

    public addNumber(key: string, value: number | undefined | null): DataObject {
        this.json[key] = value ?? null;
        return this;
    }

    public addBoolean(key: string, value: boolean | undefined | null): DataObject {
        this.json[key] = value ?? null;
        return this;
    }

    public addDate(key: string, value: Date | undefined | null): DataObject {
        this.json[key] = value?.toISOString() ?? null;
        return this;
    }

    public addObject(key: string, value: DataObject | undefined | null): DataObject {
        this.json[key] = value?.json ?? null;
        return this;
    }

    public addStringArray(key: string, value: string[] | undefined | null): DataObject {
        this.json[key] = value?.map((primitive) => primitive ?? null) ?? null;
        return this;
    }

    public addNumberArray(key: string, value: number[] | undefined | null): DataObject {
        this.json[key] = value?.map((primitive) => primitive ?? null) ?? null;
        return this;
    }

    public addBooleanArray(key: string, value: boolean[] | undefined | null): DataObject {
        this.json[key] = value?.map((primitive) => primitive ?? null) ?? null;
        return this;
    }

    public addDateArray(key: string, value: Date[] | undefined | null): DataObject {
        this.json[key] =
            value?.map((date) => {
                return date?.toISOString() ?? null;
            }) ?? null;
        return this;
    }

    public addObjectArray(key: string, value: DataObject[] | undefined | null): DataObject {
        this.json[key] =
            value?.map((object) => {
                return object?.json ?? null;
            }) ?? null;
        return this;
    }

    public getStringOrNull(key: string, onFail: string | null = null, legacyKeys: string[] = []): string | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval != undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || typeof retrieval !== "string") {
            return onFail;
        }
        return retrieval;
    }

    public getString(key: string, onFail: string = "", legacyKeys: string[] = []): string {
        return this.getStringOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getNumberOrNull(key: string, onFail: number | null = null, legacyKeys: string[] = []): number | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval != undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || typeof retrieval !== "number") {
            return onFail;
        }
        return retrieval;
    }

    public getNumber(key: string, onFail: number, legacyKeys: string[] = []): number {
        return this.getNumberOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getBooleanOrNull(key: string, onFail: boolean | null = null, legacyKeys: string[] = []): boolean | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval != undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || typeof retrieval !== "boolean") {
            return onFail;
        }
        return retrieval;
    }

    public getBoolean(key: string, onFail: boolean, legacyKeys: string[] = []): boolean {
        return this.getBooleanOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getDateOrNull(key: string, onFail: Date | null = null, legacyKeys: string[] = []): Date | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined) {
            return onFail;
        }
        if (retrieval === null) {
            return null;
        }
        return new Date(retrieval);
    }

    public getDate(key: string, onFail: Date, legacyKeys: string[] = []): Date {
        return this.getDateOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getStringArrayOrNull(
        key: string,
        onFail: string[] | null = null,
        legacyKeys: string[] = [],
    ): string[] | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || !Array.isArray(retrieval)) {
            return onFail;
        }
        return retrieval;
    }

    public getStringArray(key: string, onFail: string[] = [], legacyKeys: string[] = []): string[] {
        return this.getStringArrayOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getNumberArrayOrNull(
        key: string,
        onFail: number[] | null = null,
        legacyKeys: string[] = [],
    ): number[] | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || !Array.isArray(retrieval)) {
            return onFail;
        }
        return retrieval;
    }

    public getNumberArray(key: string, onFail: number[] = [], legacyKeys: string[] = []): number[] {
        return this.getNumberArrayOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getBooleanArrayOrNull(
        key: string,
        onFail: boolean[] | null = null,
        legacyKeys: string[] = [],
    ): boolean[] | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || !Array.isArray(retrieval)) {
            return onFail;
        }
        return retrieval;
    }

    public getBooleanArray(key: string, onFail: boolean[] = [], legacyKeys: string[] = []): boolean[] {
        return this.getBooleanArrayOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getDateArrayOrNull(key: string, onFail: Date[] | null = null, legacyKeys: string[] = []): Date[] | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || !Array.isArray(retrieval)) {
            return onFail;
        }
        return retrieval.map((dateStr) => new Date(dateStr));
    }

    public getDateArray(key: string, onFail: Date[] = [], legacyKeys: string[] = []): Date[] {
        return this.getDateArrayOrNull(key, onFail, legacyKeys) ?? onFail;
    }

    public getDataObject(key: string, legacyKeys: string[] = []): DataObject {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || retrieval instanceof DataObject) {
            return new DataObject();
        }
        return DataObject.fromJSON(retrieval);
    }

    public getDataObjectArray(key: string, legacyKeys: string[] = []): DataObject[] {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || !Array.isArray(retrieval)) {
            return [];
        }
        return retrieval.map((json) => DataObject.fromJSON(json));
    }

    public getObjectOrNull<T>(key: string, legacyKeys: string[] = []): T | null {
        let retrieval = this.json[key];
        for (const legacyKey of legacyKeys) {
            if (retrieval !== undefined) {
                break;
            }
            retrieval = this.json[legacyKey];
        }
        if (retrieval === undefined || typeof retrieval !== "object" || retrieval === null) {
            return null;
        }
        return retrieval as T;
    }
}

export default DataObject;
