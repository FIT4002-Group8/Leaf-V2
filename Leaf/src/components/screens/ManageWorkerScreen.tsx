import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React from "react";
import { strings } from "../../localisation/Strings";
import Session from "../../model/session/Session";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafText from "../base/LeafText/LeafText";
import FlatContainer from "../containers/FlatContainer";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LeafTypography from "../styling/LeafTypography";
import { LeafFontWeight } from "../styling/typography/LeafFontWeight";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import { ErrorScreen } from "./ErrorScreen";
import { LeafPopUp } from "../base/LeafPopUp/LeafPopUp";
import NavigationSession from "../navigation/state/NavigationEnvironment";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const ManageWorkerScreen: React.FC<Props> = ({ navigation }) => {
    const worker = Session.inst.getActiveWorker();
    const [popUpVisible, setPopUpVisible] = React.useState(false);

    if (!worker) {
        return <ErrorScreen />;
    }

    const onDelete = async () => {
        setPopUpVisible(false);
        // TODO: has to check if there're any patients allocated to this nurse.
        const success = await Session.inst.deleteWorker(worker);
        if (success) {
            Session.inst.fetchAllWorkers();
            NavigationSession.inst.navigateBack(navigation);
            // TODO: add a notification/popup after successfully deleted account.
        } else {
            console.error("Error Occurs when deleting leader account.");
        }
    };

    const onCancel = () => {
        setPopUpVisible(false);
    };

    return (
        <DefaultScreenContainer>
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                }}
            >
                <LeafText typography={LeafTypography.title2.withWeight(LeafFontWeight.Bold)}>
                    {worker.role.toString()}
                </LeafText>

                <FlatContainer color={LeafColors.fillBackgroundLight}>
                    <LeafText typography={LeafTypography.body}>{strings("label.id") + worker.id.toString()}</LeafText>
                </FlatContainer>

                <VGap size={32} />

                <LeafPopUp
                    visible={popUpVisible}
                    title={strings("label.removeNurse") + ' "' + worker.fullName + '"'}
                    onCancel={onCancel}
                    onDone={onDelete}
                    doneLabel="Remove"
                >
                    <LeafText typography={LeafTypography.title4} wide={false}>
                        {strings("label.removeAccountWarning")}
                    </LeafText>
                </LeafPopUp>

                <LeafButton
                    label={strings("button.deleteAccount")}
                    icon="delete"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.textError}
                    onPress={() => setPopUpVisible(true)}
                />

                <LeafText typography={LeafTypography.subscript} wide={false}>
                    {strings("operation.removeAccount")}
                </LeafText>
            </VStack>
        </DefaultScreenContainer>
    );
};

export default ManageWorkerScreen;
