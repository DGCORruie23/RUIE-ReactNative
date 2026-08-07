import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../services/utilities'

export default function WrapperComponent(props) {
    return (
        <>
            <StatusBar backgroundColor={colors.green} barStyle='default' />
            <View style={{ flex: 1, backgroundColor: props.background ? props.background : colors.green }}>
                {props.children}
            </View>
        </>

    )
}

const styles = StyleSheet.create({})