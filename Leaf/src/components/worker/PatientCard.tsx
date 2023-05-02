import { ViewStyle } from "react-native";
import Patient from "../../model/patient/Patient";
import LeafColors from "../core/styles/LeafColors";
import LeafTypography from "../core/styles/LeafTypography";
import LeafText from "../core/views/LeafText/LeafText";
import { HStack, Spacer, VStack, View } from "native-base";
import TriageCodeBadge from "./TriageCodeBadge";
import LeafFloatingCard from "../core/containers/LeafFloatingCard/LeafFloatingCard";

interface Props {
    patient: Patient;
    style?: ViewStyle;
    onPress: (patient) => void;
}

const PatientCard: React.FC<Props> = ({ 
    patient,
    style,
    onPress,
}) => {
    let timeText = patient.triageCase.arrivalDate.toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).toUpperCase();
    let dateText = patient.triageCase.arrivalDate.toDateString();
    let datetimeText = `${timeText}  |  ${dateText}`;
    return (
        <LeafFloatingCard 
            color={LeafColors.textBackgroundLight}
            style={style}
        >
            <HStack>
                <TriageCodeBadge
                    code={patient.triageCase.triageCode}
                    fillSpace={false}
                    style={{
                        alignSelf: 'flex-start',
                        marginRight: 10,
                    }}
                />

                <VStack>
                    <View alignSelf={'flex-start'}>
                        <LeafText
                            typography={LeafTypography.cardTitle}
                            verticalWrap={true}
                        >
                            {patient.fullName}
                        </LeafText>
                    </View>

                    <Spacer size={3} />

                    <LeafText
                        typography={LeafTypography.subscript}
                        wide={false}
                    >
                        {datetimeText}
                    </LeafText>
                </VStack>
            </HStack>
        </LeafFloatingCard>
    );
}

export default PatientCard;