import File from "../model/file/File"; // Adjust the import path to where your File class is located
import {FileFilters} from "../model/file/FileFilters"; // Assuming Filters is exported from File
import DataObject from "./DataObject";
import {filtersToDataObject} from "../model/file/filtersUtils";

export enum FileField {
    ID = "id",
    Title = "title",
    Author = "author",
    ReportType = "reportType",
    Created = "created",
    Filters = "filters",
}

class FileDataObject {
    public static create(file: File): DataObject {
        return new DataObject()
            .addString(FileField.ID, file.id)
            .addString(FileField.Title, file.title)
            .addString(FileField.Author, file.author)
            .addString(FileField.ReportType, file.reportType)
            .addDate(FileField.Created, file.created)
            .addObject(FileField.Filters, filtersToDataObject(file.filters));
    }

    public static restore(data: DataObject): File | null {
        const id = data.getStringOrNull(FileField.ID);
        const title = data.getStringOrNull(FileField.Title);
        const author = data.getStringOrNull(FileField.Author);
        const reportType = data.getStringOrNull(FileField.ReportType);
        const created = data.getDateOrNull(FileField.Created);
        const filters = data.getObjectOrNull<FileFilters>(FileField.Filters);

        if (!id || !title || !author || !reportType || created == null || filters == null) {
            console.error("[FileDataObject] Failed to restore File");
            return null;
        }

        return new File(id, title, author, reportType, created, filters);
    }
}

export default FileDataObject;
