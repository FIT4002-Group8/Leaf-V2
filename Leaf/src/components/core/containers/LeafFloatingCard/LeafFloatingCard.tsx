import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import LeafColor from '../../styles/color/LeafColor';

interface Props {
    color: LeafColor;
    children; // No type - can be any component
    style?: ViewStyle;
}

const LeafFloatingCard: React.FC<Props> = ({ 
    color,
    children,
    style,
}) => {
    return (
        <View 
            style={[
                styles.container,
                { backgroundColor: color.getColor() },
                style,
            ]}
        >
            {children}
        </View>
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
        shadowOpacity: 0.18,
        shadowRadius: 7,
    }
});

export default LeafFloatingCard;