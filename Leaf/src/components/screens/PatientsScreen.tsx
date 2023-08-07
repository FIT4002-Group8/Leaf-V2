import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import LeafColors from "../styling/LeafColors";
import LeafTypography from "../styling/LeafTypography";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafText from "../base/LeafText/LeafText";
import ActionsScreen from "./ActionsScreen";
import VStack from "../containers/VStack";
import LeafDimensions from "../styling/LeafDimensions";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import PatientsPicker from "../custom/PatientsPicker";
import LeafSearchBar from "../base/LeafSearchBar/LeafSearchBar";
import HStack from "../containers/HStack";
import LeafTextButton from "../base/LeafTextButton/LeafTextButton";
import StateManager from "../../state/publishers/StateManager";
import Session from "../../model/Session";
import Patient from "../../model/patient/Patient";
import PatientCard from "../custom/PatientCard";
import Spacer from "../containers/layout/Spacer";
import PatientPreviewScreen from "./PatientPreviewScreen";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const PatientsScreen: React.FC<Props> = ({ navigation }) => {
    const [patients, setPatients] = React.useState<Patient[]>(Session.inst.getAllPatients());

    useEffect(() => {
        StateManager.patientsFetched.subscribe(() => {
            setPatients(Session.inst.getAllPatients());
        });

        Session.inst.fetchAllPatients();
    }, []);

    const onSelection = () => {};

    const onSearch = () => {};

    const onTime = () => {};

    const onCode = () => {};

    const onPatientPress = (patient: Patient) => {
        Session.inst.setActivePatient(patient);
        NavigationSession.inst.navigateTo(PatientPreviewScreen, navigation, patient.fullName);
    };

    return (
        <DefaultScreenContainer>
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                    backgroundColor: LeafColors.screenBackgroundLight.getColor(),
                }}
            >
                <PatientsPicker onSelection={onSelection} />
                {/* <LeafSearchBar searchQuery={""} onSearch={onSearch} /> */}
                <HStack
                    style={{
                        width: "100%",
                        borderBottomWidth: 2,
                        borderBottomColor: LeafColors.divider.getColor(),
                        paddingBottom: 6,
                    }}
                >
                    <LeafTextButton
                        label={"Time"}
                        typography={LeafTypography.plainTextButton}
                        onPress={onTime}
                        icon={"chevron-down"}
                        iconColor={LeafColors.textDark}
                        style={{ flex: 1 }}
                        textStyle={{ paddingLeft: 6 }}
                    />
                    <LeafTextButton
                        label={"Code"}
                        typography={LeafTypography.plainTextButton}
                        onPress={onCode}
                        icon={"chevron-down"}
                        iconColor={LeafColors.textDark}
                        style={{ flex: 1 }}
                        textStyle={{ paddingLeft: 6 }}
                    />
                </HStack>
                <Spacer />
                {patients.map((patient) => (
                    <PatientCard
                        key={patient.mrn.toString()}
                        patient={patient}
                        onPress={() => onPatientPress(patient)}
                    />
                ))}
            </VStack>
        </DefaultScreenContainer>
    );
};

export default PatientsScreen;
