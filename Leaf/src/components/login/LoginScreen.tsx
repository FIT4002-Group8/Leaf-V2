import React from "react";
import LeafText from "../base/LeafText/LeafText";
import LeafTypography from "../styling/LeafTypography";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafColors from "../styling/LeafColors";
import { strings } from "../../localisation/Strings";
import StateManager from "../../state/publishers/StateManager";
import { LoginStatus } from "../../state/publishers/types/LoginStatus";
import VStack from "../containers/VStack";
import Spacer from "../containers/layout/Spacer";
import LeafDimensions from "../styling/LeafDimensions";
import { View } from "react-native";
import VGap from "../containers/layout/VGap";

const LoginScreen: React.FC = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onUsernameInput = (text) => {
        setUsername(text);
    }

    const onPasswordInput = (text) => {
        setPassword(text);
    }

    const onLoginPressed = () => {
        // TODO: Obviously this entire thing will be reworked in time
        switch (username.toLowerCase()) {
            case "worker":
            case "w":
                StateManager.loginStatus.publish(LoginStatus.worker);
                break;
            case "leader":
            case "l":
                StateManager.loginStatus.publish(LoginStatus.leader);
                break;
            case "admin":
            case "a":
                StateManager.loginStatus.publish(LoginStatus.admin);
                break;
        }
    }

    return (
        <VStack 
            spacing={LeafDimensions.screenSpacing} 
            style={{ 
                flex: 1,
                alignItems: 'center',
                width: '100%',
                padding: LeafDimensions.screenPadding,
                backgroundColor: LeafColors.screenBackgroundLight.getColor(),
            }}
        >
            <Spacer />

            <LeafText 
                typography={LeafTypography.display} 
                style={{ textAlign: 'center', paddingBottom: 20 }}
            >
                {strings("login.title")}
            </LeafText>

            <View 
                style={{
                    maxWidth: 400,
                    alignItems: 'center',
                    width: "100%"
                }}
            >
                <LeafTextInput
                    label={strings("login.inputLabel.username")}
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={onUsernameInput}
                />

                <VGap size={4} />

                <LeafTextInput
                    label={strings("login.inputLabel.password")}
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={onPasswordInput}
                />

                <LeafButton 
                    label={strings("button.login")}
                    icon="arrow-right-circle"
                    typography={LeafTypography.primaryButton}
                    type={LeafButtonType.filled} 
                    color={LeafColors.accent}
                    style={{ marginTop: 40 }}
                    onPress={onLoginPressed}
                />
            </View>

            <Spacer />
            
            <Spacer />

            <Spacer />
        </VStack>
    );
}

export default LoginScreen;