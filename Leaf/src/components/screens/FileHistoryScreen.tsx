import React, {useEffect, useState} from "react";
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
import ExportReportCard from "../custom/ExportReportCard";
import FormHeader from "../custom/FormHeader";
import axios from 'axios';
import Session from "../../model/session/Session";
import StateManager from "../../state/publishers/StateManager";
import File from "../../model/file/File";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const FileHistoryScreen: React.FC<Props> = ({navigation}) => {
    const [selectedReport, setSelectedReport] = useState<File | null>(null);
    const [notify, setNotify] = useState(false);
    const {showErrorNotification, showSuccessNotification, showDefaultNotification} = useNotificationSession();
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const unsubscribeFiles = StateManager.filesFetched.subscribe(() => {
            setFiles(Session.inst.getAllFiles());
        });

        // Fetch files initially
        Session.inst.fetchAllFiles();

        // Cleanup subscription on unmount
        return () => {
            unsubscribeFiles();
        };
    }, []);

    const toggleReportSelect = (report: File) => {
        setNotify(false);
        if (selectedReport && selectedReport.title === report.title) {
            setSelectedReport(null);
        } else {
            setSelectedReport(report);
        }
    };

    const exportReport = async () => {
        showDefaultNotification(strings("label.pleaseWait"), strings("label.downloadingFile"), 'progress-download')
        if (selectedReport) {
            const file_id: string = selectedReport.id;
            const report_name: string = selectedReport.title;

            try {
                const response = await axios.get('http://127.0.0.1:5000/download-zip', {
                    params: {file_id: file_id},
                    responseType: 'blob',
                });

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
            setNotify(true);
            showErrorNotification(strings("label.noReportSelected"));
        }
    };

    // Define the interface for the grouped reports
    interface GroupedReports {
        monthYear: string;
        reports: File[];
    }

    const groupReportsByMonth = (reports: File[]): GroupedReports[] => {
        const groupedReports: GroupedReports[] = [];
        reports
            .slice()
            .sort((a, b) => b.created.getTime() - a.created.getTime())
            .forEach(report => {
                const monthYear = report.created.toLocaleString('default', {month: 'long', year: 'numeric'});
                const existingGroupIndex = groupedReports.findIndex(group => group.monthYear === monthYear);
                if (existingGroupIndex !== -1) {
                    groupedReports[existingGroupIndex].reports.push(report);
                } else {
                    groupedReports.push({monthYear: monthYear, reports: [report]});
                }
            });
        return groupedReports;
    };

    const groupedReports = groupReportsByMonth(files);

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
                            : selectedReport.title + strings("label.reportSelected")}
                    </LeafText>
                </HStack>
            </VStack>

            <VGap size={12}/>

            <VStack>
                <ScrollView style={{flex: 1, width: "100%"}}>
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
                                        isSelected={selectedReport?.title === report.title}
                                        onPress={() => toggleReportSelect(report)}
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
