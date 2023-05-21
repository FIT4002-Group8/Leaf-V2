import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import StateManager from "../../../../state/publishers/StateManager";
import LeafColors from "../../styles/LeafColors";
import LeafTypography from "../../styles/LeafTypography";
import LeafText from "../../views/LeafText/LeafText";
import LeafSidebarItem from "../LeafSidebarItem";
import LeafBaseDimensions from "../../styles/LeafBaseDimensions";
import { VStack } from "native-base";
import LeafSearchBar from "../../views/LeafSearchBar/LeafSearchBar";

interface Props {
    items: LeafSidebarItem[];
    title: string;
    searchable: boolean;
}

/**
 * Renders an item list, we wrap each item in a touchable opacity so that we can overwrite the onPress of the item component. 
 * The onPress calls the passProps function of the item then updates state telling our drawer to render the stack next to the sidebar
 * @param param0 {@link Props}
 * @returns our custom sidebar
 */
export const Sidebar: React.FC<Props> = ({ items, title, searchable }) => {

    useEffect(() => {
        StateManager.drawerShowStack.publish(false);
    }, [])

    // Searchbar
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filteredSidebarItems, setFilteredSidebarItems] = React.useState(items)

    // Filter items
    const onChangeSearch = (query) => {
        setFilteredSidebarItems(items.filter(item => item.searchableString != undefined ? item.searchableString.toLowerCase().includes(query.toLowerCase()) : false));
        setSearchQuery(query);
    }

    // This is a one-time use so no need to define a constant
    // We want it to reflect the header so use that and adapt the size
    let headerTypography = LeafTypography.header;
    headerTypography.size = 25;

    let searchTypography = LeafTypography.body;
    searchTypography.size = 18;

    return (
        <SafeAreaView style={styles.container}>
            <VStack paddingX={LeafBaseDimensions.screenPadding/2} flex={1}>
                <LeafText typography={headerTypography} style={styles.title}> 
                    {title}
                </LeafText>

                {
                    searchable
                        ? 
                    <View style={styles.searchBarWrapper}>
                        <LeafSearchBar 
                            searchQuery={searchQuery} 
                            onSearch={onChangeSearch} 
                        />
                    </View>
                        :
                    null
                }

                <ScrollView>
                    <VStack space={LeafBaseDimensions.screenSpacing/2}>
                        {
                            filteredSidebarItems.map(item => {
                                return (
                                    <View style={styles.sidebarItemWrapper} key={item.id.toString()}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                item.passProps();
                                                StateManager.drawerShowStack.publish(true);
                                                StateManager.sideBarItemPressed.publish();
                                            }}
                                        >
                                            <item.component />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </VStack>
                </ScrollView>
            </VStack>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRightWidth: 0.5,
        backgroundColor: LeafColors.screenBackgroundLight.getColor(),
        borderColor: LeafColors.sideBarBorderLight.getColor(),
    },
    title: {
        textAlign: 'center', 
        paddingVertical: 16,
    },
    searchBarWrapper: {
        paddingBottom: 16
    },
    sidebarItemWrapper: { }
})