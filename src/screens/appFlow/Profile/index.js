import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { appImages } from '../../../services/utilities/assets';
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, fontFamily, endPoints, fontPixel, hp, routes, wp } from '../../../services'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDown from '../../../components/dropDown';
import BackButton from '../../../components/BackOption';
import CountryDropDown from '../../../components/countryDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { familiesProfileSave, profileSaved, SaveInsertRData } from '../../../redux/Slices/userDataSlice';
import ProfileDropDownForFamilies from '../../../components/profileDropDownForFamilies';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const preDefinedArray = [
    { id: 1, nombre_pais: 'Seleccionar parentesco' },
    { id: 2, nombre_pais: 'Hijo/a' },
    { id: 3, nombre_pais: 'Hermano/a' },
    { id: 4, nombre_pais: 'Padre' },
    { id: 5, nombre_pais: 'Madre' },
    { id: 6, nombre_pais: 'Tutor' },
    { id: 7, nombre_pais: 'Otro' },
]

const Profile = (props) => {
    const dispatch = useDispatch()
    const inputRefs = useRef([]);
    inputRefs.current = new Array(8).fill(null);

    const getCountry = useSelector(state => state?.userData?.Paises)
    const getProfile = useSelector(state => state?.userData?.profileSave)
    const getFamilyProfile = useSelector(state => state?.userData?.FamiliesProfileSave)
    const Fuerza = useSelector(state => state.userData.Fuerza)
    const Municipios = useSelector(state => state?.userData?.Municipios)
    const user = useSelector(state => state.userData.userData)
    const forwardData = useSelector(state => state.userData.forwardData)
    const puestisADisposicion = useSelector(state => state.userData.puestisADisposicion)
    const InsertRData = useSelector(state => state.userData.InsertRData)

    const [dropDownCountry, setDropDownCountry] = useState(preDefinedArray[0])
    const [country, setCountry] = useState(props?.route?.params?.country ? props?.route?.params?.country : '')
    const [typeValue, setTypeValue] = React.useState(props?.route?.params?.country ? props?.route?.params?.country : '')
    const [isChecked, setChecked] = useState(false);
    const [input, setShowInput] = useState(false);
    const [hidePlaceholder, setHidePlaceholder] = useState(true);
    const [isMuje, setMuje] = useState(false);
    const [isEmbarazada, setEmbarazada] = useState(false);
    const [numbre, setnombre] = useState("");
    const [appellidos, setAppellidos] = useState("");
    const [inputs, setInputs] = useState(["", "", "", "", "", "", "", ""]);

    // Get unique oficinaR Value from GET Fuerza API
    const uniqueOffices = [...new Set(Municipios.map(item => item.estado))];
    // const uniqueOffices = [...new Set(Fuerza.map(item => item.oficinaR))];

    useEffect(() => {
        if (props?.route?.params?.item) {
            setAppellidos(props?.route?.params?.item?.apellidos)
            setCountry(props?.route?.params?.item?.nacionalidad)
            setTypeValue(props?.route?.params?.item?.nacionalidad)
            setnombre(props?.route?.params?.item?.nombre)
            setDropDownCountry({ nombre_pais: props?.route?.params?.item?.parentesco })
            setChecked(props?.route?.params?.item?.sexo === 'Homebre' ? true : false)
            setMuje(props?.route?.params?.item?.sexo === 'Homebre' ? false : true)
            setEmbarazada(props?.route?.params?.item?.embarazo)
            const dateArray = props?.route?.params?.item?.edad
            if (dateArray && dateArray.length > 0) {
                setShowInput(false)
                setHidePlaceholder(false)
                setInputs([dateArray[8], dateArray[9], dateArray[5], dateArray[6], dateArray[0], dateArray[1], dateArray[2], dateArray[3]])
            }
        }
    }, [props?.route?.params?.item])

    const handleTextChange = (text, index) => {
        const newInputs = [...inputs];
        text = text.replace(/[^0-9]/g, ''); // First, ensure only numbers are inputted

        if (!text && index > 0 && inputs[index] === '') {
            // Focus on the previous input if the current one is already empty and the user tries to delete
            newInputs[index - 1] = ''; // Optionally clear the previous input
            setInputs(newInputs);
            inputRefs.current[index - 1].focus();
        } else {

            // Validate day, month, and year based on index
            if ((index === 0 || index === 1) && text) {
                // Combine values to form the day and validate
                const day = index === 0 ? text + inputs[1] : inputs[0] + text;
                if (parseInt(day, 10) > 31) return; // If day is invalid, stop execution
            } else if ((index === 2 || index === 3) && text) {
                // Combine values to form the month and validate
                const month = index === 2 ? text + inputs[3] : inputs[2] + text;
                if (parseInt(month, 10) > 12) return; // If month is invalid, stop execution
            } else if (index >= 4 && text) {
                const currentYear = new Date().getFullYear();
                if (index === 4 && text !== '1' && text !== '2') {
                    return;
                }
                if (index === 5) {
                    const firstDigit = inputs[4];
                    if (firstDigit === '1' && text !== '9') return;
                    if (firstDigit === '2' && text !== '0') return;
                }
                if (index === 6) {
                    const prefix = inputs[4] + inputs[5];
                    if (prefix === '19' && parseInt(text, 10) < 2) return;
                    if (prefix === '20' && parseInt(text, 10) > Math.floor((currentYear % 100) / 10)) return;
                }
                if (index === 7) {
                    const yearVal = parseInt(inputs[4] + inputs[5] + inputs[6] + text, 10);
                    if (yearVal < 1920 || yearVal > currentYear) return;
                }
            }

            // Normal behavior for text input
            newInputs[index] = text;
            setInputs(newInputs);

            if (text && index < 7) {
                // Automatically move to the next input if this isn't the last input and text is not empty
                inputRefs.current[index + 1].focus();
            } else {
                if (text) {
                    setShowInput(false); // Assuming this is to hide the input after the last entry
                }
            }
        }
    };
    // Function to convert month number to month name
    const getMonthName = () => {
        // Assuming you want to concatenate the values at index 2 and index 5
        const combinedString = inputs[2] + inputs[3];

        // Convert the combined string to a number
        const combinedNumber = parseInt(combinedString, 10);

        const monthNames = [
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];
        // Adjusting for array index starting at 0, month number starting at 1
        return monthNames[combinedNumber - 1];
    };

    // Automatically focus on the first input initially
    useEffect(() => {
        inputRefs?.current[0]?.focus();
    }, []);

    const handleDateClick = () => {
        // Add logic to change date format color or any other action
        console.log('Date clicked!');
        setShowInput(true)
        setHidePlaceholder(false)
    };

    const isEmpty = () => {
        return inputs.every((element) => element === "");
    };
    // Usage
    const isEmptyInputs = isEmpty(inputs);

    const sendData = async () => {
        const Data = {
            id:
                props?.route?.params?.key == 'Familia'
                    ? (getFamilyProfile
                        ? props?.route?.params?.id
                            ? props?.route?.params?.id
                            : props?.route?.params?.id == 0 ? props?.route?.params?.id : getFamilyProfile.length
                        : 0)
                    : (getProfile
                        ? getProfile.length
                        : 0),
            FamiliaId: (getFamilyProfile
                ? getFamilyProfile.length
                : 0),
            'nacionalidad': country,
            'iso3': country ? (getCountry.find(couny => couny.nombre_pais.toLowerCase() === country.toLowerCase())?.iso3 || "") : "",
            'nombre': numbre,
            'apellidos': appellidos,
            'noIdentidad': "",
            'parentesco': props?.route?.params?.key == 'Familia' ? dropDownCountry?.nombre_pais : "",
            'fechaNacimiento': inputs[4] + inputs[5] + inputs[6] + inputs[7] + '-' + inputs[2] + inputs[3] + '-' + inputs[0] + inputs[1],
            'sexo': isChecked ? 'Homebre' : 'Mujer',
            'embarazo': isEmbarazada,
            'numFamilia': "",
            'edad': inputs[4] + inputs[5] + inputs[6] + inputs[7] + '-' + inputs[2] + inputs[3] + '-' + inputs[0] + inputs[1],
        }

        if (country && numbre != "" && appellidos != "" && !isEmptyInputs && (isChecked || isMuje)) {
            if (props?.route?.params?.key == 'Familia') {
                if (getFamilyProfile != null) {
                    var newAFamilyrray = [...getFamilyProfile]
                    const getId = newAFamilyrray.findIndex(i => i?.FamiliaId == props?.route?.params?.item?.FamiliaId)
                    if (getId !== -1) {
                        newAFamilyrray[getId] = Data;
                    } else {
                        newAFamilyrray.push(Data)
                    }
                    dispatch(familiesProfileSave(newAFamilyrray))
                } else {
                    dispatch(familiesProfileSave([Data]))
                }
                props.navigation.goBack();
            } else {
                if (getProfile != null) {
                    var newArray = [...getProfile]
                    const getId = newArray.findIndex(i => i?.id == props?.route?.params?.item?.id && (i?.nacionalidad == props?.route?.params?.item?.nacionalidad))
                    if (getId !== -1) {
                        newArray[getId] = Data;
                    } else {
                        newArray.push(Data)
                    }
                    dispatch(profileSaved(newArray))
                } else {
                    dispatch(profileSaved([Data]))
                }
                props.navigation.goBack();
            }

            sendDataToServer()
        } else {
            Alert.alert('Datos incorrectos')
        }

    }

    // Data send to Server
    const sendDataToServer = async () => {
        try {
            var fechaN = '' + inputs[0] + inputs[1] + '/' + inputs[2] + inputs[3] + '/' + inputs[4] + inputs[5] + inputs[6] + inputs[7]

            var dia = parseInt(inputs[0] + inputs[1])
            var mes = parseInt(inputs[2] + inputs[3])
            var año = parseInt(inputs[4] + inputs[5] + inputs[6] + inputs[7])

            var hoy = new Date();
            let edad = hoy.getFullYear() - año;
            const mesActual = hoy.getMonth() + 1;
            const diaActual = hoy.getDate();
            if (mes > mesActual || (mes === mesActual && dia > diaActual)) {
                edad--;
            }

            var infof = parseInt((new Date()).getFullYear() - parseInt(inputs[4] + inputs[5] + inputs[6] + inputs[7]))


            console.log("edad ", infof)
            const dataObject = {
                "oficinaRepre": uniqueOffices[user?.estado - 1],
                "fecha": moment(new Date()).format('DD-MM-YY'),
                'hora': moment(new Date()).format('HH:mm'),
                'nombreAgente': user?.nombre?.toUpperCase() + " " + user?.apellido?.toUpperCase(),

                'aeropuerto': forwardData?.DropDownSelected == 'Aeropuerto' ? true : false,
                'carretero': forwardData?.DropDownSelected == 'Carretero' ? true : false,
                'tipoVehic': "",
                'lineaAutobus': "",
                'numeroEcono': "",
                'placas': "",

                'vehiculoAseg': false,
                'casaSeguridad': forwardData?.DropDownSelected == 'Disuadidos' ? true : false,
                'centralAutobus': forwardData?.DropDownSelected == 'Central De AutoBuses' ? true : false,

                'ferrocarril': forwardData?.DropDownSelected == 'Ferrocarril' ? true : false,
                'empresa': "",

                'hotel': forwardData?.DropDownSelected == 'Hotel' ? true : false,
                'nombreHotel': "",

                'puestosADispo': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? true : false,
                'juezCalif': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Juez Calificador')[0]?.status : false,
                'reclusorio': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Reclusorio / Cereso')[0]?.status : false,
                'policiaFede': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Policia Federal')[0]?.status : false,
                'dif': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'DIF')[0]?.status : false,
                'policiaEsta': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Policia Estatal')[0]?.status : false,
                'policiaMuni': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Policia Municipal')[0]?.status : false,
                'guardiaNaci': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Guardia Nacional')[0]?.status : false,
                'fiscalia': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Fiscalia')[0]?.status : false,
                'otrasAuto': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Otras autoridades')[0]?.status : false,

                'voluntarios': forwardData?.DropDownSelected == 'Voluntarios' ? true : false,
                'otro': false,

                'presuntosDelincuentes': false,
                'numPresuntosDelincuentes': 0,

                'municipio': (
                    forwardData?.DropDownSelected == 'Casa De Seguridad' ||
                    forwardData?.DropDownSelected == 'Hotel'
                )
                    ? forwardData?.customeInputSelection
                    : "",
                'puntoEstra': (
                    forwardData?.DropDownSelected == 'Aeropuerto' ||
                    forwardData?.DropDownSelected == 'Central De AutoBuses' ||
                    forwardData?.DropDownSelected == 'Carretero' ||
                    forwardData?.DropDownSelected == 'Ferrocarril'
                )
                    ? forwardData?.customeInputSelection
                    : "",

                'nacionalidad': country,
                'iso3': country ? (getCountry.find(couny => couny.nombre_pais.toLowerCase() === country.toLowerCase())?.iso3 || "") : "",
                'nombre': numbre,
                'apellidos': appellidos,
                'noIdentidad': "00",
                'parentesco': props?.route?.params?.key == 'Familia' ? dropDownCountry?.nombre_pais : "",
                'fechaNacimiento': fechaN,
                // 'sexo': isChecked == 'Homebre' ? true : false,
                'sexo': isChecked,
                'embarazo': isEmbarazada,
                'numFamilia': 0,
                'edad': edad,
            }

            if (InsertRData != null) {
                let newArray = [...InsertRData]
                newArray.push(dataObject)
                dispatch(SaveInsertRData(newArray))
            } else {
                dispatch(SaveInsertRData([dataObject]))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProfile = () => {
        Alert.alert(
            "Confirmar",
            "¿Estás seguro de que deseas eliminar este registro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        if (props?.route?.params?.key === 'Familia') {
                            if (getFamilyProfile != null) {
                                const newArray = getFamilyProfile.filter(i => i?.FamiliaId !== props?.route?.params?.item?.FamiliaId);
                                dispatch(familiesProfileSave(newArray));
                            }
                        } else {
                            if (getProfile != null) {
                                const newArray = getProfile.filter(i => !(i?.id === props?.route?.params?.item?.id && i?.nacionalidad === props?.route?.params?.item?.nacionalidad));
                                dispatch(profileSaved(newArray));
                            }
                        }
                        props.navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <WrapperComponent background={colors.white}>
            <SafeAreaView style={styles.mainContainer}>
                <BackButton />
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={styles.container}>
                        {/* User Icon */}
                        <Image source={appImages.profile} style={styles.userIcon} />

                        <View style={{ marginTop: hp(3), zIndex: 1 }}>
                            <CountryDropDown
                                placeholder={'Ingresa el pais'}
                                setCountry={(e) => setCountry(e)}
                                onTypeValue={(e) => setTypeValue(e)}
                                country={typeValue} />
                        </View>

                        <View style={{ marginTop: hp(3) }}>
                            <TextInput
                                value={numbre}
                                onChangeText={(e) => {
                                    if (country != '') {
                                        setnombre(e)
                                    } else {
                                        Alert.alert('Datos incorrectos')
                                    }
                                }}
                                placeholderTextColor={colors.gray_txt}
                                placeholder='Nombre(s):'
                                style={{ height: hp(5), width: wp(80), borderBottomWidth: 2, borderBottomColor: colors.gray_txt, fontSize: fontPixel(16), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        </View>

                        <View style={{ marginTop: hp(3) }}>
                            <TextInput
                                value={appellidos}
                                onChangeText={(e) => {
                                    if (country != '') {
                                        setAppellidos(e)
                                    } else {
                                        Alert.alert('Datos incorrectos')
                                    }
                                }}
                                placeholderTextColor={colors.gray_txt}
                                placeholder='Apellidos:'
                                style={{ height: hp(5), width: wp(80), borderBottomWidth: 2, borderBottomColor: colors.gray_txt, fontSize: fontPixel(16), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        </View>

                        <View style={[styles.container]}>
                            {
                                props?.route?.params?.key == 'Familia' && (
                                    <ProfileDropDownForFamilies country={true} dataArray={preDefinedArray} onSelect={(e) => setDropDownCountry(e)} selected={dropDownCountry} placeholder={'Seleccionar parentesco'} />
                                )
                            }

                            <View style={{ marginTop: hp(1), alignItems: "center" }}>
                                <Text style={styles.text}>Fecha de nacimiento</Text>

                                {
                                    input ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                            {inputs.map((input, index) => (
                                                <React.Fragment key={index}>
                                                    <TextInput
                                                        key={index}
                                                        style={{ width: wp(6), height: hp(5), padding: 0, marginHorizontal: 5, borderBottomWidth: 3, borderBottomColor: inputs[index] ? colors.g : colors.gray_txt, fontSize: fontPixel(20), color: colors.black, fontFamily: fontFamily.appTextBold, textAlign: "center" }}
                                                        onChangeText={(text) => handleTextChange(text, index)}
                                                        value={inputs[index]}
                                                        maxLength={1}
                                                        ref={(el) => (inputRefs.current[index] = el)}
                                                        keyboardType="numeric"
                                                        onKeyPress={({ nativeEvent }) => {
                                                            if (nativeEvent.key === 'Backspace') {
                                                                handleTextChange('', index);
                                                            }
                                                        }}
                                                    />
                                                    {(index === 1 || index === 3) && <Text style={{ fontSize: fontPixel(24), color: colors.grey_Text, fontFamily: fontFamily.appTextBold }}> / </Text>}
                                                </React.Fragment>
                                            ))}
                                        </View>
                                    )
                                        : (
                                            < TouchableOpacity onPress={handleDateClick}>
                                                {
                                                    hidePlaceholder
                                                        ? <Text style={styles.formattedDate}>DD/MM/YYYY</Text>
                                                        : <Text style={styles.formattedDate}>{inputs[0] + inputs[1] + ' ' + getMonthName() + ' ' + inputs[4] + inputs[5] + inputs[6] + inputs[7]}</Text>
                                                }
                                            </TouchableOpacity>
                                        )
                                }

                                {/* CheckBox */}
                                <View style={styles.checkboxContainer}>
                                    <View style={{ marginRight: wp(10), flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], }}>
                                            <CheckBox
                                                boxType='square'
                                                value={isChecked}
                                                tintColors={{ true: colors.green, false: colors.gray_txt }}
                                                onValueChange={() => {
                                                    setChecked(true)
                                                    setMuje(false)
                                                    setEmbarazada(false)
                                                }} />
                                        </View>
                                        <Text style={[styles.checkText]}>Hombre</Text>
                                    </View>

                                    <View style={{ width: wp(35) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], }}>
                                                <CheckBox
                                                    boxType='square'
                                                    value={isMuje}
                                                    tintColors={{ true: colors.green, false: colors.gray_txt }}
                                                    onValueChange={() => {
                                                        setMuje(true)
                                                        setChecked(false)
                                                    }} />
                                            </View>
                                            <Text style={[styles.checkText]}>Mujer</Text>
                                        </View>
                                        {
                                            isMuje && (
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <View style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], }}>
                                                        <CheckBox boxType='square' value={isEmbarazada} tintColors={{ true: colors.green, false: colors.gray_txt }} onValueChange={() => setEmbarazada(!isEmbarazada)} />
                                                    </View>
                                                    <Text style={[styles.checkText]}>Embarazada</Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp(80), marginTop: hp(2), marginBottom: hp(2) }}>
                                {props?.route?.params?.item && (
                                    <TouchableOpacity onPress={deleteProfile} style={[styles.buttoncontainer, { borderColor: 'red' }]}>
                                        <View style={[styles.rightView, { marginLeft: wp(2), marginRight: wp(2) }]}>
                                            <Text style={{ fontSize: fontPixel(16), color: 'red', fontFamily: fontFamily.appTextBold }}>{'ELIMINAR'}</Text>
                                        </View>
                                        <View style={[{ borderRadius: wp(5), backgroundColor: 'red', padding: 6 }]}>
                                            <MaterialCommunityIcons name="delete" size={30} color="#fff" />
                                        </View>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => sendData()} style={[styles.buttoncontainer, { borderColor: colors.redishColor, marginLeft: props?.route?.params?.item ? wp(5) : 0 }]}>
                                    <View style={[styles.rightView, { marginLeft: wp(2), marginRight: wp(2) }]}>
                                        <Text style={{ fontSize: fontPixel(16), color: colors.redishColor, fontFamily: fontFamily.appTextBold }}>{'GUARDAR'}</Text>
                                    </View>
                                    <View style={[{ borderRadius: wp(5), backgroundColor: colors.redishColor, padding: 6 }]}>
                                        <MaterialCommunityIcons name="content-save" size={30} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </WrapperComponent>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: "center",
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    userIcon: {
        height: hp(18),
        resizeMode: 'contain',
    },
    text: {
        marginVertical: 10,
        fontSize: fontPixel(20),
        color: colors.grey_Text,
        fontFamily: fontFamily.appTextMedium,
    },
    checkText: {
        marginVertical: 10,
        fontSize: fontPixel(14),
        fontFamily: fontFamily.appTextMedium,
        color: colors.grey_Text,
    },
    formattedDate: {
        fontSize: fontPixel(24),
        letterSpacing: wp(2),
        color: colors.grey_Text,
        fontFamily: fontFamily.appTextBold,
        textAlign: "center"
        // textDecorationLine: 'underline',
    },
    underlineContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    underline: {
        borderBottomWidth: 1,
        flex: 1,
        marginRight: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: wp(2)
    },
    buttoncontainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        borderWidth: 3,
        // width: wp(20),
        borderRadius: wp(5)
    },
    rightView: {
        // flex: 1,
    },
});

export default Profile;
