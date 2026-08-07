import React from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Platform, Alert, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as tab from '../../../screens/appFlow';
import { appIcons, colors, fontFamily } from '../../utilities'
import appStyles from '../../utilities/appStyles'
import { fontPixel, hp, wp } from '../../constants'

const Tab = createBottomTabNavigator()

const tabArray = [
    { route: 'Captura', selectIcon: appIcons.captura, component: tab.Captura },
    { route: 'Resumen', selectIcon: appIcons.document, component: tab.Resumen },
]

const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props
    const focused = accessibilityState?.selected
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.container]}>
            <View style={[styles.btn]}>
                <View style={appStyles.aiCenter}>
                    <Image source={item.selectIcon} style={styles.tabIcon} />
                    <Text style={[styles.mainTitle, { color: focused ? colors.brownColor : colors.grey_Text, marginVertical: wp(1) }]}>{item?.route}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.barStyle
            }}>
            {tabArray.map((item, index) => {
                return (
                    <Tab.Screen key={index} name={item.route} component={item.component}
                        options={{
                            tabBarShowLabel: false,
                            // eslint-disable-next-line react/no-unstable-nested-components
                            tabBarButton: (props) => <TabButton {...props} item={item} />
                        }}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    barStyle: {
        backgroundColor: colors.white,
        height: hp(10),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: Platform.OS == 'ios' ? 10 : 5
    },
    tabIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    dotStyle: {
        width: 5,
        position: 'absolute',
        height: 5,
        borderRadius: 5,
        top: -18,
        backgroundColor: colors.theme
    },
    mainTitle: {
        fontSize: fontPixel(12),
        fontFamily: fontFamily.appTextSemiBold,
    },
})

