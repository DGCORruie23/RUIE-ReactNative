import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { colors, fontFamily, fontPixel, hp, wp } from '../../services';
import Entypo from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from 'react-redux';
import { SavePuestisADisposicion } from '../../redux/Slices/userDataSlice';

const dataArray = [
    { "id": "Juez Calificador", "status": false },
    { "id": "Reclusorio / Cereso", "status": false },
    { "id": "Policia Federal", "status": false },
    { "id": "DIF", "status": false },
    { "id": "Policia Estatal", "status": false },
    { "id": "Policia Municipal", "status": false },
    { "id": "Guardia Nacional", "status": false },
    { "id": "Fiscalia", "status": false },
    { "id": "Otras autoridades", "status": false }
]

const PopupMenu = (props) => {

    const dispatch = useDispatch()
    const puestisADisposicion = useSelector(state => state?.userData?.puestisADisposicion)

    const [checkboxState, setCheckboxState] = useState(puestisADisposicion != null ? puestisADisposicion : dataArray);

    const toggleCheckbox = (id) => {
        const updatedItems = checkboxState.map(item => {
            if (item.id === id) {
                return { ...item, status: !item.status };
            }
            return item;
        });
        setCheckboxState(updatedItems);
    };

    const ConfirmSave = () => {
        dispatch(SavePuestisADisposicion(checkboxState))
        props.onclose()
    }

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
                        <FlatList
                            data={checkboxState}
                            keyExtractor={(item, index) => index}
                            ListHeaderComponent={
                                <View>
                                    <Entypo
                                        onPress={props.onclose}
                                        size={wp(10)}
                                        name='cross'
                                        color={colors.brownishColor}
                                        style={{ zIndex: 1, position: "absolute", right: -10, top: -10 }} />
                                    <Text style={[styles.titletext]}>PUESTOS A DISPOSICION</Text>
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <View key={index} style={{ marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text style={[styles.checkText]}>{item.id}</Text>
                                        <View style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }], }}>
                                            <CheckBox
                                                onTintColor={colors.brownishColor}
                                                onFillColor={colors.brownishColor}
                                                onCheckColor={colors.black}
                                                boxType='square'
                                                value={item.status}
                                                onValueChange={() => toggleCheckbox(item.id)}
                                            />
                                        </View>
                                    </View>
                                )
                            }}

                        />
                        <TouchableOpacity style={styles.saveButton} onPress={() => ConfirmSave()}>
                            <Text style={styles.saveButtonText}>Guardar</Text>
                        </TouchableOpacity>
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
        fontSize: fontPixel(16),
        fontFamily: fontFamily.appTextMedium,
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
        alignSelf: "center",
        width: '60%',
        backgroundColor: colors.brownishColor,
        padding: 10,
        marginTop: 10,
    },
    saveButtonText: {
        fontSize: fontPixel(14),
        fontFamily: fontFamily.appTextBold,
        color: colors.redishColor,
        textAlign: "center",
        textTransform: 'uppercase',
        letterSpacing: 0.5
    }
});

export default PopupMenu;
