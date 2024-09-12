import React, {useEffect, useState} from "react";
import {FlatList, ScrollView, View} from "react-native";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import {strings} from "../../localisation/Strings";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import LeafText from "../base/LeafText/LeafText";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import HStack from "../containers/HStack";
import LeafButton from "../base/LeafButton/LeafButton";
import {LeafButtonType} from "../base/LeafButton/LeafButtonType";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LeafTypography from "../styling/LeafTypography";
import {useNotificationSession} from "../base/LeafDropNotification/NotificationSession";
import ExportReportCard from "../custom/ExportReportCard";
import FormHeader from "../custom/FormHeader";
import axios from 'axios';
import Session from "../../model/session/Session";
import StateManager from "../../state/publishers/StateManager";
import File from "../../model/file/File";
import LeafDateInput from "../base/LeafDateInput/LeafDateInput";
import LeafReportSearchBar from "../base/LeafSearchBar/LeafReportSearchBar";

// Define the properties expected by the FileHistoryScreen component
interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

// The main component for the File History Screen
const FileHistoryScreen: React.FC<Props> = () => {
    // State for selected report, notification trigger, and list of files
    const [selectedReport, setSelectedReport] = useState<File | null>(null);
    const [notify, setNotify] = useState(false);
    const {showErrorNotification, showSuccessNotification, showDefaultNotification} = useNotificationSession();
    const [files, setFiles] = useState<File[]>([]);

    // State for filters
    const [titleFilter, setTitleFilter] = useState<string>("");
    const [fromDateFilter, setFromDateFilter] = useState<Date | undefined>();
    const [toDateFilter, setToDateFilter] = useState<Date | undefined>(new Date());
    const [dateError, setDateError] = useState<string | null>(null);

    // useEffect hook to subscribe to file updates and fetch files initially
    useEffect(() => {
        const unsubscribeFiles = StateManager.filesFetched.subscribe(() => {
            setFiles(Session.inst.getAllFiles());
        });

        // Fetch files initially
        Session.inst.fetchAllFiles();

        // Cleanup subscription on component unmount
        return () => {
            unsubscribeFiles();
        };
    }, []);

    // Toggles the selection of a report
    const toggleReportSelect = (report: File) => {
        setNotify(false);
        if (selectedReport && selectedReport.title === report.title) {
            setSelectedReport(null); // Deselect if already selected
        } else {
            setSelectedReport(report); // Select the clicked report
        }
    };

    // Function to handle the export/download of the selected report
    const exportReport = async () => {
        showDefaultNotification(strings("label.pleaseWait"), strings("label.downloadingFile"), 'progress-download');
        if (selectedReport) {
            const file_id: string = selectedReport.id;
            const title: string = selectedReport.title;
            const report_name: string = selectedReport.title;
            const password: string = selectedReport.password;
            const report_type: string = selectedReport.reportType;

            try {
                // Request to download the report
                const response = await axios.get('http://127.0.0.1:5000/download', {
                    params: {file_id: file_id, file_title: title, password: password, report_type: report_type},
                    responseType: 'blob',
                });

                // Create a download link and trigger download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${report_name}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showSuccessNotification(strings("feedback.successDownloadReport"));
            } catch (error) {
                console.error('Error downloading the file', error);
                showErrorNotification(strings("feedback.failDownloadReport"));
            }
        } else {
            setNotify(true); // Trigger notification if no report is selected
            showErrorNotification(strings("label.noReportSelected"));
        }
    };

    // Interface for grouped reports by month and year
    interface GroupedReports {
        monthYear: string;
        reports: File[];
    }

    // Function to group reports by their creation month and year
    const groupReportsByMonth = (reports: File[]): GroupedReports[] => {
        const groupedReports: GroupedReports[] = [];
        reports
            .slice()
            .sort((a, b) => b.created.getTime() - a.created.getTime()) // Sort by creation date (newest first)
            .forEach(report => {
                const monthYear = report.created.toLocaleString('default', {month: 'long', year: 'numeric'});
                const existingGroupIndex = groupedReports.findIndex(group => group.monthYear === monthYear);
                if (existingGroupIndex !== -1) {
                    groupedReports[existingGroupIndex].reports.push(report); // Add to existing group
                } else {
                    groupedReports.push({monthYear: monthYear, reports: [report]}); // Create a new group
                }
            });
        return groupedReports;
    };

    // Function to apply title and date filters to the reports
    const applyFilters = (reports: File[]): File[] => {
        if (dateError) {
            return [];
        }
        return reports.filter(report => {
            const matchesTitle = titleFilter === "" || report.title.toLowerCase().includes(titleFilter.toLowerCase());
            const matchesFromDate = !fromDateFilter || report.created >= fromDateFilter;
            const matchesToDate = !toDateFilter || report.created <= toDateFilter;
            return matchesTitle && matchesFromDate && matchesToDate;
        });
    };

    // useEffect hook to validate date filters
    useEffect(() => {
        if (fromDateFilter && toDateFilter && fromDateFilter > toDateFilter) {
            setDateError("From date cannot be after the To date.");
        } else {
            setDateError(null);
        }
    }, [fromDateFilter, toDateFilter]);

    // Apply filters and group the reports by month and year
    const filteredReports = applyFilters(files);
    const groupedReports = groupReportsByMonth(filteredReports);

    return (
        <DefaultScreenContainer>
            <VStack spacing={16}>
                <LeafButton
                    label="Download"
                    icon="file-download"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={async () => {
                        await exportReport(); // Handle report download on button press
                        console.log("Downloading report: ", selectedReport);
                    }}
                />
                {/* Filters Section */}
                <HStack spacing={8} style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <View style={{flex: 3}}>
                        <LeafReportSearchBar
                            label={strings("search.underlying")}
                            onTextChange={setTitleFilter} // Update title filter
                            data={[]}
                            setData={() => {
                            }}
                            dataToString={(item) => item}
                            style={{flex: 3}}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <LeafDateInput
                            label={strings("label.fromDate")}
                            onChange={(date) => {
                                setFromDateFilter(date); // Update from date filter
                            }}
                        />
                    </View>
                    <View style={{flex: 1, minWidth: '150px'}}>
                        <LeafDateInput
                            label={strings("label.toDate")}
                            initialValue={new Date()}
                            onChange={(date) => {
                                setToDateFilter(date); // Update to date filter
                            }}
                        />
                    </View>
                </HStack>
                <HStack
                    spacing={16}
                    style={{
                        alignItems: "center",
                    }}
                >
                    <LeafText
                        typography={LeafTypography.body.withColor(LeafColors.textSemiDark)}
                        style={{
                            flex: 1,
                            color: notify ? LeafColors.textError.getColor() : LeafColors.accent.getColor(),
                        }}
                    >
                        {selectedReport === null
                            ? strings("label.noReportSelected") // Show message if no report selected
                            : selectedReport.title + strings("label.reportSelected")}
                    </LeafText>
                </HStack>
            </VStack>

            <VGap size={12}/>
            <VStack>
                <ScrollView style={{flex: 1, width: "100%"}}>
                    {groupedReports.map((group, index) => (
                        <VStack key={index}>
                            <FormHeader title={group.monthYear}/>
                            <FlatList
                                data={group.reports}
                                renderItem={({item: report}) => (
                                    <ExportReportCard
                                        report={report}
                                        isSelected={selectedReport?.title === report.title} // Highlight if selected
                                        onPress={() => toggleReportSelect(report)} // Handle report selection
                                    />
                                )}
                                keyExtractor={(report) => report.id}
                                ItemSeparatorComponent={() => <VGap size={LeafDimensions.cardSpacing}/>}
                                scrollEnabled={false}
                                style={{
                                    width: "100%",
                                    overflow: "visible",
                                    flexGrow: 0,
                                }}
                            />
                        </VStack>
                    ))}
                </ScrollView>
            </VStack>
        </DefaultScreenContainer>
    );
};

export default FileHistoryScreen;
