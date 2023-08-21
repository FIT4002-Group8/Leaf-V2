import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import HStack from '../../containers/HStack';
import VStack from '../../containers/VStack';
import LeafColor from '../../styling/color/LeafColor';
import LeafColors from '../../styling/LeafColors';
import LeafTypography from '../../styling/LeafTypography';
import LeafTypographyConfig from '../../styling/typography/LeafTypographyConfig';
import LeafIcon from '../LeafIcon/LeafIcon';
import LeafText from '../LeafText/LeafText';

interface Props<T> {
    options: T[];
    optionToString: (option: T) => string;
    header: string;
    noneOption?: boolean;
    height?: number;
    borderColor?: LeafColor;
    backgroundColor?: LeafColor;
    selectedTypography?: LeafTypographyConfig;
    optionTypography?: LeafTypographyConfig;
}

/**
 * Be careful when using. If you wrap this in another view, the parent view must have a zIndex heigher than any other children of the same level.
 * Otherwise the options will be rendered behind the other views.
 * @param param0 
 * @returns 
 */
function LeafDropDown<T>({
    options,
    optionToString,
    header,
    noneOption = true,
    borderColor = LeafColors.accent,
    backgroundColor = LeafColors.screenBackgroundLight,
    height = 50,
    selectedTypography = LeafTypography.title4,
    optionTypography = LeafTypography.body
}: Props<T>){

    const borderWidth = 2;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(undefined);
    const [icon, setIcon] = useState("chevron-down");
    const changeIcon = () => {
        setIcon(icon == "chevron-down" ? "chevron-up" : "chevron-down");
    }

    return (
        <View
            style={{
                zIndex: 1,
                flex: 1
            }}
        >
            <VStack>
                <LeafText typography={LeafTypography.subscript}>{header}</LeafText>
                    <View 
                        style={{ 
                            height: height, 
                            width: "100%",
                            borderColor: borderColor.getColor(), 
                            justifyContent: 'center', 
                            borderRadius: 20 
                        }}
                    >
                        <TouchableOpacity 
                            onPress={(_) => {
                                setIsOpen(!isOpen);
                                changeIcon();
                            }}
                        >
                            <HStack
                                style={{
                                    alignItems: "center"
                                }}
                                spacing={5}
                            >
                                <LeafText wide={false} typography={selectedTypography}>{optionToString(selectedValue) || 'Select an option'}</LeafText>
                                <LeafIcon icon={icon} color={selectedTypography.leafColor} size={20}/>
                            </HStack>
                        </TouchableOpacity>

                        {isOpen && (
                            <View style={{
                                position: 'absolute',
                                width: "100%",
                                top: height - borderWidth*2,
                                borderWidth: borderWidth,
                                borderColor: borderColor.getColor(),
                                backgroundColor: backgroundColor.getColor(),
                                borderRadius: 20
                            }}>
                                <ScrollView
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    {options.map((option, index) => (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={{ 
                                                paddingHorizontal: 20,
                                                paddingVertical: 10,
                                                backgroundColor: backgroundColor.getColor(),
                                                borderRadius: 20,
                                                borderColor: borderColor.getColor()
                                            }} 
                                            onPress={() => {
                                                changeIcon();
                                                setSelectedValue(option);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <LeafText typography={optionTypography}>{optionToString(option)}</LeafText>
                                        </TouchableOpacity>
                                    ))}
                                    {/* None option */}
                                    {
                                        !noneOption ? null : (
                                            <TouchableOpacity 
                                                style={{ 
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 10,
                                                    backgroundColor: backgroundColor.getColor(),
                                                    borderRadius: 20
                                                }} 
                                                onPress={() => {
                                                    changeIcon()
                                                    setSelectedValue(undefined);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <LeafText typography={optionTypography}>None</LeafText>
                                            </TouchableOpacity>
                                        )
                                    }
                                </ScrollView>
                            </View>
                        )}
                    </View>
            </VStack>
        </View>
    )
}

export default LeafDropDown;
