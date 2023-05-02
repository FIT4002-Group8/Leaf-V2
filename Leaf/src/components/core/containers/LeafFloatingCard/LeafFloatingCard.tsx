import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import LeafColor from '../../styles/color/LeafColor';
import Environment from '../../../../state/environment/Environment';
import { OS } from '../../../../state/environment/types/OS';

interface Props {
    color: LeafColor;
    onPress?: () => void | null;
    children; // No type - can be any component
    style?: ViewStyle;
}

const LeafFloatingCard: React.FC<Props> = ({ 
    color,
    onPress = null,
    children,
    style,
}) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={onPress == null}>
            <View 
                style={[
                    styles.container,
                    { backgroundColor: color.getColor() },
                    style,
                ]}
            >
                {children}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        // Shadows appear sligntly differnt on web
        shadowOpacity: Environment.instance.getOS() == OS.web ? 0.23 : 0.18,
        shadowRadius: Environment.instance.getOS() == OS.web ? 12 : 7,
    }
});

export default LeafFloatingCard;