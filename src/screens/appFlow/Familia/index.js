import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, fontFamily, fontPixel, hp, routes, wp } from '../../../services'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from '../../../components/BackOption';
import { useSelector } from 'react-redux';

export default function Familia(props) {
    const getFamilyProfile = useSelector(state => state?.userData?.FamiliesProfileSave)
    const [allprofile, setAllProfile] = useState([])

    // Determinar el ID de la familia actual:
    // Si venimos de un grupo existente en Captura, viene en route.params.item.Id.
    // Si entramos desde el botón general "FAMILIA" para crear una nueva familia, asignamos el siguiente ID disponible una sola vez al montar la pantalla.
    const [activeFamilyId, setActiveFamilyId] = useState(() => {
        if (props?.route?.params?.item?.Id !== undefined) {
            return props?.route?.params?.item?.Id;
        }
        return getFamilyProfile && getFamilyProfile.length > 0
            ? Math.max(...getFamilyProfile.map(item => Number(item?.id) || 0)) + 1
            : 0;
    });

    useEffect(() => {
        if (props?.route?.params?.item?.Id !== undefined) {
            setActiveFamilyId(props.route.params.item.Id);
        }
    }, [props?.route?.params?.item?.Id]);

    const fetchFamilyProfiles = useCallback(() => {
        if (!getFamilyProfile || getFamilyProfile.length === 0) {
            setAllProfile([]);
            return;
        }
        const filtered = getFamilyProfile.filter(i => i?.id == activeFamilyId);
        setAllProfile(filtered);
    }, [activeFamilyId, getFamilyProfile]);

    useEffect(() => {
        fetchFamilyProfiles();
    }, [fetchFamilyProfiles]);

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

                <View style={{ marginBottom: hp(2), marginTop: hp(1) }}>
                    <Text style={styles.mainTitle}>{"Rescates de Familias"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {allprofile && allprofile.length > 0 ? (
                        <ScrollView contentContainerStyle={styles.listcontainer}>
                            {allprofile.map((item, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => props.navigation.navigate(routes.profile, { key: 'Familia', id: activeFamilyId, FamiliaId: item.FamiliaId, country: item?.nacionalidad, item: item })}
                                    key={index}
                                    style={{ paddingVertical: hp(1), width: Dimensions.get('screen').width / 3, backgroundColor: isDateMoreThan18YearsAgo(item?.edad) ? colors.redishColor : 'green' }}>
                                    <View key={index} style={[styles.item]}>
                                        <Text style={[styles.text, { fontFamily: fontFamily.appTextSemiBold, fontSize: fontPixel(16) }]}>{isDateMoreThan18YearsAgo(item?.edad) ? 'A' : 'NNA'}</Text>
                                        <Text style={[styles.text]}>{item.apellidos.toUpperCase()}</Text>
                                        <Text style={styles.text}>{item.nombre.toUpperCase()}</Text>
                                    </View>
                                    <Text style={[styles.text, { marginTop: hp(1), fontFamily: fontFamily.appTextSemiBold, fontSize: fontPixel(16) }]}>{item?.iso3}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : null}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', marginBottom: 30 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate(routes.profile, { key: 'Familia', id: activeFamilyId })} style={[styles.container, { borderColor: colors.green }]}>
                        <View style={[{ borderRadius: wp(5), backgroundColor: colors.green, padding: 6 }]}>
                            <MaterialCommunityIcons name="plus" size={30} color="#fff" />
                        </View>
                        <View style={[styles.rightView, { marginRight: wp(2) }]}>
                            <Text style={{ fontSize: fontPixel(16), color: colors.green, fontFamily: fontFamily.appTextBold }}>{'FAMILIAR'}</Text>
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
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        marginHorizontal: 4,
    },
    mainContainer: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: "center",
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
})