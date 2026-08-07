import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native'
import React from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, fontFamily, fontPixel, hp, routes, wp, endPoints } from '../../../services'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from '../../../components/BackOption';
import { useDispatch, useSelector } from 'react-redux';
import { DaltosRapid, SaveResumenData, SaveInsertCData } from '../../../redux/Slices/userDataSlice';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";

export default function FileCheck(props) {
    const dispatch = useDispatch()
    const getDaltosRapid = useSelector(state => state?.userData?.daltosRapid)
    const Fuerza = useSelector(state => state.userData.Fuerza)
    const Municipios = useSelector(state => state?.userData?.Municipios)
    const user = useSelector(state => state.userData.userData)
    const ResumenData = useSelector(state => state?.userData?.ResumenData)
    const InsertCData = useSelector(state => state.userData.InsertCData)
    const [isSubmitting, setIsSubmitting] = React.useState(false);


    // Get unique oficinaR Value from GET Fuerza API
    const uniqueOffices = [...new Set(Municipios.map(item => item.estado))];
    // const uniqueOffices = [...new Set(Fuerza.map(item => item.oficinaR))];

    const newDataArray = getDaltosRapid && getDaltosRapid.map(item => {
        const count = Object.entries(item).reduce((acc, [key, value]) => {
            if (key !== 'nucleosfamiliares' &&
                key !== 'oficinaRepre' &&
                key !== 'fecha' &&
                key !== 'hora' &&
                key !== 'nombreAgente' &&
                key !== 'puntoEstra' &&
                key !== 'nacionalidad' &&
                key !== 'iso3' &&
                key !== 'nationality' &&
                !isNaN(parseInt(value))) {
                acc += parseInt(value);
            }
            return acc;
        }, 0);
        return { nationality: item.nationality, Count: count.toString() };
    });

    const totalValueCount = newDataArray && newDataArray.reduce((total, obj) => {
        return total + parseInt(obj.Count);
    }, 0);

    // Function to format the data
    const formatData = (data) => {
        const formattedData = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const array = data[key];
                formattedData[key] = array.map(obj => {
                    const newObj = {};
                    for (const prop in obj) {
                        if (obj.hasOwnProperty(prop) && prop !== 'fecha' && prop !== 'hora' && prop !== 'iso3' && prop !== 'municipio' && prop !== 'nacionalidad' && prop !== 'nationality' && prop !== 'nombreAgente' && prop !== 'oficinaRepre' && prop !== 'puntoEstra') {
                            newObj[prop] = obj[prop];
                        }
                    }
                    return newObj;
                });
            }
        }
        return formattedData;
    };

    // Function to format the array
    const formatArray = (originalArray) => {
        const formattedArray = [];
        for (const country in originalArray) {
            const countryData = originalArray[country][0];
            const formattedCountryData = [];
            for (const key in countryData) {
                formattedCountryData.push({ [key]: countryData[key] });
            }
            formattedArray.push({ [country]: formattedCountryData });
        }
        return formattedArray;
    };

    const confirmData = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const grouped = getDaltosRapid && getDaltosRapid.length > 0 ? getDaltosRapid.reduce((acc, item) => {
            acc[item.nacionalidad] = [...(acc[item.nacionalidad] || []), item];
            return acc;
        }, {}) : {};

        // Format the original data
        const formattedData = formatData(grouped);
        // Formatted array
        const formattedArray = formatArray(formattedData);

        var Data = {
            topTitle: '---Conteo Preliminar---',
            mainTopTitle: `OR: ${uniqueOffices[user?.estado - 1]}`,
            FetchDate: moment(new Date()).format('DD-MM-YYYY'),
            Total_Number: `${totalValueCount}`,
            dropDownTitle: `${props?.route?.params?.selected}`,
            selectedValue: `${props?.route?.params?.selectedValue}`,
            nationalityGroup: formattedArray,
            nationalityGroupFamily: {},
        }

        if (ResumenData != null) {
            const newArray = [...ResumenData]
            newArray.push(Data)
            dispatch(SaveResumenData(newArray))
        } else {
            dispatch(SaveResumenData([Data]))
        }

        const state = await NetInfo.fetch();
        if (state.isConnected) {
            if (InsertCData != null) {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                var raw = JSON.stringify(InsertCData);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                try {
                    const response = await fetch(`${endPoints.InsertC}`, requestOptions);
                    const result = await response.json();
                    if (result?.guardado == 'ok') {
                        dispatch(SaveInsertCData(null));
                        Alert.alert("Éxito", "Datos de conteo rápido enviados al servidor correctamente.");
                    } else {
                        Alert.alert("Advertencia", "Los datos no pudieron ser procesados por el servidor, pero se han guardado localmente.");
                    }
                } catch (error) {
                    console.log('Error posting InsertCData:', error);
                    Alert.alert("Advertencia", "Los datos de conteo rápido se guardaron localmente debido a un problema de conexión con el servidor.");
                }
            } else {
                Alert.alert("Éxito", "Proceso de conteo rápido finalizado.");
            }
        } else {
            Alert.alert("Sin Conexión", "No hay conexión a internet. Los datos se guardaron localmente y se enviarán cuando recuperes la conexión.");
        }

        dispatch(DaltosRapid(null))
        setIsSubmitting(false);
        props.navigation.goBack();
    }

    const editData = (key) => {
        // Accessing the object at index 
        const index1Object = getDaltosRapid && getDaltosRapid[key]
        props.navigation.navigate(routes.GUARDAR, {
            key: 'Familia',
            selectedValue: props?.route?.params?.selectedValue,
            selected: props?.route?.params?.selected,
            item: index1Object,
            indexKey: key
        })
    }

    return (
        <WrapperComponent background={colors.white}>
            <SafeAreaView style={styles.mainContainer}>
                <BackButton />

                <View style={{ flex: 1 }}>
                    <Text style={styles.mainTitle}>{'Datos Conteo Rapido'}</Text>
                    {
                        newDataArray &&
                        newDataArray.length > 0 && (
                            <Text style={{
                                textAlign: 'center',
                                alignSelf: "center",
                                paddingVertical: wp(2),
                                fontSize: fontPixel(18),
                                color: colors.redishColor,
                                fontFamily: fontFamily.appTextSemiBold,
                            }}>
                                iRESCATE MASIVO!
                            </Text>
                        )
                    }
                </View>

                {
                    newDataArray &&
                    newDataArray.length > 0 && (
                        <ScrollView contentContainerStyle={styles.listcontainer}>
                            {newDataArray.map((item, index) => (
                                <TouchableOpacity onPress={() => editData(index)} activeOpacity={0.8} key={index} style={[styles.item, { margin: wp(2), width: Dimensions.get('screen').width / 4.8, backgroundColor: colors.brownColor }]}>
                                    <Text style={[styles.text, { fontFamily: fontFamily.appTextSemiBold, fontSize: fontPixel(16) }]}>{item?.nationality}</Text>
                                    <Text style={styles.text}>{item?.Count}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )
                }
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate(routes.GUARDAR, { key: 'Familia', selectedValue: props?.route?.params?.selectedValue, selected: props?.route?.params?.selected })} style={[styles.container, { borderColor: colors.brownColor }]}>
                        <View style={[{ borderRadius: wp(5), backgroundColor: colors.brownColor, padding: 6 }]}>
                            <MaterialCommunityIcons name="plus" size={30} color="#fff" />
                        </View>
                        <View style={[styles.rightView, { marginRight: wp(2) }]}>
                            <Text style={{ fontSize: fontPixel(16), color: colors.brownColor, fontFamily: fontFamily.appTextBold }}>{'NACIONALIDAD'}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => confirmData()} style={[styles.container, { right: 5, borderRadius: wp(3), position: "absolute", bottom: 0, alignSelf: "flex-end", borderColor: colors.redishColor, width: wp(35), }]}>
                        <View style={styles.rightView}>
                            <Text style={{ fontSize: fontPixel(16), color: colors.redishColor, fontFamily: fontFamily.appTextBold, }}>{'ENVIAR'}</Text>
                        </View>
                        <View style={[{ borderRadius: wp(2), backgroundColor: colors.redishColor, padding: 6 }]}>
                            <MaterialCommunityIcons name="send" size={30} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
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
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        borderWidth: 3,
        width: wp(55),
        marginHorizontal: wp(2),
        borderRadius: wp(5)
    },
    rightView: {
        // flex: 1,
    },
    listcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center"
    },
    item: {
        flexDirection: 'row',
        paddingVertical: hp(1),
        alignItems: 'center',
        justifyContent: "space-evenly"
    },
    text: {
        color: '#fff',
        marginHorizontal: 4,
    },
})