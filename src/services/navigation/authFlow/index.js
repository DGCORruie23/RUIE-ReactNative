import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes } from '../../constants';
import * as Auth from '../../../screens/authFlow';

const AuthStack = createNativeStackNavigator()

export const AuthNavigation = () => {
    return (
        <AuthStack.Navigator initialRouteName={routes.splash} screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name={routes.splash} component={Auth.Splash} />
            <AuthStack.Screen name={routes.login} component={Auth.Signin} />
        </AuthStack.Navigator>
    )
}