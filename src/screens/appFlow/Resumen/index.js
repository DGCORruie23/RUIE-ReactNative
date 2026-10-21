import { StyleSheet, Text, SafeAreaView, View, FlatList, Image, Platform, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, fontFamily, fontPixel, hp, wp } from '../../../services'
import { useDispatch, useSelector } from 'react-redux'
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native'
import { useState } from 'react'
import { SaveResumenData } from '../../../redux/Slices/userDataSlice'

// Mesaje de resumen
export default function Resumen() {
  const dispatch = useDispatch()
  const ResumenData = useSelector(state => state?.userData?.ResumenData)
  const user = useSelector(state => state.userData.userData)

  // Local State Manage
  const [data, setData] = useState(null);

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

  const shareData = async (item, user) => {
    let message = `${item?.topTitle || ''}
                  ${item?.mainTopTitle}
                  FETCH: ${item?.FetchDate}
                  Agente: ${user?.nombre || 'N/A'} ${user?.apellido || ''}
                  No. de Rescatados: ${item?.Total_Number}
                  AEROPUERTO: ${item?.dropDownTitle}
                  ${item?.topTitle ? 'Distribución por país: Available' : ''}`;

    if (item?.nationalityGroup && item.nationalityGroup.length > 0) {
      item.nationalityGroup.forEach(group => {
        const country = Object.keys(group)[0];
        const arrays = group[country];
        message += `\n\n${country}`;
        arrays.forEach((array) => {
          Object.entries(array).forEach(([key, value]) => {
            const line = key.replace(/_/g, ' ').toUpperCase() + ': ' + value;
            message += `\n${line}`;
          });
        });
      });
    }

    if (item?.nationalityGroupFamily && Object.entries(item.nationalityGroupFamily).length > 0 && Object.entries(item.nationalityGroupFamily).length > 0) {
      message += `\n\nNUCLEOS FAMILIARES: ${Object.entries(item.nationalityGroupFamily).length}`;
      Object.entries(item.nationalityGroupFamily).forEach(([country, families], index) => {
        message += `\nNUCLEOS ${index + 1} de ${country}:`;
        families.forEach((family, familyIndex) => {
          const familyLine = `Familia ${familyIndex + 1}: ${family.details}`; // Adjust according to your data structure
          message += `\n${familyLine}`;
        });
      });
    }

    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            // For sharing text.
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
              message: null, // Specify no text to share via Messages app.
            },
            linkMetadata: {
              // For showing app icon on share preview.
              title: message,
            },
          },
          {
            // For using custom icon instead of default text icon at share preview when sharing with message.
            placeholderItem: {
              type: 'url',
            },
            item: {
              default: {
                type: 'text',
                content: message,
              },
            },
            linkMetadata: {
              title: message,
            },
          },
        ],
      },
      default: {
        title: 'Resumen Data',
        subject: 'Resumen Data',
        message: message,
      },
    });

    await Share.open(options);
  };

  // Function to check if the date is older than the current date
  function isDateOlderThanCurrent(dateString) {
    const currentDate = new Date();
    // Adjusting currentDate to start of the day for direct comparison
    currentDate.setHours(0, 0, 0, 0);

    const parts = dateString.split("-");
    // Note: months are 0-based in JavaScript Date
    const dateToCheck = new Date(parts[2], parts[1] - 1, parts[0]);

    return dateToCheck < currentDate;
  }

  useFocusEffect(useCallback(() => {
    // Filter the array to remove objects with a FetchDate older than the current date
    const filteredArray = (ResumenData && ResumenData.length > 0) ? ResumenData.filter(item => !isDateOlderThanCurrent(item.FetchDate)) : null;
    setData(filteredArray)
    // dispatch(SaveResumenData(filteredArray));
  }, [ResumenData]));

  return (
    <WrapperComponent background={colors.white}>
      <SafeAreaView style={styles.mainContainer}>
        <FlatList
          data={ResumenData}
          ListEmptyComponent={
            <View style={styles.MainView}>
              <Text style={styles.emptyDec}>Mesaje de resumen</Text>
            </View>
          }
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => {
            return (
              <View key={index} >
                <View style={styles.MainView}>
                  <Text style={[styles.mainTitle, { paddingVertical: 10, paddingLeft: 20 }]}>{item?.topTitle}</Text>
                  <Text style={styles.mainTitle}>{item?.mainTopTitle}</Text>
                  <Text style={styles.shortDec}>FECHA:: {item?.FetchDate}</Text>
                  <Text style={styles.shortDec}>Agente: {user?.nombre + " " + user?.apellido}</Text>
                  <Text style={[styles.mainTitle, { marginTop: hp(1) }]}>No: de Rescatados: {item?.Total_Number === 'null' ? '0' : item?.Total_Number}</Text>
                  <Text style={styles.shortDec}>{item?.dropDownTitle}</Text>
                  <Text style={styles.shortDec}>{item?.topTitle && 'Distribución por país'}</Text>
                  {
                    item?.topTitle ? (
                      <View>
                        {item?.nationalityGroup.length > 0 && item?.nationalityGroup.map(item => {
                          const country = Object.keys(item)[0]; // Extract country name
                          const arrays = item[country]; // Extract arrays for the country
                          return (
                            <View key={country}>
                              <Text style={[styles.mainTitle, { marginTop: hp(2) }]}>{country}</Text>
                              {arrays.map((array, index) => (
                                <View key={index}>
                                  {Object.entries(array).map(([key, value]) => (
                                    // <Text key={key} style={[styles.shortDec]}>
                                    //   {
                                    key == 'AS_hombres' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} ADULTO(S) MASCULINO(S)`}</Text> : null
                                      : key == 'AS_mujeresNoEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} ADULTO(S) FEMENINO(S) NO EMBARAZADO(S)`}</Text> : null
                                        : key == 'AS_mujeresEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} ADULTO(S) FEMENINO(S) EMBARAZADO(S)`}</Text> : null
                                          : key == 'AA_hombres' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} MENOR(S) MASCULINO(S)`}</Text> : null
                                            : key == 'nucleosfamiliares' ? parseFloat(value) > 0 ? <Text style={[styles.mainTitle, { marginTop: hp(2) }]}>NUCLEOS FAMILIARES: {value} De {country}</Text> : null
                                              : key == 'AA_mujeresNoEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} MENOR(S) FEMENINO(S) NO EMBARAZADO(S)`}</Text> : null
                                                : key == 'AA_mujeresEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} MENOR(S) FEMENINO(S) EMBARAZADO(S)`}</Text> : null
                                                  : key == 'NNA_A_hombres' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} ADULTO(S) MASCULINO(S)`}</Text> : null
                                                    : key == 'NNA_A_mujeresNoEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} ADULTO(S) FEMENINO(S) NO EMBARAZADO(S)`}</Text> : null
                                                      : key == 'NNA_A_mujeresEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} ADULTO(S) FEMENINO(S) EMBARAZADO(S)`}</Text> : null
                                                        : key == 'NNA_S_hombres' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} MENOR(S) MASCULINO(S)`}</Text> : null
                                                          : key == 'NNA_S_mujeresNoEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} MENOR(S) FEMENINO(S) NO EMBARAZADO(S)`}</Text> : null
                                                            : key == 'NNA_S_mujeresEmb' ? parseFloat(value) > 0 ? <Text key={key} style={[styles.shortDec]}>{`${value} MENOR(S) FEMENINO(S) EMBARAZADO(S)`}</Text> : null
                                                              : null
                                    //   }
                                    // </Text>
                                  ))}
                                </View>
                              ))}
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <>
                        {Object.entries(item?.nationalityGroup).map(([country, citizens], index) => (
                          <View key={index}>
                            <Text style={[styles.mainTitle, { marginTop: hp(2) }]}>{country}</Text>
                            {citizens.map((citizen, index) => (
                              <Text key={index} style={[styles.shortDec, { marginBottom: wp(1) }]}>{isDateMoreThan18YearsAgo(citizen.edad) ? `1 ADULTO(S) ${citizen.sexo == 'Homebre' ? 'MASCULINO(S)' : `FEMENINO(S)`}` : `1 MENOR(ES) ${citizen.sexo == 'Homebre' ? 'MASCULINO(S)' : `FEMENINO(S)`}`}</Text>
                            ))}
                          </View>
                        ))}

                        {
                          Object.entries(item?.nationalityGroupFamily).length > 0 &&
                          (
                            <>
                              <Text style={[styles.mainTitle, { marginTop: hp(2) }]}>NUCLEOS FAMILIARES: {Object.entries(item.nationalityGroupFamily).length}</Text>

                              {Object.entries(item.nationalityGroupFamily).map(([country, citizens], index) => (
                                <View key={index}>
                                  <Text style={[styles.mainTitle, { marginTop: hp(2) }]}>NUCLEOS #{index + 1}</Text>
                                  {citizens.map((citizen, index) => (
                                    <Text key={index} style={[styles.shortDec, { marginBottom: wp(1) }]}>{isDateMoreThan18YearsAgo(citizen.edad) ? `1 ADULTO(S) ${citizen.sexo == 'Homebre' ? 'MASCULINO(S)' : `FEMENINO(S)`} ${citizen?.nacionalidad}` : `1 MENOR(ES) ${citizen.sexo == 'Homebre' ? 'MASCULINO(S)' : `FEMENINO(S)`} ${citizen?.nacionalidad}`}</Text>
                                  ))}
                                </View>
                              ))}
                            </>
                          )
                        }
                      </>
                    )
                  }
                </View>

                {/* <TouchableOpacity onPress={() => shareData(item)} style={{ height: '15%', width: '15%', position: 'absolute', bottom: 0, top: 100, left: -10, }}>
                  <Image style={{ height: '100%', width: '100%' }} source={require('../../../assets/images/whatsapp.png')} />
                </TouchableOpacity> */}
              </View>
            )
          }}
        />
      </SafeAreaView>
    </WrapperComponent >
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  MainView: {
    marginLeft: wp(10),
    marginRight: wp(2),
    marginBottom: hp(2),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: colors.brownColor,
    paddingBottom: hp(2)
  },
  mainTitle: {
    paddingLeft: wp(2),
    fontSize: fontPixel(18),
    color: colors.black,
    fontFamily: fontFamily.appTextSemiBold,
  },
  shortDec: {
    paddingLeft: wp(2),
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fontFamily.appTextRegular,
    marginTop: hp(1)
  },
  emptyDec: {
    paddingLeft: wp(2),
    fontSize: fontPixel(14),
    color: colors.grey_Text,
    fontFamily: fontFamily.appTextRegular,
    marginTop: hp(1)
  },
})