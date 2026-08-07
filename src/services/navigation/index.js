import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { routes } from '..'
import { AuthNavigation } from './authFlow'
import { TabNavigator } from './tabFlow'
import * as tab from '../../screens//appFlow';

const MyStack = createNativeStackNavigator()

export const MainNavigator = () => {
    return (
        <NavigationContainer>
            <MyStack.Navigator initialRouteName={routes.auth} screenOptions={{ headerShown: false, }}>
                <MyStack.Screen name={routes.auth} component={AuthNavigation} />
                <MyStack.Screen name={routes.tab} component={TabNavigator} />
                <MyStack.Screen name={routes.nacionalidad} component={tab.Nacionalidad} />
                <MyStack.Screen name={routes.Familia} component={tab.Familia} />
                <MyStack.Screen name={routes.fileCheck} component={tab.FileCheck} />
                <MyStack.Screen name={routes.GUARDAR} component={tab.GUARDAR} />
                <MyStack.Screen name={routes.profile} component={tab.Profile} />
            </MyStack.Navigator>
        </NavigationContainer>
    )
}
