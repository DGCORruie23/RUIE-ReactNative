import { StyleSheet, Text, SafeAreaView, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { colors, fontFamily, fontPixel, heightPixel, hp, routes, wp } from '../../services'
import { useSelector } from 'react-redux';


export default function CountryDropDown({ placeholder, country, onTypeValue, setCountry }) {
    const getCountry = useSelector(state => state?.userData?.Paises)
    const [countryArray, setCountryArray] = React.useState('')
    const [expanded, setExpanded] = React.useState(false)

    const getCountries = async (e) => {
        const searchTerm = e.toLowerCase();
        const getArray = await getCountry.filter((country) => country.nombre_pais.toLowerCase().includes(searchTerm));
        setCountryArray(getArray)
        setCountry('')

        if (getArray.length > 0) {
            // setCountry(e.toLowerCase())
            onTypeValue(e.toLowerCase())
        } else {
            // setCountry('')
            onTypeValue(e.toLowerCase())
        }
    }

    return (
        <View style={{ zIndex: 1 }}>
            <TextInput
                value={country}
                onChangeText={(e) => {
                    getCountries(e)
                    setExpanded(true)
                    if (e.length < 1) {
                        setExpanded(false)
                    }
                }}
                placeholder={placeholder}
                placeholderTextColor={colors.gray_txt}
                style={{ textAlign: "center", alignSelf: "center", height: hp(5), width: wp(80), borderBottomWidth: 2, borderBottomColor: colors.gray_txt, fontSize: fontPixel(16), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
            {
                (expanded && countryArray.length > 0) &&
                <View style={styles.body} >
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: heightPixel(350) }} nestedScrollEnabled={true}>
                        {countryArray.length > 0 && countryArray.map((item, index) => {
                            return (
                                <View key={index} style={{ marginVertical: heightPixel(6) }}>
                                    <Text numberOfLines={1} onPress={() => { setCountry(item?.nombre_pais), setExpanded(false), onTypeValue(item?.nombre_pais) }} style={styles.bodyItem} >{item?.nombre_pais}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
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