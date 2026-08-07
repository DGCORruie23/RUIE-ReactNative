import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native'
import { appIcons, colors, fontFamily, fontPixel, heightPixel, hp, screenHeight, wp } from '../../services'
import appStyles from '../../services/utilities/appStyles'

const Button = props => {
    const { style, disable, containerStyle, onPress, themeColor, light, arrowRight, borderButton, borderWidth } = props

    return (
        <View style={[appStyles.mb10]}>
            <TouchableOpacity
                activeOpacity={0.9}
                disabled={disable}
                style={{
                    ...styles.container,
                    ...containerStyle,
                    backgroundColor: colors.redishColor,
                }}
                onPress={onPress}>
                <View style={[appStyles.rowCenter]}>
                    <Text style={{ ...styles.label, ...style }}>
                        {props.children}
                    </Text>
                    {arrowRight &&
                        <Image source={appIcons.arrowRightCircle} style={{ marginLeft: 10, width: 17, height: 17, resizeMode: 'contain' }} />
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: wp(10),
        borderRadius: 5,
        paddingVertical: hp(1)
    },
    label: {
        fontSize: fontPixel(16),
        lineHeight: 24,
        letterSpacing: 1,
        fontFamily: fontFamily.appTextMedium,
        color: colors.white
    },
})

export default Button
