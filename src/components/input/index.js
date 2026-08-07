import { StyleSheet, Image, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../services/constants'
import { appIcons } from '../../services'

export default function Input(props) {
    return (
        <View style={styles.row}>
            <View style={styles.inputContainer}>
                <TextInput
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor}
                    style={props.style}
                    secureTextEntry={props.secureTextEntry}
                />

            </View>
            {props.eye &&
                <TouchableOpacity style={{ position: 'absolute', right: -wp(6) }} onPress={props.onPressEye}>
                    <Image tintColor={'rgba(255,255,255,0.5)'} source={props.secureTextEntry ? appIcons.hide : appIcons.show} style={styles.icon} />
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        width: wp(50),
    },
    row: {
        flexDirection: "row",
        alignItems: 'center',
    },
    icon: {
        width: wp(7),
        height: hp(7),
        resizeMode: 'contain'
    },

})