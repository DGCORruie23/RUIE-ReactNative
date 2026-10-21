import { Image, SafeAreaView, StyleSheet, Text, View, AppState, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { appImages, colors, fontFamily } from '../../../services/utilities'
import WrapperComponent from '../../../components/wrapperComponent'
import { getEndPoints, fontPixel, hp, routes, wp } from '../../../services/constants'
import { fetchApi } from '../../../apiCalling'
import { useDispatch, useSelector } from 'react-redux'
import { userData } from '../../../redux/Slices/userDataSlice'
import { getAirportTypes, getFuerza, getMunicipios, getPaises, SaveInsertCData, SaveInsertRData, SaveServerUrl } from '../../../redux/Slices/userDataSlice'
import NetInfo from "@react-native-community/netinfo";
import BackgroundFetch from "react-native-background-fetch";
import DeviceInfo from 'react-native-device-info';
import { fetchServerConfig, isVersionOutdated, shouldRefreshServerConfig } from '../../../services/serverConfig';

export default function Splash(props) {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.userData?.userData)
  const InsertRData = useSelector(state => state.userData.InsertRData)
  const InsertCData = useSelector(state => state.userData.InsertCData)
  const serverUrl = useSelector(state => state?.userData?.serverUrl)
  const serverUrlCheckedAt = useSelector(state => state?.userData?.serverUrlCheckedAt)

  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isOutdated, setIsOutdated] = useState(false);
  const [outdatedInfo, setOutdatedInfo] = useState({ currentVersion: '', minVersion: '', message: '' });

  // Obtenemos los endpoints usando la URL del servidor actual (o fallback si no hay)
  const currentEndPoints = getEndPoints(serverUrl);

  // Loading Progress Bar
  useEffect(() => {
    if (isOutdated) return; // Bloquear avance si la app está desactualizada

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
        props.navigation.reset({
          routes: [{ name: routes.tab }],
        });
      } else {
        props.navigation.navigate(routes.login);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, user, props.navigation, isOutdated]);

  // Validar versión y URL dinámica con validacionL
  const validateServerAndVersion = async () => {
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        console.log('Sin conexión para validacionL, usando serverUrl guardado:', serverUrl);
        return;
      }

      // Solo consultar si nunca se hizo o pasaron 4+ horas
      if (!shouldRefreshServerConfig(serverUrlCheckedAt)) {
        console.log('validacionL verificado recientemente, omitiendo consulta.');
        return;
      }

      const config = await fetchServerConfig();
      console.log('Configuración recibida de validacionL:', config);

      // Guardar URL y timestamp en Redux
      dispatch(SaveServerUrl({
        url: config.url,
        checkedAt: new Date().toISOString(),
      }));

      // Verificar versión de la app
      let currentAppVersion = '1.0.28';
      try {
        if (DeviceInfo?.getVersion) {
          currentAppVersion = DeviceInfo.getVersion();
        }
      } catch (err) {
        console.log('Error obteniendo versión de DeviceInfo:', err);
      }

      const outdated = isVersionOutdated(currentAppVersion, config.versionMinima);
      if (outdated) {
        setIsOutdated(true);
        setOutdatedInfo({
          currentVersion: currentAppVersion,
          minVersion: config.versionMinima,
          message: config.mensaje || 'Existe una versión más reciente obligatoria.',
        });
      }
    } catch (error) {
      console.log('Error al validar servidor/versión:', error);
    }
  };

  // Check the initial network state y validar servidor
  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        validateServerAndVersion();
      }
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('addEventListener', state);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If Internet Connection is True
  useEffect(() => {
    if (isConnected) {
      validateServerAndVersion();

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

    const cleanData = Array.isArray(InsertRData)
      ? InsertRData.map(({ recordId, ...rest }) => rest)
      : InsertRData;
    var raw = JSON.stringify(cleanData);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(`${currentEndPoints.InsertR}`, requestOptions)
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
    if (!user?.nickname) return;
    await fetchApi(currentEndPoints.signIn, {
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

    await fetch(`${currentEndPoints.InsertC}`, requestOptions)
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
    await fetchApi(currentEndPoints.airportTypes)
      .then(data => {
        console.log('airportTypes:- ', data);
        dispatch(getAirportTypes(data));
      })
      .catch(error => console.error(error));
  };

  const fetchMunicipios = async () => {
    await fetchApi(currentEndPoints.Municipios)
      .then(data => {
        console.log('Municipios:- ', data);
        dispatch(getMunicipios(data));
      })
      .catch(error => console.error(error));
  };

  const fetchFuerza = async () => {
    await fetchApi(currentEndPoints.Fuerza)
      .then(data => {
        console.log('Fuerza:- ', data);
        dispatch(getFuerza(data));
      })
      .catch(error => console.error(error));
  };

  const fetchPaises = async () => {
    await fetchApi(currentEndPoints.Paises)
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

        {/* <Text
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
        </Text> */}

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

        {/* Modal de Actualización Obligatoria */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isOutdated}
          onRequestClose={() => {}}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Actualización Requerida</Text>
              <Text style={styles.modalSubtitle}>
                {outdatedInfo.message || 'Tu aplicación se encuentra desactualizada.'}
              </Text>

              <View style={styles.versionBox}>
                <Text style={styles.versionText}>
                  Tu versión: <Text style={styles.versionValue}>{outdatedInfo.currentVersion}</Text>
                </Text>
                <Text style={styles.versionText}>
                  Versión mínima requerida: <Text style={styles.versionValue}>{outdatedInfo.minVersion}</Text>
                </Text>
              </View>

              <Text style={styles.modalWarning}>
                Para continuar utilizando el sistema RUI electrónico es necesario actualizar la aplicación.
              </Text>
            </View>
          </View>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(6),
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: wp(4),
    padding: wp(6),
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: fontPixel(20),
    fontFamily: fontFamily.appTextBold,
    color: colors.redishColor,
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: fontPixel(14),
    fontFamily: fontFamily.appTextMedium,
    color: colors.black,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  versionBox: {
    backgroundColor: '#F5F5F5',
    padding: wp(3),
    borderRadius: wp(2),
    width: '100%',
    marginBottom: hp(2),
  },
  versionText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamily.appTextRegular,
    color: colors.grey_Text,
    marginVertical: 2,
    textAlign: 'center',
  },
  versionValue: {
    fontFamily: fontFamily.appTextBold,
    color: colors.black,
  },
  modalWarning: {
    fontSize: fontPixel(12),
    fontFamily: fontFamily.appTextMedium,
    color: colors.redishColor,
    textAlign: 'center',
  },
});
