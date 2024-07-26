// FileHistoryScreen.tsx

import React, {useState} from "react";
import {FlatList, ScrollView} from "react-native";
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
import reports, {Report} from "../../preset_data/ReportData";
import ExportReportCard from "../custom/ExportReportCard";
import FormHeader from "../custom/FormHeader";
import axios from 'axios';

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const FileHistoryScreen: React.FC<Props> = ({navigation}) => {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [notify, setNotify] = useState(false);
    const {showErrorNotification, showSuccessNotification, showDefaultNotification} = useNotificationSession();

    const toggleReportSelect = (report: Report) => {
        setNotify(false);
        if (selectedReport && selectedReport.name === report.name) {
            setSelectedReport(null);
        } else {
            setSelectedReport(report);
        }
    };

    const exportReport = async () => {
        showDefaultNotification(strings("label.pleaseWait"), strings("label.downloadingFile"), 'progress-download')
        if (selectedReport) {
            const file_id: string = selectedReport["drive_id"]
            const report_name: string = selectedReport["name"]

            try {
                // Make the GET request to the Flask endpoint
                const response = await axios.get('http://127.0.0.1:5000/download-zip', {
                    params: {file_id: file_id},
                    responseType: 'blob', // Important for handling binary data
                });

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${report_name}.zip`; // The file name for download
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // Clean up the URL object
                showSuccessNotification(strings("feedback.successDownloadReport"));
            } catch (error) {
                console.error('Error downloading the file', error);
                showErrorNotification(strings("feedback.failDownloadReport"));
            }
        }
        else {
            setNotify(true);
            showErrorNotification(strings("label.noReportSelected"));
        }
    };

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
                        exportReport();
                        console.log("Downloading report: ", selectedReport);
                    }}
                />
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
                            ? strings("label.noReportSelected")
                            : selectedReport["name"] + strings("label.reportSelected")}
                    </LeafText>
                </HStack>
            </VStack>

            <VGap size={12}/>

            <VStack>
                <ScrollView style={{flex: 1, width: "100%"}}>
                    {/* Iterate over reports grouped by month and render */}
                    {groupedReports.map((group, index) => (
                        <VStack key={index}>
                            <FormHeader
                                title={group.monthYear}
                            />
                            <FlatList
                                data={group.reports}
                                renderItem={({item: report}) => (
                                    <ExportReportCard
                                        report={report}
                                        isSelected={selectedReport?.name === report.name}
                                        onPress={() => toggleReportSelect(report)}
                                    />
                                )}
                                keyExtractor={(report) => report.name}
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

// Define the interface for the grouped reports
interface GroupedReports {
    monthYear: string;
    reports: Report[];
}

// Group reports by month and sort the reports within each group by date
const groupedReports: GroupedReports[] = [];
reports
    .slice() // Create a copy of reports array to avoid modifying the original array
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort reports by date in descending order
    .forEach(report => {
        const monthYear = report.date.toLocaleString('default', {month: 'long', year: 'numeric'});
        const existingGroupIndex = groupedReports.findIndex(group => group.monthYear === monthYear);
        if (existingGroupIndex !== -1) {
            groupedReports[existingGroupIndex].reports.push(report);
        } else {
            // Create a new group and add the report to it
            groupedReports.push({monthYear: monthYear, reports: [report]});
        }
    });

// Sort the reports within each group by date in descending order
groupedReports.forEach(group => {
    group.reports.sort((a, b) => b.date.getTime() - a.date.getTime());
});
