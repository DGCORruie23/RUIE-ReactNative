import { StyleSheet, Text, SafeAreaView, View, TextInput, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { colors, fontFamily, fontPixel, heightPixel, hp, routes, wp } from '../../services';

export default function CustomDropDown({ dataArray, onSelect, onTypeValue, selected }) {
    const [thingArray, setThingsArray] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (expanded) {
                setExpanded(false);
                return true; // prevent default behavior (exit the app)
            }
            return false; // let the default behavior happen
        });

        return () => {
            backHandler.remove(); // cleanup the event listener on component unmount
        };
    }, [expanded]);

    const getArrayThings = async (e) => {
        const searchTerm = e.toLowerCase();
        const getArray = await dataArray.filter(item => item.suggestedName.toLowerCase().includes(searchTerm));
        setThingsArray(getArray);
        onSelect('');

        if (getArray.length > 0) {
            // onSelect(e.toLowerCase());
            onTypeValue(e.toLowerCase())
        } else {
            // onSelect('');
            onTypeValue(e.toLowerCase())
        }
    };

    return (
        <View>
            <TextInput
                value={selected}
                onChangeText={(e) => {
                    getArrayThings(e);
                    setExpanded(e.length > 0);
                }}
                placeholder='Punto de rescate'
                style={{ textAlign: "center", alignSelf: "center", height: hp(5), width: wp(90), borderBottomWidth: 2, borderBottomColor: colors.green, fontSize: fontPixel(16), fontFamily: fontFamily.appTextMedium, }}
            />
            {
                (expanded && thingArray.length > 0) &&
                <View style={styles.body} >
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: heightPixel(350) }} nestedScrollEnabled={true}>
                        {thingArray.length > 0 && thingArray.map((item, index) => (
                            <View key={index} style={{ marginVertical: heightPixel(6) }}>
                                <Text numberOfLines={1} onPress={() => { onSelect(item?.suggestedName), setExpanded(false), onTypeValue(item?.suggestedName) }} style={styles.bodyItem}>{item?.suggestedName}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            }
        </View>
    );
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
        borderRadius: wp(2),
    },
    bodyItem: {
        fontSize: fontPixel(16),
        fontFamily: fontFamily.appTextRegular,
        color: colors.black,
        textAlign: 'center',
        paddingVertical: wp(2),
    },
});
