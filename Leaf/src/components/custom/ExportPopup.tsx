import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import LeafButton from '../base/LeafButton/LeafButton';
import {LeafButtonType} from '../base/LeafButton/LeafButtonType';
import LeafTypography from '../styling/LeafTypography';
import LeafColors from '../styling/LeafColors';
import LeafIcon from "../base/LeafIcon/LeafIcon";
import leafColors from "../styling/LeafColors";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import LeafPasswordInputShort from "../base/LeafPasswordInputShort/LeafPasswordInputShort";
import LeafText from "../base/LeafText/LeafText";
import VGap from "../containers/layout/VGap";
import LeafDimensions from "../styling/LeafDimensions";
import {strings} from "../../localisation/Strings";

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
                    <LeafText typography={LeafTypography.title2} style={{textAlign: "left"}}>
                        {strings("inputLabel.reportDetails")}
                    </LeafText>
                    <LeafIcon
                        icon="close"
                        color={leafColors.textBlack}
                        size={24}
                        onPress={onClose}
                    />
                </View>

                <LeafTextInput
                    label="Report Title"
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={setTitle}
                    valid={!!title}
                />
                <VGap size={LeafDimensions.textInputSpacing} />
                <LeafPasswordInputShort
                    label="Password"
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={setPassword}
                    valid={!!password}
                />
                <VGap size={LeafDimensions.textInputSpacing} />
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

    modalContent: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        width: '50%',
    },
});

export default ExportPopup;
