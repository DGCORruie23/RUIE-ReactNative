import { StyleSheet, Text, SafeAreaView, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, endPoints, getEndPoints, fontFamily, fontPixel, hp, routes, wp } from '../../../services'
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import appStyles from '../../../services/utilities/appStyles';
import BackButton from '../../../components/BackOption';
import CountryDropDown from '../../../components/countryDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { DaltosRapid, SaveInsertCData } from '../../../redux/Slices/userDataSlice';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";

export default function GUARDAR(props) {
    const dispatch = useDispatch()
    const getDaltosRapid = useSelector(state => state?.userData?.daltosRapid)
    const getCountry = useSelector(state => state?.userData?.Paises)
    const Fuerza = useSelector(state => state.userData.Fuerza)
    const Municipios = useSelector(state => state?.userData?.Municipios)
    const user = useSelector(state => state.userData.userData)
    const forwardData = useSelector(state => state.userData.forwardData)
    const puestisADisposicion = useSelector(state => state.userData.puestisADisposicion)
    const InsertCData = useSelector(state => state.userData.InsertCData)
    const serverUrl = useSelector(state => state?.userData?.serverUrl)
    const currentEndPoints = getEndPoints(serverUrl)

    // Get unique oficinaR Value from GET Fuerza API
    const uniqueOffices = [...new Set(Municipios.map(item => item.estado))];

    const [adultos, setAdultos] = useState('')
    const [country, setCountry] = React.useState('')
    const [typeValue, setTypeValue] = React.useState('')
    const [input1, setInput1] = React.useState('')
    const [input2, setInput2] = React.useState('')
    const [input3, setInput3] = React.useState('')
    const [input4, setInput4] = React.useState('')
    const [input5, setInput5] = React.useState('')
    const [input6, setInput6] = React.useState('')
    const [input7, setInput7] = React.useState('')
    const [input8, setInput8] = React.useState('')
    const [input9, setInput9] = React.useState('')
    const [input10, setInput10] = React.useState('')
    const [input11, setInput11] = React.useState('')
    const [input12, setInput12] = React.useState('')


    const sendData = () => {
        if (country !== '') {
            const valAdultos = adultos === '' ? '0' : adultos;
            const valInput1 = input1 === '' ? '0' : input1;
            const valInput2 = input2 === '' ? '0' : input2;
            const valInput3 = input3 === '' ? '0' : input3;
            const valInput4 = input4 === '' ? '0' : input4;
            const valInput5 = input5 === '' ? '0' : input5;
            const valInput6 = input6 === '' ? '0' : input6;
            const valInput7 = input7 === '' ? '0' : input7;
            const valInput8 = input8 === '' ? '0' : input8;
            const valInput9 = input9 === '' ? '0' : input9;
            const valInput10 = input10 === '' ? '0' : input10;
            const valInput11 = input11 === '' ? '0' : input11;
            const valInput12 = input12 === '' ? '0' : input12;

            const dataObject = {
                nacionalidad: country,
                AS_hombres: valInput1,
                AS_mujeresNoEmb: valInput2,
                AS_mujeresEmb: valInput3,
                AA_hombres: valInput4,
                AA_mujeresNoEmb: valInput5,
                AA_mujeresEmb: valInput6,
                nucleosfamiliares: valAdultos,
                NNA_A_hombres: valInput7,
                NNA_A_mujeresNoEmb: valInput8,
                NNA_A_mujeresEmb: valInput9,
                NNA_S_hombres: valInput10,
                NNA_S_mujeresNoEmb: valInput11,
                NNA_S_mujeresEmb: valInput12
            };

            if (getDaltosRapid != null) {
                var newArray = [...getDaltosRapid]
                if (props?.route?.params?.indexKey !== undefined) {
                    newArray[props?.route?.params?.indexKey] = dataObject;
                } else {
                    newArray.push(dataObject)
                }
                dispatch(DaltosRapid(newArray))
            } else {
                dispatch(DaltosRapid([dataObject]))
            }

            props.navigation.navigate(routes.fileCheck, { selectedValue: props?.route?.params?.selectedValue, selected: props?.route?.params?.selected })

            sendDataToServer(dataObject)
        }
        else {
            Alert.alert('LLENAR PARA CONTINUAR', 'Por favor selecciona un país.');
        }
    }

    const sendDataToServer = async (resolvedObj) => {
        try {
            const parsedAdultos = parseInt(resolvedObj.nucleosfamiliares) || 0;
            const parsedAS_h = parseInt(resolvedObj.AS_hombres) || 0;
            const parsedAS_m = parseInt(resolvedObj.AS_mujeresNoEmb) || 0;
            const parsedAS_me = parseInt(resolvedObj.AS_mujeresEmb) || 0;
            const parsedAA_h = parseInt(resolvedObj.AA_hombres) || 0;
            const parsedAA_m = parseInt(resolvedObj.AA_mujeresNoEmb) || 0;
            const parsedAA_me = parseInt(resolvedObj.AA_mujeresEmb) || 0;
            const parsedNNA_Ah = parseInt(resolvedObj.NNA_A_hombres) || 0;
            const parsedNNA_Am = parseInt(resolvedObj.NNA_A_mujeresNoEmb) || 0;
            const parsedNNA_Ame = parseInt(resolvedObj.NNA_A_mujeresEmb) || 0;
            const parsedNNA_Sh = parseInt(resolvedObj.NNA_S_hombres) || 0;
            const parsedNNA_Sm = parseInt(resolvedObj.NNA_S_mujeresNoEmb) || 0;
            const parsedNNA_Sme = parseInt(resolvedObj.NNA_S_mujeresEmb) || 0;

            const estadoIndex = parseInt(user?.estado, 10);
            const oficinaRepreVal = (!isNaN(estadoIndex) && uniqueOffices[estadoIndex - 1])
                ? uniqueOffices[estadoIndex - 1]
                : (uniqueOffices[0] || "OFICINA_NO_ESPECIFICADA");

            const dataObject = {
                "oficinaRepre": oficinaRepreVal,
                "fecha": moment(new Date()).format('DD-MM-YY'),
                'hora': moment(new Date()).format('HH:mm'),
                'nombreAgente': user?.nombre?.toUpperCase() + " " + user?.apellido?.toUpperCase(),

                'aeropuerto': forwardData?.DropDownSelected == 'Aeropuerto' ? true : false,
                'carretero': (forwardData?.DropDownSelected == 'Carretero' || forwardData?.DropDownSelected == 'Caravana') ? true : false,
                'tipoVehic': "",
                'lineaAutobus': "",
                'numeroEcono': forwardData?.DropDownSelected == 'Caravana' ? (forwardData?.caravanaName || "").substring(0, 49) : "",
                'placas': "",

                'vehiculoAseg': forwardData?.DropDownSelected == 'Caravana' ? true : false,
                'casaSeguridad': forwardData?.DropDownSelected == 'Disuadidos' ? true : false,
                'centralAutobus': forwardData?.DropDownSelected == 'Central de autobús' ? true : false,

                'ferrocarril': forwardData?.DropDownSelected == 'Ferroviario' ? true : false,
                'empresa': "",
                'compartimento': "",
                'concesionario': "",

                'hotel': forwardData?.DropDownSelected == 'Hotel/A.V./C.S.' ? true : false,
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
                    forwardData?.DropDownSelected == 'Hotel/A.V./C.S.'
                )
                    ? forwardData?.customeInputSelection
                    : "",
                'puntoEstra': (
                    forwardData?.DropDownSelected == 'Aeropuerto' ||
                    forwardData?.DropDownSelected == 'Central de autobús' ||
                    forwardData?.DropDownSelected == 'Carretero' ||
                    forwardData?.DropDownSelected == 'Ferroviario' ||
                    forwardData?.DropDownSelected == 'Puestos a Disposicion' ||
                    forwardData?.DropDownSelected == 'Voluntarios' ||
                    forwardData?.DropDownSelected == 'Caravana'
                )
                    ? forwardData?.customeInputSelection
                    : "",

                'nacionalidad': country,
                'iso3': country ? (getCountry.find(couny => couny.nombre_pais.toLowerCase() === country.toLowerCase()) || { iso3: "" }).iso3 : "",
                "AS_hombres": parsedAS_h,
                "AS_mujeresNoEmb": parsedAS_m,
                "AS_mujeresEmb": parsedAS_me,
                "nucleosFamiliares": parsedAdultos,
                "AA_hombres": parsedAA_h,
                "AA_mujeresNoEmb": parsedAA_m,
                "AA_mujeresEmb": parsedAA_me,
                "NNA_A_hombres": parsedNNA_Ah,
                "NNA_A_mujeresNoEmb": parsedNNA_Am,
                "NNA_A_mujeresEmb": parsedNNA_Ame,
                "NNA_S_hombres": parsedNNA_Sh,
                "NNA_S_mujeresNoEmb": parsedNNA_Sm,
                "NNA_S_mujeresEmb": parsedNNA_Sme
            }

            await NetInfo.fetch()
                .then(state => {
                    console.log("Net Check Response", state)
                    if (state.isConnected) {
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");

                        var raw = JSON.stringify([dataObject]);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        fetch(`${currentEndPoints.InsertC}`, requestOptions)
                            .then(response => response.json())
                            .then(result => console.log("result", result))
                            .catch(error => console.log('error', error));
                    } else {
                        if (InsertCData != null) {
                            let newArray = [...InsertCData]
                            newArray.push(dataObject)
                            dispatch(SaveInsertCData(newArray))
                        } else {
                            dispatch(SaveInsertCData([dataObject]))
                        }
                    }
                })
                .catch((error) => {
                    console.log("Net Check error", error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (props?.route?.params?.item) {
            setCountry(props?.route?.params?.item?.nacionalidad)
            setTypeValue(props?.route?.params?.item?.nacionalidad)
            setInput1(props?.route?.params?.item?.AS_hombres)
            setInput2(props?.route?.params?.item?.AS_mujeresNoEmb)
            setInput3(props?.route?.params?.item?.AS_mujeresEmb)
            setAdultos(props?.route?.params?.item?.nucleosfamiliares)
            setInput4(props?.route?.params?.item?.AA_hombres)
            setInput5(props?.route?.params?.item?.AA_mujeresNoEmb)
            setInput6(props?.route?.params?.item?.AA_mujeresEmb)
            setInput7(props?.route?.params?.item?.NNA_A_hombres)
            setInput8(props?.route?.params?.item?.NNA_A_mujeresNoEmb)
            setInput9(props?.route?.params?.item?.NNA_A_mujeresEmb)
            setInput10(props?.route?.params?.item?.NNA_S_hombres)
            setInput11(props?.route?.params?.item?.NNA_S_mujeresNoEmb)
            setInput12(props?.route?.params?.item?.NNA_S_mujeresEmb)
        }
    }, [])

    return (
        <WrapperComponent background={colors.white}>
            <SafeAreaView style={styles.mainContainer}>
                <BackButton />
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} contentContainerStyle={appStyles.scrollContainer}>
                    <View style={{ zIndex: 1 }}>
                        <CountryDropDown
                            placeholder={'Ingresa Nacionalidad'}
                            setCountry={(e) => setCountry(e)}
                            onTypeValue={(e) => setTypeValue(e)}
                            country={typeValue}
                        />
                        <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'Adultos No Acompañados'}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ alignItems: "center" }}>
                                <Entypo size={40} name='man' color={colors.green} />
                                <TextInput
                                    value={input1}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput1(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Hombres'
                                    style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <MaterialIcons size={40} name='woman' color={colors.green} />
                                <TextInput
                                    value={input2}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput2(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Mujeres no Embarazadas'
                                    style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>

                        </View>
                        <View style={{ alignItems: "center" }}>
                            <MaterialIcons size={40} name='pregnant-woman' color={colors.green} />
                            <TextInput
                                value={input3}
                                keyboardType='number-pad'
                                onChangeText={(text) => setInput3(text)}
                                placeholderTextColor={colors.gray_txt}
                                placeholder='Mujeres Embarazada'
                                style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        </View>
                    </View>

                    <View>
                        <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'Numero de Nucleos Familiares'}</Text>
                        <TextInput
                            value={adultos}
                            keyboardType='number-pad'
                            placeholder=''
                            onChangeText={(text) => {
                                setAdultos(text)

                                if (text.length === 1 && text[0] === '0') {
                                    setInput4('0')
                                    setInput5('0')
                                    setInput6('0')
                                    setInput7('0')
                                    setInput8('0')
                                    setInput9('0')
                                } else {
                                    setInput4('')
                                    setInput5('')
                                    setInput6('')
                                    setInput7('')
                                    setInput8('')
                                    setInput9('')
                                }
                                setAdultos(text)
                            }}
                            style={{ textAlign: "center", alignSelf: "center", height: hp(5), width: wp(30), borderBottomWidth: 2, borderBottomColor: colors.green, fontSize: fontPixel(16), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        {
                            (adultos > 0) && (
                                <>
                                    <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'Adultos que Acompañan NNas'}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <View style={{ alignItems: "center" }}>
                                            <Entypo size={40} name='man' color={colors.light_blue} />
                                            <TextInput
                                                value={input4}
                                                keyboardType='number-pad'
                                                onChangeText={(text) => setInput4(text)}
                                                placeholderTextColor={colors.gray_txt}
                                                placeholder='Hombres'
                                                style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                        </View>
                                        <View style={{ alignItems: "center" }}>
                                            <MaterialIcons size={40} name='woman' color={colors.light_blue} />
                                            <TextInput
                                                value={input5}
                                                keyboardType='number-pad'
                                                onChangeText={(text) => setInput5(text)}
                                                placeholderTextColor={colors.gray_txt}
                                                placeholder='Mujeres no Embarazadas'
                                                style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                        </View>

                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <MaterialIcons size={40} name='pregnant-woman' color={colors.light_blue} />
                                        <TextInput
                                            value={input6}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => setInput6(text)}
                                            placeholderTextColor={colors.gray_txt}
                                            placeholder='Mujeres Embarazada'
                                            style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                    </View>
                                </>
                            )
                        }
                    </View>

                    {
                        (adultos > 0) && (
                            <View>
                                <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'NNAs Acompañados'}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ alignItems: "center" }}>
                                        <Entypo size={40} name='man' color={colors.redishColor} />
                                        <TextInput
                                            value={input7}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => setInput7(text)}
                                            placeholderTextColor={colors.gray_txt}
                                            placeholder='Hombres'
                                            style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <MaterialIcons size={40} name='woman' color={colors.redishColor} />
                                        <TextInput
                                            value={input8}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => setInput8(text)}
                                            placeholderTextColor={colors.gray_txt}
                                            placeholder='Mujeres no Embarazadas'
                                            style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                    </View>
                                </View>
                                <View style={{ alignItems: "center" }}>
                                    <MaterialIcons size={40} name='pregnant-woman' color={colors.redishColor} />
                                    <TextInput
                                        value={input9}
                                        keyboardType='number-pad'
                                        onChangeText={(text) => setInput9(text)}
                                        placeholderTextColor={colors.gray_txt}
                                        placeholder='Mujeres Embarazada'
                                        style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                </View>
                            </View>
                        )
                    }

                    <View>
                        <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'NNAs No Acompañados'}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ alignItems: "center" }}>
                                <Entypo size={40} name='man' color={colors.grey_Text} />
                                <TextInput
                                    value={input10}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput10(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Hombres'
                                    style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <MaterialIcons size={40} name='woman' color={colors.grey_Text} />
                                <TextInput
                                    value={input11}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput11(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Mujeres no Embarazadas'
                                    style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <MaterialIcons size={40} name='pregnant-woman' color={colors.grey_Text} />
                            <TextInput
                                value={input12}
                                keyboardType='number-pad'
                                onChangeText={(text) => setInput12(text)}
                                placeholderTextColor={colors.gray_txt}
                                placeholder='Mujeres Embarazada'
                                style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => sendData()} style={{ backgroundColor: colors.redishColor, margin: wp(10), alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                        <Text style={{ textAlign: "center", borderRadius: wp(2), marginVertical: wp(3), marginHorizontal: wp(5), fontSize: fontPixel(14), fontFamily: fontFamily.appTextBold }}>{'GUARDAR'}</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </WrapperComponent>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainTitle: {
        textAlign: 'center',
        alignSelf: "center",
        width: wp(90),
        fontSize: fontPixel(26),
        color: colors.grey_Text,
        fontFamily: fontFamily.appTextSemiBold,
    },
})

