import { Image, SafeAreaView, StyleSheet, Text, View, AppState } from 'react-native'
import React, { useState, useEffect } from 'react'
import { appImages, colors, fontFamily } from '../../../services/utilities'
import WrapperComponent from '../../../components/wrapperComponent'
import { endPoints, fontPixel, hp, routes, wp } from '../../../services/constants'
import { fetchApi } from '../../../apiCalling'
import { useDispatch, useSelector } from 'react-redux'
import { userData } from '../../../redux/Slices/userDataSlice'
import { getAirportTypes, getFuerza, getMunicipios, getPaises, SaveInsertCData, SaveInsertRData, SaveResumenData } from '../../../redux/Slices/userDataSlice'
import NetInfo from "@react-native-community/netinfo";
import BackgroundFetch from "react-native-background-fetch";

export default function Splash(props) {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.userData?.userData)
  const InsertRData = useSelector(state => state.userData.InsertRData)
  const InsertCData = useSelector(state => state.userData.InsertCData)

  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Loading Progress Bar
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        const nextProgress = progress + 20;
        setProgress(nextProgress);
        if (nextProgress === 40) {
          fetchUserValidate();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      if (user) {
        props.navigation.navigate(routes.tab);
      } else {
        props.navigation.navigate(routes.login);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, user, props.navigation]);

  // Check the initial network state
  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('addEventListener', state);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // If Internet Connection is True
  useEffect(() => {
    if (isConnected) {
      // Post Profile API
      if (InsertRData != null) {
        PostInsertRData();
      }
      // Post API
      if (InsertCData != null) {
        PostInsertCData();
      }

      // Remove Resume after submitting
      // dispatch(SaveResumenData(null))

      // Get Latest Data
      fetchUserValidate();
      
      fetchAirportType();
      fetchMunicipios();
      fetchFuerza();
      fetchPaises();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const PostInsertRData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(InsertRData);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(`${endPoints.InsertR}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("result", result)
        if (result?.guardado == 'ok') {
          dispatch(SaveInsertRData(null))
        }
      })
      .catch(error => console.log('error', error));
  }

  const fetchUserValidate = async () => {
    await fetchApi(endPoints.signIn, {
      method: 'POST',
      body: {
        // "nickname": email.toLowerCase(),
        "nickname": user.nickname,
        "password": user.password
      },
    })
    .then(data => {
      console.log("Login Response:-", data);
      if (data?.nickname == 'error' && data?.password == 'error') {
        dispatch(userData(null))
      } else {
        data.password = user.password;
        dispatch(userData(data));
      }
    })
    .catch(error => {
      console.log("Login Error:-", error);
    });
  };

  const PostInsertCData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(InsertCData);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(`${endPoints.InsertC}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("result", result)
        if (result?.guardado == 'ok') {
          dispatch(SaveInsertCData(null))
        }
      })
      .catch(error => console.log('error', error));
  }

  

  const fetchAirportType = async () => {
    await fetchApi(endPoints.airportTypes)
      .then(data => {
        console.log('airportTypes:- ', data);
        dispatch(getAirportTypes(data));
      })
      .catch(error => console.error(error));
  };

  const fetchMunicipios = async () => {
    await fetchApi(endPoints.Municipios)
      .then(data => {
        console.log('Municipios:- ', data);
        dispatch(getMunicipios(data));
      })
      .catch(error => console.error(error));
  };

  const fetchFuerza = async () => {
    await fetchApi(endPoints.Fuerza)
      .then(data => {
        console.log('Fuerza:- ', data);
        dispatch(getFuerza(data));
      })
      .catch(error => console.error(error));
  };

  const fetchPaises = async () => {
    await fetchApi(endPoints.Paises)
      .then(data => {
        console.log('Paises:- ', data);
        dispatch(getPaises(data));
      })
      .catch(error => console.error(error));
  };

  const initializeBackgroundFetch = async () => {
    // Configure the background fetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is the minimum allowed)
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      },
      async taskId => {
        console.log('[js] Received background-fetch event: ', taskId);

        // Perform your task here.
        checkInternetConnectivity(taskId);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start: ', error);
      },
    );

    // Optional: Check status
    const status = await BackgroundFetch.status();
    if (status === BackgroundFetch.STATUS_AVAILABLE) {
      console.log('Background fetch is available');
    } else {
      console.log('Background fetch is not available');
    }
  };

  const checkInternetConnectivity = taskId => {
    NetInfo.fetch().then(state => {
      console.log('Is Network connected?', state.isConnected);
      // Here you can handle the connectivity change, e.g., update the state, show a notification, etc.
      if (state.isConnected) {
        setIsConnected(state.isConnected);
        // Call finish upon completion.
        BackgroundFetch.finish(taskId);
      }
    });
  };

  // Background Server for Internet Connectivity Check
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('App State:', nextAppState);
      if (nextAppState === 'background') {
        initializeBackgroundFetch();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WrapperComponent>
      <SafeAreaView style={styles.mainContainer}>
        <Text style={styles.mainTitle}>Bienvenido</Text>

        <Text
          style={[
            styles.mainDescription,
            {
              fontSize: fontPixel(15),
              fontFamily: fontFamily.appTextMedium,
              color: colors.white,
            },
          ]}>
          Utiliza el RUI electrónico para el registro de datos de la población
          migrante rescatada en México.
        </Text>

        <Text
          style={[
            styles.mainDescription,
            {
              fontSize: fontPixel(15),
              fontFamily: fontFamily.appTextMedium,
              color: colors.white,
              marginTop: hp(3),
            },
          ]}>
          ¡Únete y contribuye a agilizar la operación migratoria a lo largo del
          país!
        </Text>

        <Text
          style={[
            styles.mainDescription,
            {
              fontSize: fontPixel(14),
              fontFamily: fontFamily.appTextBold,
              color: colors.brownColor,
              marginTop: hp(5),
            },
          ]}>
          ¡Datos oportunos, verificados y accesibles!
        </Text>

        <Image
          source={appImages.inamiLogo}
          style={{ height: hp(30), width: wp(45), marginTop: hp(10) }}
        />

        <Text
          style={[
            styles.mainDescription,
            {
              fontSize: fontPixel(10),
              fontFamily: fontFamily.appTextBold,
              color: colors.white,
              marginTop: hp(3),
            },
          ]}>
          Dirección General de Control y Verificación Migratoria
        </Text>

        <Text
          style={[
            styles.mainDescription,
            {
              fontSize: fontPixel(10),
              fontFamily: fontFamily.appTextBold,
              color: colors.white,
              marginTop: hp(1),
            },
          ]}>
          Dirección General de Coordinación de Oficinas de Representación
        </Text>

        <View style={styles.container}>
          <View style={styles.progressBar}>
            <View
              style={{
                width: `${progress}%`,
                backgroundColor: 'white',
                height: hp(1),
              }}
            />
          </View>
          <Text style={styles.percentageText}>{progress}%</Text>
        </View>
      </SafeAreaView>
    </WrapperComponent>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    margin: wp(5),
  },
  mainTitle: {
    fontSize: fontPixel(32),
    textTransform: 'uppercase',
    color: colors.white,
    fontFamily: fontFamily.appTextMedium,
    marginVertical: hp(5),
  },
  mainDescription: {
    textAlign: 'justify',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100),
    marginTop: hp(2),
  },
  progressBar: {
    width: '100%', // Adjust the width of the progress bar
    height: hp(1), // Adjust the height of the progress bar
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.2)', // You can adjust the color
  },
  percentageText: {
    marginTop: 5,
    color: colors.brownColor, // Adjust the color of the percentage text
    textAlign: 'center',
    fontFamily: fontFamily.appTextMedium,
    fontSize: fontPixel(12),
  },
});
