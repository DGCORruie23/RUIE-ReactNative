import { StyleSheet, Text, SafeAreaView, View, TextInput, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, fontFamily, fontPixel, hp, routes, wp } from '../../../services'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from '../../../components/BackOption';
import CountryDropDown from '../../../components/countryDropDown';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import * as tab from '../';

export default function Nacionalidad(props) {
    const getProfile = useSelector(state => state?.userData?.profileSave)
    const [country, setCountry] = useState('')
    const [typeValue, setTypeValue] = React.useState('')

    const [allprofile, setAllProfile] = useState(getProfile ? getProfile : [])

    const getProfileAgainstCountry = async () => {
        const newArray = await getProfile.filter(item => item.nacionalidad == country)
        setAllProfile(newArray)
    }

    useEffect(() => {
        getProfileAgainstCountry()
    }, [country, props.route.params?.item, getProfile])

    useFocusEffect(
        useCallback(() => {
            // Actions to perform when the screen is focused
            if (props.route.params?.item) {
                setCountry(props.route.params?.item?.nacionalidad)
                setTypeValue(props.route.params?.item?.nacionalidad)
            }

            return () => {
                // Optional cleanup actions when the screen goes out of focus
                console.log('Screen is unfocused');
            };
        }, [props.route.params?.item])
    );

    function isDateMoreThan18YearsAgo(dateStr) {
        // Current date
        const currentDate = new Date();

        // Calculate the date for 18 years ago
        const date18YearsAgo = new Date(
            currentDate.getFullYear() - 18,
            currentDate.getMonth(),
            currentDate.getDate()
        );

        // Parse the given date string
        const givenDate = new Date(dateStr);

        // Compare the dates
        return givenDate <= date18YearsAgo;
    }

    return (
        <WrapperComponent background={colors.white}>
            <SafeAreaView style={styles.mainContainer}>
                <BackButton />
                <View style={{ flex: 1, zIndex: 1 }}>
                    <Text style={styles.mainTitle}>Rescates de Adultos y NNA No Acompanados</Text>
                    <View style={{ marginTop: hp(3), zIndex: 1 }}>
                        <CountryDropDown
                            placeholder={'Ingresa el pais'}
                            setCountry={(e) => setCountry(e)}
                            onTypeValue={(e) => setTypeValue(e)}
                            country={typeValue}
                        />
                    </View>
                </View>
                {allprofile &&
                    allprofile.length > 0 && (
                        <ScrollView contentContainerStyle={styles.listcontainer}>
                            {allprofile.map((item, index) => (
                                <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => props.navigation.navigate(routes.profile, { country: country, item: item })} style={[styles.item, { width: Dimensions.get('screen').width / 3, backgroundColor: isDateMoreThan18YearsAgo(item?.edad) ? colors.brownColor : 'green' }]}>
                                    <Text style={[styles.text, { fontFamily: fontFamily.appTextSemiBold, fontSize: fontPixel(16) }]}>{isDateMoreThan18YearsAgo(item?.edad) ? 'A' : 'NNA'}</Text>
                                    <Text style={styles.text}>{item.apellidos.toUpperCase()}</Text>
                                    <Text style={styles.text}>{item.nombre.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (country != '') {
                                props.navigation.navigate(routes.profile, { country: country })
                            } else {
                                Alert.alert('LLENAR PARA CONTINUAR')
                            }
                        }}
                        style={[styles.container, { borderColor: colors.brownColor }]}>
                        <View style={[{ borderRadius: wp(5), backgroundColor: colors.brownColor, padding: 6 }]}>
                            <MaterialCommunityIcons name="plus" size={30} color="#fff" />
                        </View>
                        <View style={[styles.rightView, { marginRight: wp(2) }]}>
                            <Text style={{ fontSize: fontPixel(16), color: colors.brownColor, fontFamily: fontFamily.appTextBold }}>{'PERSONA'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={[styles.container, { borderColor: colors.redishColor }]}>
                        <View style={[styles.rightView, { marginLeft: wp(2) }]}>
                            <Text style={{ fontSize: fontPixel(16), color: colors.redishColor, fontFamily: fontFamily.appTextBold }}>{'GUARDAR'}</Text>
                        </View>
                        <View style={[{ borderRadius: wp(5), backgroundColor: colors.redishColor, padding: 6 }]}>
                            <MaterialCommunityIcons name="content-save" size={30} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </WrapperComponent>
    )
}

const styles = StyleSheet.create({
    listcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center"
    },
    item: {
        flexDirection: 'row',
        paddingVertical: hp(2),
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        marginHorizontal: 2,
    },
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
        width: wp(45),
        marginHorizontal: wp(2),
        borderRadius: wp(5)
    },
    rightView: {
        // flex: 1,
    },
    body: {
        position: 'absolute',
        top: hp(5),
        backgroundColor: colors.white,
        width: "99%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 16,
        width: '80%',
        borderRadius: wp(2)
    },
    bodyItem: {
        fontSize: fontPixel(16),
        fontFamily: fontFamily.appTextRegular,
        color: colors.black,
        textAlign: 'center',
        paddingVertical: wp(2)
    }
})