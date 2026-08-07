import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, } from 'react-native';
import React, { useState } from 'react';
import { colors, fontFamily, fontPixel, heightPixel, hp, widthPixel, wp, } from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

const DropDown = ({ country, dataArray, maintitle, label = "", placeholder, onSelect, selected = "" }) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <View style={{ marginTop: heightPixel(10), zIndex: 1, }} >
            {label && <Text style={styles.label} >{label}</Text>}
            <TouchableOpacity activeOpacity={0.7} onPress={() => { setExpanded(!expanded) }} style={[styles.mainContainer, { alignSelf: "center", width: maintitle == 'captura' ? '50%' : '80%' }]}>
                {selected.icon}
                <Text style={[styles.textInput, { textAlign: maintitle == 'captura' ? 'center' : 'left' }]}>{selected ? selected?.nombre_pais : placeholder}</Text>
                {
                    maintitle == 'captura' ? null : <AntDesign name='caretdown' size={15} />
                }
            </TouchableOpacity>
            {
                expanded ?
                    <View style={[styles.body, { width: country ? '80%' : '60%', }]} >
                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: country ? heightPixel(250) : heightPixel(350) }} nestedScrollEnabled={true} >
                            {
                                dataArray.map((item, index) => {
                                    return (
                                        <View key={index} style={{ paddingVertical: heightPixel(8), borderBottomWidth: 1, borderColor: colors.brownColor, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                                            {item?.icon}
                                            <Text onPress={() => { onSelect(item), setExpanded(false) }} style={styles.bodyItem} >{item?.nombre_pais}</Text>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    :
                    <></>
            }
        </View>
    );
};

export default DropDown;

const styles = StyleSheet.create({
    mainContainer: {
        height: heightPixel(48),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontFamily: fontFamily.appTextMedium,
        color: colors.lightText,
        fontSize: fontPixel(16),
        textTransform: 'uppercase',
    },
    iconStyle: {
        width: widthPixel(14),
        resizeMode: "contain",
        height: widthPixel(14),
        marginRight: widthPixel(8),
        transform: [{ rotate: '90deg' }]
    },
    label: {
        fontFamily: fontFamily.appTextSemiBold,
        color: colors.blackText,
        fontSize: fontPixel(16),
        marginBottom: heightPixel(8)
    },
    body: {
        position: 'absolute',
        top: hp(5),
        backgroundColor: colors.white,
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
        borderRadius: wp(2)
    },
    bodyItem: {
        fontSize: fontPixel(16),
        fontFamily: fontFamily.appTextRegular,
        color: colors.black,
        textAlign: 'center',
        paddingVertical: wp(2),
        textTransform: 'uppercase',
        width: wp(35)
    }
});
