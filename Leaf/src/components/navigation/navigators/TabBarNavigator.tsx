import { createStackNavigator } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import YourPatientsScreen from "../../screens/YourPatientsScreen"
import HStack from "../../containers/HStack"
import LeafColors from "../../styling/LeafColors"
import LeafTypography from "../../styling/LeafTypography"
import LeafButton from "../../base/LeafButton/LeafButton"
import { LeafButtonType } from "../../base/LeafButton/LeafButtonType"
import LeafText from "../../base/LeafText/LeafText"
import LeafInterface from "../LeafInterface"
import LeafScreen from "../LeafScreen"
import CustomLeafHeader from "../CustomHeader"
import NavigationEnvironment from "./NavigationEnvironment"
import NavigationStateManager from "./NavigationStateManager"
import { EmptyScreen } from "../EmptyScreen"
import VStack from "../../containers/VStack"

interface Props {
    leafInterface: LeafInterface
}

/**
 * Our custom tab bar
 * @param param0 {@link Props}
 * @returns a JSX tab bar
 */
export const TabBarNavigator: React.FC<Props> = ({ leafInterface }) => {
    const [sidebar, setSidebar] = useState<JSX.Element | undefined>(undefined);
    const [screens, setScreens] = useState<LeafScreen[]>([]);

    const Stack = createStackNavigator();

    useEffect(() => {
        NavigationStateManager.sidebarComponentChanged.subscribe(() => {
            setSidebar(NavigationEnvironment.inst.sidebarComponent);
        });

        NavigationStateManager.newScreenAdded.subscribe(() => {
            setScreens([...NavigationEnvironment.inst.screens]);
        });
    }, []);

    useEffect(() => {
        NavigationEnvironment.inst.loadedNavigation();
        NavigationEnvironment.inst.loadedNavigation = () => {};
    }, [screens]);

    return (
        <VStack
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <SafeAreaView
                    edges={['top']}
                    style={{ 
                        flex: 1,
                    }}
                >
                {
                        screens.length == 0
                            ?
                        <EmptyScreen />
                            :
                        <Stack.Navigator>
                            {
                                screens.map((screen, index) => {
                                    return (
                                        <Stack.Screen 
                                            // Yes, key/name are both id
                                            key={screen.id}
                                            name={screen.id}
                                            component={screen.component}
                                            options={({ navigation }) => ({
                                                ...screen.options,
                                                animationEnabled: index > 0,
                                                header: () => (
                                                    <CustomLeafHeader
                                                        title={screen.title}
                                                        buttonProps={
                                                            {
                                                                canGoBack: index > 0,
                                                                navigation: navigation,
                                                            }
                                                        }
                                                    />
                                            )})}
                                        />
                                    )
                                })
                            }
                        </Stack.Navigator>
                    }
                    </SafeAreaView>
            </View>

            <SafeAreaView 
          edges={['bottom']}
        >
            <HStack style={{ width: "100%", }}>
                <LeafButton 
                    label={"1"}
                    icon="arrow-right-circle"
                    typography={LeafTypography.primaryButton}
                    type={LeafButtonType.filled} 
                    color={LeafColors.accent}
                    wide={false}
                    onPress={() => {
                        NavigationEnvironment.inst.clearScreens();
                        NavigationEnvironment.inst.setSidebarComponent(<YourPatientsScreen />, "Your Patients");
                    }}
                />

                <LeafButton 
                    label={"test"}
                    icon="arrow-right-circle"
                    typography={LeafTypography.primaryButton}
                    type={LeafButtonType.filled} 
                    color={LeafColors.accent}
                    wide={false}
                    onPress={() => {
                        NavigationEnvironment.inst.navigationTo(YourPatientsScreen, undefined, "Second Screen");
                        NavigationEnvironment.inst.setSidebarComponent(undefined, undefined);
                    }}
                />

                <LeafButton 
                    label={"3"}
                    icon="arrow-right-circle"
                    typography={LeafTypography.primaryButton}
                    type={LeafButtonType.filled} 
                    color={LeafColors.accent}
                    wide={false}
                    onPress={() => {
                        NavigationEnvironment.inst.navigationTo(YourPatientsScreen, undefined, "Second Screen");
                        NavigationEnvironment.inst.setSidebarComponent(undefined, undefined);
                    }}
                />
            </HStack>
            </SafeAreaView>
        </VStack>

    )
};


