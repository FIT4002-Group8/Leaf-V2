import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import LeafButton from '../base/LeafButton/LeafButton';
import {LeafButtonType} from '../base/LeafButton/LeafButtonType';
import LeafTypography from '../styling/LeafTypography';
import LeafColors from '../styling/LeafColors';
import LeafIcon from "../base/LeafIcon/LeafIcon";
import leafColors from "../styling/LeafColors";

interface ExportPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onExport: (title: string, password: string) => void;
}

const ExportPopup: React.FC<ExportPopupProps> = ({isVisible, onClose, onExport}) => {
    const [title, setTitle] = useState('');
    const [password, setPassword] = useState('');

    // Clear inputs when the modal is closed
    useEffect(() => {
        if (!isVisible) {
            setTitle('');
            setPassword('');
        }
    }, [isVisible]);

    const handleExport = () => {
        onExport(title, password);
        onClose();
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Report Details</Text>
                    <LeafIcon
                        icon="close"
                        color={leafColors.textBlack}
                        size={24}
                        onPress={onClose}
                    />
                </View>

                <Text style={styles.label}>Report Title <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Report Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <LeafButton
                    label="Export"
                    icon="file-export"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={handleExport}
                    disabled={!title || !password}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    required: {
        color: 'red',
    },
    input: {
        borderColor: '#dddddd',
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '100%',
    },
    modalContent: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        width: '50%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ExportPopup;
