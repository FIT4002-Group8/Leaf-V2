import VStack from "../containers/VStack";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import VGap from "../containers/layout/VGap";
import React, { useEffect } from "react";
import Patient from "../../model/patient/Patient";
import Session from "../../model/Session";
import StateManager from "../../state/publishers/StateManager";
import { FlatList } from "react-native";
import PatientAllocationCard from "../custom/PatientAllocationCard";
import LeafDimensions from "../styling/LeafDimensions";
import LeafSearchBarNew from "../base/LeafSearchBar/LeafSearchBarNew";
import LeafSegmentedButtons from "../base/LeafSegmentedButtons/LeafSegmentedButtons";
import LeafSegmentedValue from "../base/LeafSegmentedButtons/LeafSegmentedValue";
import { strings } from "../../localisation/Strings";
import LeafButton from "../base/LeafButton/LeafButton";
import HStack from "../containers/HStack";
import HGap from "../containers/layout/HGap";
import LeafTypography from "../styling/LeafTypography";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafColors from "../styling/LeafColors";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const AllocateNurseToPatientScreen: React.FC<Props> = ({ navigation }) => {
    const [patients, setPatients] = React.useState<Patient[]>(Session.inst.getAllPatients());
    const [searchQuery, setSearchQuery] = React.useState("");
    const onSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        StateManager.patientsFetched.subscribe(() => {
            setPatients(Session.inst.getAllPatients());
        });

        Session.inst.fetchAllPatients();
    }, []);

    const [segmentedValue, setSegmentedValue] = React.useState<LeafSegmentedValue | null>(null);
    const onSetSegmentedValue = (segmentedValue) => {
        // TODO: Filter patients by time of day
        setSegmentedValue(segmentedValue);
    };
    const [shouldShowTime, setShouldShowTime] = React.useState(false);
    const [shouldShowCode, setShouldShowCode] = React.useState(false);
    // Hooks for the filter button toggles
    const [isToggledTime, setIsToggledTime] = React.useState(false);
    const [isToggledCode, setIsToggledCode] = React.useState(false);

    const [selectedIndex, setSelectedIndex] = React.useState(null);

    return (
        <DefaultScreenContainer>
            <VStack>
                <LeafSearchBarNew onTextChange={onSearch} />

                <VGap size={20} />

                <HStack>
                    <LeafButton
                        label={strings("searchBarFilter.time")}
                        onPress={() => {
                            setShouldShowTime(!shouldShowTime);
                            setIsToggledTime(!isToggledTime);
                        }}
                        typography={LeafTypography.buttonSmall.withColor(
                            isToggledTime ? LeafColors.textLight : LeafColors.textDark,
                        )}
                        color={isToggledTime ? LeafColors.accent : LeafColors.fillBackgroundLight}
                        wide={false}
                    ></LeafButton>

                    <HGap size={6} />

                    <LeafButton
                        label={strings("searchBarFilter.triageCode")}
                        onPress={() => {
                            setShouldShowCode(!shouldShowCode);
                            setIsToggledCode(!isToggledCode);
                        }}
                        typography={LeafTypography.buttonSmall.withColor(
                            isToggledCode ? LeafColors.textLight : LeafColors.textDark,
                        )}
                        color={isToggledCode ? LeafColors.accent : LeafColors.fillBackgroundLight}
                        wide={false}
                    ></LeafButton>
                </HStack>

                <VStack>
                    <VGap size={6} />

                    {shouldShowTime ? (
                        <LeafSegmentedButtons
                            label={strings("searchBarFilter.time")}
                            options={[
                                new LeafSegmentedValue(0, strings("button.morning")),
                                new LeafSegmentedValue(1, strings("button.noon")),
                                new LeafSegmentedValue(2, strings("button.afternoon")),
                                new LeafSegmentedValue(3, strings("button.none")),
                            ]}
                            value={segmentedValue}
                            onSetValue={setSegmentedValue}
                        ></LeafSegmentedButtons>
                    ) : null}

                    <VGap size={6} />

                    {shouldShowCode ? (
                        <LeafSegmentedButtons
                            label={strings("searchBarFilter.triageCode")}
                            options={[
                                new LeafSegmentedValue(0, strings("button.code.1")),
                                new LeafSegmentedValue(1, strings("button.code.2")),
                                new LeafSegmentedValue(2, strings("button.code.3")),
                                new LeafSegmentedValue(3, strings("button.code.4")),
                                new LeafSegmentedValue(4, strings("button.code.5")),
                            ]}
                            value={segmentedValue}
                            onSetValue={setSegmentedValue}
                        ></LeafSegmentedButtons>
                    ) : null}
                </VStack>

                <VGap size={20} />

                <FlatList
                    data={patients}
                    renderItem={({ item: patient, index: index }) => (
                        <PatientAllocationCard
                            patient={patient}
                            itemIndex={index}
                            selectedIndex={selectedIndex}
                            onSelect={setSelectedIndex}
                        />
                    )}
                    keyExtractor={(patient) => patient.mrn.toString()}
                    ItemSeparatorComponent={() => <VGap size={LeafDimensions.cardSpacing} />}
                    scrollEnabled={false}
                    // Don't use overflow prop - doesn't work on web
                    style={{
                        width: "100%",
                        overflow: "visible", // Stop shadows getting clipped
                        flexGrow: 0, // Ensures the frame wraps only the FlatList content
                    }}
                />
            </VStack>
        </DefaultScreenContainer>
    );
};

export default AllocateNurseToPatientScreen;
