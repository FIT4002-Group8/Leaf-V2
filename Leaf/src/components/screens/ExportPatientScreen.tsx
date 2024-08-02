import {NavigationProp, ParamListBase} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {strings} from "../../localisation/Strings";
import Session from "../../model/session/Session";
import StateManager from "../../state/publishers/StateManager";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import LeafButton from "../base/LeafButton/LeafButton";
import {LeafButtonType} from "../base/LeafButton/LeafButtonType";
import LeafTypography from "../styling/LeafTypography";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LargeMenuButtonModified from "../custom/LargeMenuButtonModified";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import VGap from "../containers/layout/VGap";
import HStack from "../containers/HStack";
import VStack from "../containers/VStack";
import LeafSelectionItem from "../base/LeafListSelection/LeafSelectionItem";
import FormHeader from "../custom/FormHeader";
import Hospital from "../../model/hospital/Hospital";
import Ward from "../../model/hospital/Ward";
import MedicalUnit from "../../model/hospital/MedicalUnit";
import Worker from "../../model/employee/Worker";
import {HospitalArray} from "../../preset_data/Hospitals";
import {PatientSex} from "../../model/patient/PatientSex";
import {TriageCode} from "../../model/triage/TriageCode";
import LeafSelectionInputModified from "../base/LeafListSelection/LeafSelectionInputModified";
import TriageCodePickerModified from "../custom/TriageCodePickerModified";
import SexPicker from "../custom/SexPickerModified";
import axios from "axios";
import File from "../../model/file/File";
import {FileFilters} from "../../model/file/FileFilters";
import {filtersToDataObject} from "../../model/file/filtersUtils";
import {useNotificationSession} from "../base/LeafDropNotification/NotificationSession";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const ExportPatientScreen: React.FC<Props> = ({navigation}) => {
    const [componentWidth, setComponentWidth] = useState(StateManager.contentWidth.read());
    const [selectedHospital, setSelectedHospital] = useState<LeafSelectionItem<Hospital> | undefined>();
    const [selectedWard, setSelectedWard] = useState<LeafSelectionItem<Ward> | undefined>();
    const [selectedMedicalUnit, setSelectedMedicalUnit] = useState<LeafSelectionItem<MedicalUnit> | undefined>();
    const [isCustomTileSelected, setIsCustomTileSelected] = useState<boolean>(false);
    const [workers, setWorkers] = useState<Worker[]>(Session.inst.getAllWorkers());
    const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(workers);
    const [selectedAssignedTo, setAssignedTo] = useState<LeafSelectionItem<Worker> | undefined>();
    const [selectedSexes, setSelectedSexes] = useState<PatientSex[]>([]);
    const activePatient = Session.inst.getActivePatient();
    const [triageCode, setTriageCode] = useState<TriageCode | undefined>(activePatient?.triageCase?.triageCode);
    const [selectedReportType, setSelectedReportType] = useState<string | undefined>();
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const user = Session.inst.loggedInAccount;
    const {showErrorNotification, showSuccessNotification, showDefaultNotification} = useNotificationSession();

    // Effect to handle fetching and updating workers data
    useEffect(() => {
        const unsubscribeWorkers = StateManager.workersFetched.subscribe(() => {
            setWorkers(Session.inst.getAllWorkers());
            setFilteredWorkers(Session.inst.getAllWorkers());
        });

        setComponentWidth(window.innerWidth - 264);

        // Fetch all workers when the component is mounted
        Session.inst.fetchAllWorkers();
        // Cleanup: Unsubscribe from workersFetched event when the component is unmounted
        return () => {
            unsubscribeWorkers();
        };
    }, []);

    const determineColumnCount = (width: number): number => {
        if (width < 365) {
            return 1;
        } else if (width < 520) {
            return 2;
        } else {
            return 3;
        }
    };

    const columnCount = determineColumnCount(componentWidth);
    const buttonSpacing = LeafDimensions.screenSpacing;
    const buttonWidth = (componentWidth - ((columnCount - 1) * buttonSpacing / 2)) / columnCount;

    // Function to handle custom tile selection
    const handleCustomTileSelection = () => {
        if (isCustomTileSelected) {
            setSelectedHospital(undefined);
            setSelectedWard(undefined);
            setSelectedMedicalUnit(undefined);
            setAssignedTo(undefined);
            setSelectedSexes([]);
            setTriageCode(undefined);
        }
        setIsCustomTileSelected(!isCustomTileSelected);
    };

    const workerItems = workers.map((worker) => {
        return new LeafSelectionItem<Worker>(worker.fullName, worker.id.toString(), worker);
    });

    // Handle worker selection
    const handleWorkerSelection = (item: LeafSelectionItem<unknown> | undefined) => {
        setAssignedTo(item as LeafSelectionItem<Worker> | undefined);
    };

    const handleSexSelection = (sexes: PatientSex[]) => {
        setSelectedSexes(sexes);
    };

    // Handle report type selection
    const handleReportTypeSelection = (reportType: string) => {
        setSelectedReportType(reportType);
        console.log(`Selected report type: ${reportType}`);

        if (reportType === "Custom Report") {
            setIsCustomTileSelected(true);
            console.log(`Here: ${reportType}`);
        } else {
            setIsCustomTileSelected(false);
        }
    };

    // Handle button press and update selected button
    const handleButtonPress = (buttonLabel: string) => {
        if (selectedButton === buttonLabel) {
            // If the button is already selected, unselect it
            setSelectedButton(null);
            // Hide the form if the custom report button is unselected
            if (buttonLabel === "customReport") {
                setIsCustomTileSelected(false);
            }
        } else {
            // Otherwise, set it as the selected button
            setSelectedButton(buttonLabel);
            // Handle report type selection
            handleReportTypeSelection(buttonLabel);
        }
    };

    const generateReport = async () => {
        showDefaultNotification(strings("label.pleaseWait"), strings("label.downloadingFile"), 'progress-download')
        if (selectedReportType) {
            try {
                // Create file properties
                const title: string = "Test Report";
                const author: string = user.fullName;
                const report_type: string = selectedReportType;
                const created: Date = new Date();

                // TODO - Create filters object
                const filters: FileFilters = {
                    assigned_to: "",
                    hospital_site: "",
                    medical_unit: "",
                    sex: "",
                    triage_code: [], // Adjust according to TriageCode structure
                    ward: "",
                };
                // Make the GET request to the Flask endpoint
                const csv_file_id = await axios.get('http://127.0.0.1:5000/upload-csv', {
                    params: {title: 'test.csv'},
                });

                // Generate or fetch file_id
                const file_id: string = csv_file_id.data["id"];
                console.log(csv_file_id.data["id"]);

                // Create File object
                const file = new File(
                    file_id,
                    title,
                    author,
                    report_type,
                    created,
                    filters
                );

                // Set file in session or save to DB
                await Session.inst.submitNewFile(file);

                const response = await axios.get('http://127.0.0.1:5000/download-zip', {
                    params: {file_id: file_id},
                    responseType: 'blob', // Important for handling binary data
                });

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title}.zip`; // The file name for download
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
    };

    return (
        <DefaultScreenContainer>
            <VStack spacing={LeafDimensions.screenSpacing} style={{flex: 1}}>
                <HStack
                    spacing={buttonSpacing}
                    style={{
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Render large menu buttons */}
                    {[
                        {
                            label: strings("button.fullReport"),
                            description: strings("label.fullReport"),
                            onPress: () => setSelectedButton("fullReport"),
                            icon: "file-account-outline",
                        },
                        {
                            label: strings("button.quickReport"),
                            description: strings("label.quickReport"),
                            onPress: () => setSelectedButton("quickReport"),
                            icon: "file-clock-outline",
                        },
                        {
                            label: strings("button.customReport"),
                            description: strings("label.customReport"),
                            onPress: () => {
                                setSelectedButton("customReport");
                                handleCustomTileSelection();
                            },
                            icon: "file-edit-outline",
                        },
                    ].map((tile, index) => (
                        <LargeMenuButtonModified
                            key={index}
                            size={buttonWidth}
                            label={tile.label}
                            description={tile.description}
                            onPress={tile.onPress}
                            icon={tile.icon}
                            // Pass isSelected prop to LargeMenuButtonModified
                            isSelected={selectedButton === tile.label} // Compare the selectedButton with the current tile label
                            onSelect={() => handleButtonPress(tile.label)} // Set the selected button state
                        />
                    ))}
                </HStack>

                {isCustomTileSelected && (
                    <VStack spacing={LeafDimensions.textInputSpacing} style={{width: "100%"}}>
                        <FormHeader
                            title={strings("triageForm.title.reportFilter")}
                            style={{paddingVertical: 24}}
                        />

                        {/* Custom selection inputs */}
                        <VStack spacing={LeafDimensions.textInputSpacing} style={{width: "100%"}}>
                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={HospitalArray.map(hospital => new LeafSelectionItem(hospital.name, hospital.code, hospital))}
                                title={strings("inputLabel.hospital")}
                                selected={selectedHospital}
                                onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                                    setSelectedHospital(item as LeafSelectionItem<Hospital> | undefined);
                                    setSelectedMedicalUnit(undefined);
                                    setSelectedWard(undefined);
                                }}
                            />

                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={selectedHospital === undefined ? [] : selectedHospital.value.wardsAsArray.map(ward => new LeafSelectionItem(ward.name, ward.hospitalCode, ward))}
                                title={strings("inputLabel.ward")}
                                selected={selectedWard}
                                disabled={selectedHospital === undefined}
                                onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                                    setSelectedWard(item as LeafSelectionItem<Ward> | undefined);
                                }}
                            />

                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={selectedHospital === undefined ? [] : selectedHospital.value.medUnitsAsArray.map(medUnit => new LeafSelectionItem(medUnit.name, medUnit.group, medUnit))}
                                title={strings("inputLabel.medicalUnit")}
                                selected={selectedMedicalUnit}
                                disabled={selectedHospital === undefined}
                                onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                                    setSelectedMedicalUnit(item as LeafSelectionItem<MedicalUnit> | undefined);
                                }}
                            />

                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={workerItems}
                                title={strings("inputLabel.assignedTo")}
                                selected={selectedAssignedTo}
                                onSelection={handleWorkerSelection}
                            />

                            <SexPicker
                                style={{paddingBottom: 8}}
                                onSelection={handleSexSelection}
                                initialValue={selectedSexes}
                            />

                            <TriageCodePickerModified
                                style={{paddingBottom: 8}}
                                onSelection={codes => setTriageCode(codes.length > 0 ? codes[0] : undefined)}
                                initialValue={triageCode ? [triageCode] : undefined}
                            />
                        </VStack>
                    </VStack>
                )}

                {/* Add the export button at the bottom */}
                <VGap size={12}/>
                <LeafButton
                    label="Export"
                    icon="file-export"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={async () => {
                        // TODO - Handle export logic
                        await generateReport();
                    }}
                />
            </VStack>
        </DefaultScreenContainer>
    );
};

export default ExportPatientScreen;
