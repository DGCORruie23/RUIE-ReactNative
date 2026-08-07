import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { colors, fontFamily, fontPixel, hp, wp } from '../../services';
import Entypo from 'react-native-vector-icons/Entypo'

const dataArray = [
    { "id": "Juez Calificador" },
    { "id": "Reclusorio / Cereso" },
    { "id": "Policia Federal" },
    { "id": "DIF" },
    { "id": "Policia Estatal" },
    { "id": "Policia Municipal" },
    { "id": "Guardia Nacional" },
    { "id": "Fiscalia" },
    { "id": "Otras autoridades" }
]

const ConfirmModal = (props) => {
    // State to manage checkbox values
    const [checkboxState, setCheckboxState] = useState({
        juezCalificador: false,
        reclusorio: false,
        policiaFederal: false,
        dif: false,
        policiaEstatal: false,
        policiaMunicipal: false,
        guardiaNacional: false,
        fiscalia: false,
        otrasAutoridades: false,
    });

    const toggleCheckbox = (key) => {
        setCheckboxState({ ...checkboxState, [key]: !checkboxState[key] });
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    props.onclose
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={[styles.checkText]}>{'¿Datos Correctos?'}</Text>

                        <View style={{ marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <TouchableOpacity 
                                style={[styles.saveButton, props.isSubmitting && { opacity: 0.5 }]} 
                                onPress={props.isSubmitting ? null : props.onclose}
                                disabled={props.isSubmitting}
                            >
                                <Text style={styles.saveButtonText}>Revisar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.saveButton, props.isSubmitting && { opacity: 0.5 }]} 
                                onPress={props.isSubmitting ? null : props.onSave}
                                disabled={props.isSubmitting}
                            >
                                <Text style={styles.saveButtonText}>
                                    {props.isSubmitting ? 'Enviando...' : 'Enviar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titletext: {
        fontSize: fontPixel(20),
        fontFamily: fontFamily.appTextSemiBold,
        color: colors.brownishColor,
        textAlign: "center",
        letterSpacing: 0.3
    },
    checkText: {
        fontSize: fontPixel(22),
        fontFamily: fontFamily.appTextSemiBold,
        color: colors.brownishColor,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        backgroundColor: colors.redishColor,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '70%',
    },
    button: {
        backgroundColor: colors.brownishColor,
        padding: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: fontPixel(14),
        fontFamily: fontFamily.appTextBold,
        color: colors.redishColor,
        textAlign: "center",
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    saveButton: {
        borderRadius: 5,
        alignSelf: "center",
        width: '45%',
        backgroundColor: colors.brownishColor,
        padding: 10,
        marginTop: 10,
    },
    saveButtonText: {
        fontSize: fontPixel(12),
        fontFamily: fontFamily.appTextBold,
        color: colors.redishColor,
        textAlign: "center",
        textTransform: 'uppercase',
        letterSpacing: 0.5
    }
});

export default ConfirmModal;
