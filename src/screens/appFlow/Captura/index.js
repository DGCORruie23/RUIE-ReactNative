import { StyleSheet, Text, SafeAreaView, View, Image, TextInput, TouchableOpacity, StatusBar, FlatList, ScrollView, Alert, Modal } from 'react-native'
import React, { useEffect } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { appIcons, colors, endPoints, getEndPoints, fontFamily, fontPixel, hp, routes, wp } from '../../../services'
import DropDown from '../../../components/dropDown'
import { useDispatch, useSelector } from 'react-redux'
import CustomDropDown from '../../../components/customDropDown'
import moment from 'moment'
import PopupMenu from '../../../components/modal'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmModal from '../../../components/confirmModal';
import { DaltosRapid, familiesProfileSave, profileSaved, SaveForwardData, SaveInsertCData, SaveInsertRData, SaveResumenData, } from '../../../redux/Slices/userDataSlice';
import NetInfo from '@react-native-community/netinfo';

export default function Captura(props) {
  // Predefined Array
  const preDefinedArray = [
    { id: 1, nombre_pais: 'Aeropuerto', icon: <Fontisto name='plane' color={colors.redishColor} size={25} /> },
    { id: 2, nombre_pais: 'Carretero', icon: <MaterialIcons name='add-road' color={colors.redishColor} size={25} /> },
    { id: 3, nombre_pais: 'Central de autobús', icon: <MaterialCommunityIcons name='van-passenger' color={colors.redishColor} size={25} /> },
    { id: 4, nombre_pais: 'Ferroviario', icon: <MaterialCommunityIcons name='train' color={colors.redishColor} size={25} /> },
    { id: 5, nombre_pais: 'Hotel/A.V./C.S.', icon: <MaterialCommunityIcons name='office-building' color={colors.redishColor} size={25} /> },
    { id: 6, nombre_pais: 'Puestos a Disposicion', icon: <MaterialCommunityIcons name='shield-star-outline' color={colors.redishColor} size={25} /> },
    { id: 7, nombre_pais: 'Voluntarios', icon: <MaterialCommunityIcons name='human-male-male' color={colors.redishColor} size={25} /> },
    { id: 8, nombre_pais: 'Caravana', icon: <MaterialCommunityIcons name='bus-multiple' color={colors.redishColor} size={25} /> },
  ]

  // Redux State 
  const dispatch = useDispatch()
  const Fuerza = useSelector(state => state.userData.Fuerza)
  const airportTypes = useSelector(state => state.userData.airportTypes)
  const Municipios = useSelector(state => state.userData.Municipios)
  const user = useSelector(state => state.userData.userData)
  const getProfile = useSelector(state => state?.userData?.profileSave)
  const getFamilyProfile = useSelector(state => state?.userData?.FamiliesProfileSave)
  const ResumenData = useSelector(state => state?.userData?.ResumenData)
  const puestisADisposicion = useSelector(state => state.userData.puestisADisposicion)
  const InsertRData = useSelector(state => state.userData.InsertRData)
  const InsertCData = useSelector(state => state.userData.InsertCData)
  const serverUrl = useSelector(state => state?.userData?.serverUrl)
  const currentEndPoints = getEndPoints(serverUrl)

  // Common States 
  const [selected, setSelected] = React.useState(preDefinedArray[0])
  const [dropDownListOfFuerza, setDropDownListOfFuerza] = React.useState([])
  const [selectedValue, setSelectedValue] = React.useState('')
  const [typeValue, setTypeValue] = React.useState('')

  const [modalVisible, setModalVisible] = React.useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [caravanaModalVisible, setCaravanaModalVisible] = React.useState(false);
  const [caravanaName, setCaravanaName] = React.useState('');
  const [iso3Counts, setIso3Counts] = React.useState([]);
  const [familyProfiles, fetchFamilyProfiles] = React.useState([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  // Get unique oficinaR Value from GET Fuerza API
  const uniqueOffices = [...new Set(Municipios.map(item => item.estado))];

  // Select Set Get Data Array
  const setListOfDropDown = async () => {
    var carreteroObjects = [];
    const userOffice = (uniqueOffices[user?.estado - 1] || '').toLowerCase();

    if (selected.nombre_pais === 'Puestos a Disposicion' || selected.nombre_pais === 'Voluntarios') {
      const fromFuerza = (Fuerza || []).filter(item => {
        const tipo = (item?.tipoP || '').toLowerCase();
        const oficina = (item?.oficinaR || '').toLowerCase();
        return (
          (tipo === 'carretero' ||
           tipo === 'ferroviario' ||
           tipo === 'central de autobús' ||
           tipo === 'central de autobus' ||
           tipo === 'aeropuerto') &&
          oficina === userOffice
        );
      }).map(item => ({
        oficinaR: item.oficinaR,
        number: item.numPunto,
        suggestedName: item.nomPuntoRevision,
      }));

      const fromAirports = (airportTypes || []).filter(
        item =>
          (item?.estadoPunto || '').toLowerCase() === userOffice &&
          item?.tipoPunto === 'AEREOS',
      ).map(item => ({
        oficinaR: item.estadoPunto,
        number: 0,
        suggestedName: item.nombrePunto,
      }));

      const combined = [...fromFuerza, ...fromAirports];
      const seenNames = new Set();
      carreteroObjects = combined.filter(item => {
        const key = (item?.suggestedName || '').trim().toLowerCase();
        if (!key || seenNames.has(key)) return false;
        seenNames.add(key);
        return true;
      });
    } else if (
      selected.nombre_pais === 'Carretero' ||
      selected.nombre_pais === 'Caravana' ||
      selected.nombre_pais === 'Ferroviario' ||
      selected.nombre_pais === 'Central de autobús'
    ) {
      // Filter items based on conditions
      carreteroObjects = await Fuerza.filter(
        item =>
          item.tipoP.toLowerCase() === (selected.nombre_pais === 'Caravana' ? 'carretero' : selected.nombre_pais.toLowerCase()) &&
          item.oficinaR.toLowerCase() === uniqueOffices[user?.estado - 1].toLowerCase(),
      ).map(item => ({
        // Map through filtered results and return an object with only the four specified properties
        oficinaR: item.oficinaR,
        number: item.numPunto,
        suggestedName: item.nomPuntoRevision,
      }));
    } else if (selected.nombre_pais == 'Aeropuerto') {
      carreteroObjects = await airportTypes.filter(
        item =>
          item.estadoPunto.toLowerCase() === uniqueOffices[user?.estado - 1].toLowerCase() &&
          item.tipoPunto === 'AEREOS',
      )
        .map(item => ({
          // Map through filtered results and return an object with only the four specified properties
          oficinaR: item.estadoPunto,
          number: 0,
          suggestedName: item.nombrePunto,
        }));
    } else {
      carreteroObjects = await Municipios.filter(
        item => item.estado.toLowerCase() === uniqueOffices[user?.estado - 1].toLowerCase(),
      ).map(item => ({
        // Map through filtered results and return an object with only the four specified properties
        oficinaR: item.estado,
        number: 0,
        suggestedName: item.nomMunicipio,
      }));
    }

    console.log('Sugggestion List of Custome DropDown', carreteroObjects);
    setDropDownListOfFuerza(carreteroObjects);
  };

  useEffect(() => {
    if (selected) {
      // Show popUp
      if (selected.nombre_pais == 'Puestos a Disposicion') {
        setModalVisible(true);
        setListOfDropDown();
      } else if (selected.nombre_pais == 'Caravana') {
        setCaravanaModalVisible(true);
        setCaravanaName(''); // Reset name when selecting caravana
        setListOfDropDown();
      } else {
        // Custom DropDown Suggestion List
        setListOfDropDown();
      }
      setSelectedValue("")
    }
  }, [selected]);

  const getProfileData = async () => {
    const counts = await getProfile?.reduce((acc, item) => {
      const key = item.iso3 + '|' + item.nacionalidad;
      if (!acc[key]) {
        acc[key] = { count: 1, iso3: item.iso3, nacionalidad: item.nacionalidad };
      } else {
        acc[key].count += 1;
      }
      return acc;
    }, {});

    const resultArray = Object.values(counts);
    setIso3Counts(resultArray);
  };

  useEffect(() => {
    if (getProfile && getProfile.length > 0) {
      getProfileData();
    } else {
      setIso3Counts([]);
    }
  }, [getProfile]);

  useEffect(() => {
    if (getFamilyProfile && getFamilyProfile.length > 0) {
      const idCounts = {};

      getFamilyProfile.forEach(item => {
        if (idCounts.hasOwnProperty(item.id)) {
          idCounts[item.id].Total += 1;
        } else {
          idCounts[item.id] = {
            Id: item.id,
            apellidos: item.apellidos,
            Total: 1,
            iso3: item.iso3,
          };
        }
      });

      const newArray = Object.values(idCounts);
      fetchFamilyProfiles(newArray);
    } else {
      fetchFamilyProfiles([]);
    }
  }, [getFamilyProfile]);

  const applyRescueTypeFields = (record, dropDownSelected, customeInputSelection, currentCaravanaName, currentPuestos) => ({
    ...record,
    aeropuerto: dropDownSelected == 'Aeropuerto' ? true : false,
    carretero: (dropDownSelected == 'Carretero' || dropDownSelected == 'Caravana') ? true : false,
    numeroEcono: dropDownSelected == 'Caravana' ? (currentCaravanaName || "").substring(0, 49) : "",
    vehiculoAseg: dropDownSelected == 'Caravana' ? true : false,
    casaSeguridad: dropDownSelected == 'Disuadidos' ? true : false,
    centralAutobus: dropDownSelected == 'Central de autobús' ? true : false,
    ferrocarril: dropDownSelected == 'Ferroviario' ? true : false,
    hotel: dropDownSelected == 'Hotel/A.V./C.S.' ? true : false,
    puestosADispo: dropDownSelected == 'Puestos a Disposicion' ? true : false,
    juezCalif: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Juez Calificador')[0]?.status || false) : false,
    reclusorio: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Reclusorio / Cereso')[0]?.status || false) : false,
    policiaFede: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Policia Federal')[0]?.status || false) : false,
    dif: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'DIF')[0]?.status || false) : false,
    policiaEsta: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Policia Estatal')[0]?.status || false) : false,
    policiaMuni: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Policia Municipal')[0]?.status || false) : false,
    guardiaNaci: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Guardia Nacional')[0]?.status || false) : false,
    fiscalia: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Fiscalia')[0]?.status || false) : false,
    otrasAuto: dropDownSelected == 'Puestos a Disposicion' ? (currentPuestos?.filter(item => item.id == 'Otras autoridades')[0]?.status || false) : false,
    voluntarios: dropDownSelected == 'Voluntarios' ? true : false,
    municipio: dropDownSelected == 'Hotel/A.V./C.S.' ? (customeInputSelection || "") : "",
    puntoEstra: (
      dropDownSelected == 'Aeropuerto' ||
      dropDownSelected == 'Central de autobús' ||
      dropDownSelected == 'Carretero' ||
      dropDownSelected == 'Ferroviario' ||
      dropDownSelected == 'Puestos a Disposicion' ||
      dropDownSelected == 'Voluntarios' ||
      dropDownSelected == 'Caravana'
    ) ? (customeInputSelection || "") : "",
  });

  const confirmData = async () => {
    if (isSubmitting) return;

    const hasProfiles = getProfile && getProfile.length > 0;
    const hasFamilyProfiles = getFamilyProfile && getFamilyProfile.length > 0;

    if (!hasProfiles && !hasFamilyProfiles) {
      setConfirmModalVisible(false);
      Alert.alert('Sin rescates por enviar');
      return;
    }

    setIsSubmitting(true);

    // Conditional check added before reduce
    const grouped =
      hasProfiles
        ? getProfile.reduce((acc, item) => {
          acc[item.nacionalidad] = [...(acc[item.nacionalidad] || []), item];
          return acc;
        }, {})
        : {};

    // Corrected conditional check for groupedFamilies and added check before reduce
    const groupedFamilies =
      hasFamilyProfiles
        ? getFamilyProfile.reduce((acc, item) => {
          acc[item.id] = [...(acc[item.id] || []), item];
          return acc;
        }, {})
        : {};

    // Function to calculate total objects remains the same
    const calculateTotalObjects = groupedObj => {
      return Object.values(groupedObj).reduce(
        (total, currentArray) => total + currentArray.length,
        0,
      );
    };

    // Calculate totals
    const totalProfiles = await calculateTotalObjects(grouped);
    const totalFamilyProfiles = await calculateTotalObjects(groupedFamilies);
    const totalRescues = parseFloat(totalProfiles) + parseFloat(totalFamilyProfiles);

    if (totalRescues > 0) {
      var Data = {
        mainTopTitle: `OR: ${uniqueOffices[user?.estado - 1]}`,
        FetchDate: moment(new Date()).format('DD-MM-YYYY'),
        Total_Number: totalRescues,
        dropDownTitle: `${selected?.nombre_pais?.toUpperCase()}${selectedValue != '' ? ':' + selectedValue : ':' + (dropDownListOfFuerza[0]?.suggestedName || '')}`,
        selectedValue:
          selectedValue != ''
            ? selectedValue
            : dropDownListOfFuerza[0]?.suggestedName,
        nationalityGroup: grouped,
        nationalityGroupFamily: groupedFamilies,
      };

      if (ResumenData != null) {
        const newArray = [...ResumenData];
        newArray.push(Data);
        dispatch(SaveResumenData(newArray));
      } else {
        dispatch(SaveResumenData([Data]));
      }
    }

    const state = await NetInfo.fetch();
    if (state.isConnected) {
      let rSuccess = true;
      let cSuccess = true;

      if (InsertRData != null) {
        rSuccess = await PostInsertRData();
      }
      if (InsertCData != null) {
        cSuccess = await PostInsertCData();
      }

      if (rSuccess && cSuccess) {
        Alert.alert("Éxito", "Datos enviados al servidor correctamente.");
      } else {
        Alert.alert("Advertencia", "Los datos no pudieron ser procesados por el servidor, pero se han guardado localmente para posterior sincronización.");
      }
    } else {
      Alert.alert("Sin Conexión", "No hay conexión a internet. Los datos se guardaron localmente y se enviarán cuando recuperes la conexión.");
    }

    fetchFamilyProfiles([]);
    setIso3Counts([]);
    dispatch(familiesProfileSave(null));
    dispatch(profileSaved(null));
    setConfirmModalVisible(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (selected && selectedValue !== '') {
      const forwardData = {
        DropDownSelected: selected.nombre_pais,
        customeInputSelection: selectedValue,
        caravanaName: selected.nombre_pais === 'Caravana' ? caravanaName : '',
      };

      dispatch(SaveForwardData(forwardData));

      if (InsertRData && InsertRData.length > 0) {
        const updatedInsertR = InsertRData.map(item =>
          applyRescueTypeFields(item, forwardData.DropDownSelected, forwardData.customeInputSelection, forwardData.caravanaName, puestisADisposicion)
        );
        dispatch(SaveInsertRData(updatedInsertR));
      }

      if (InsertCData && InsertCData.length > 0) {
        const updatedInsertC = InsertCData.map(item =>
          applyRescueTypeFields(item, forwardData.DropDownSelected, forwardData.customeInputSelection, forwardData.caravanaName, puestisADisposicion)
        );
        dispatch(SaveInsertCData(updatedInsertC));
      }
    }
  }, [selected, selectedValue, caravanaName, puestisADisposicion]);

  // Keep connection state updated
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const PostInsertRData = async () => {
    if (InsertRData == null) return true;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const resolvedLocation = selectedValue != ''
      ? selectedValue
      : (dropDownListOfFuerza[0]?.suggestedName || '');

    const payload = InsertRData.map(item => {
      const updated = applyRescueTypeFields(
        item,
        selected?.nombre_pais,
        resolvedLocation,
        selected?.nombre_pais === 'Caravana' ? caravanaName : '',
        puestisADisposicion
      );
      const { recordId, ...rest } = updated;
      return rest;
    });

    var raw = JSON.stringify(payload);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(`${currentEndPoints.InsertR}`, requestOptions);
      const result = await response.json();
      console.log('PostInsertRData result: ', result);
      if (result?.guardado == 'ok') {
        dispatch(SaveInsertRData(null));
        return true;
      }
      return false;
    } catch (error) {
      console.log('PostInsertRData error', error);
      return false;
    }
  };

  const PostInsertCData = async () => {
    if (InsertCData == null) return true;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify(InsertCData);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(`${currentEndPoints.InsertC}`, requestOptions);
      const result = await response.json();
      console.log('PostInsertCData result: ', result);
      if (result?.guardado == 'ok') {
        dispatch(SaveInsertCData(null));
        return true;
      }
      return false;
    } catch (error) {
      console.log('PostInsertCData error', error);
      return false;
    }
  };

  return (
    <WrapperComponent background={colors.white}>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView bounces={false} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
          <View
            style={{
              backgroundColor: colors.redishColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Ocultar botón de Conteo Rápido temporalmente */}
            {false && (
              <TouchableOpacity
                onPress={() => {
                  if (selectedValue != '') {
                    props.navigation.navigate(routes.fileCheck, {
                      selectedValue:
                        selectedValue != ''
                          ? selectedValue
                          : dropDownListOfFuerza[0]?.suggestedName,
                      selected: `${selected?.nombre_pais?.toUpperCase()}${(selected.nombre_pais !== 'Voluntarios') ? (selected.nombre_pais !== 'Puestos a Disposicion') ? (selectedValue != '' ? ':' + selectedValue : ':' + dropDownListOfFuerza[0]?.suggestedName) : '' : ''}`,
                      // selected: `${selected?.nombre_pais?.toUpperCase()}: ${selectedValue != ''
                      //   ? selectedValue
                      //   : dropDownListOfFuerza[0]?.suggestedName
                      //   }`,
                    });
                  } else {
                    if ((selected.nombre_pais == 'Voluntarios') || (selected.nombre_pais == 'Puestos a Disposicion')) {
                      props.navigation.navigate(routes.fileCheck, {
                        selectedValue:
                          selectedValue != ''
                            ? selectedValue
                            : dropDownListOfFuerza[0]?.suggestedName,
                        selected: `${selected?.nombre_pais?.toUpperCase()}${(selected.nombre_pais !== 'Voluntarios') ? (selected.nombre_pais !== 'Puestos a Disposicion') ? (selectedValue != '' ? ':' + selectedValue : ':' + dropDownListOfFuerza[0]?.suggestedName) : '' : ''}`,
                        // selected: `${selected?.nombre_pais?.toUpperCase()}: ${selectedValue != ''
                        //   ? selectedValue
                        //   : dropDownListOfFuerza[0]?.suggestedName
                        //   }`,
                      });
                    } else {
                      Alert.alert('LLENAR PARA CONTINUAR');
                    }
                  }
                }}
                style={styles.iconButton}>
                <MaterialCommunityIcons
                  name="file-check"
                  size={40}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            )}
            {/* <Text style={styles.mainTitle}>{user?.nickname?.toUpperCase()}</Text> */}
            <View style={{ position: 'absolute', bottom: 2, left: 2, flexDirection: "row", alignItems: "flex-end" }}>
              <Feather name={isConnected ? "wifi" : "wifi-off"} size={10} color="#FFFFFF" />
              <Text style={{ fontSize: fontPixel(8), color: colors.brownishColor, fontFamily: fontFamily.appTextBold, }}>{isConnected ? ' Online' : ' Offline Data Transfer'}</Text>
            </View>
            <Text style={styles.mainTitle}>{'Rescates'}</Text>
            <Text style={styles.mainDes}>{user?.nombre?.toUpperCase() + " " + user?.apellido?.toUpperCase()}</Text>
          </View>

          <Text numberOfLines={1} style={styles.description}>OR: {uniqueOffices[user?.estado - 1]}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: wp(8) }}>
            <Image tintColor={colors.redishColor} source={appIcons.calender} style={{ height: hp(3), width: wp(6.5) }} />
            <Text style={styles.dateText}>{moment(new Date()).format('DD-MM-YYYY')}</Text>
          </View>

          <View style={{ marginTop: wp(2), zIndex: 1 }}>
            <Text style={{ textAlign: 'center', fontSize: fontPixel(14), color: colors.black, fontFamily: fontFamily.appTextMedium }}>TIPO DE RESCATE</Text>
            <DropDown dataArray={preDefinedArray} maintitle='captura' onSelect={(e) => [setSelected(e), setTypeValue(''), setSelectedValue('')]} selected={selected} placeholder={'please select'} />
            <CustomDropDown dataArray={dropDownListOfFuerza} onTypeValue={(e) => setTypeValue(e)} onSelect={(e) => setSelectedValue(e)} selected={typeValue} />
            <View style={{ marginTop: wp(10), zIndex: -1 }}>
              <Text style={{ fontSize: fontPixel(18), color: '#7A7A7A', fontFamily: fontFamily.appTextMedium, textAlign: 'center' }}>
                Adultos y NNA No Acompanados
              </Text>
              {iso3Counts && iso3Counts.length > 0 && (
                <FlatList
                  data={iso3Counts}
                  contentContainerStyle={{ marginLeft: wp(5) }}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate(routes.nacionalidad, { item })
                        }
                        key={index}
                        style={{
                          marginTop: hp(1),
                          padding: wp(2),
                          flex: 1,
                          flexDirection: 'row',
                          backgroundColor: colors.brownishColor,
                          alignSelf: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontPixel(16),
                            color: colors.white,
                            fontFamily: fontFamily.appTextMedium,
                          }}>
                          {item?.iso3}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontPixel(16),
                            color: colors.white,
                            fontFamily: fontFamily.appTextMedium,
                            marginLeft: wp(5),
                          }}>
                          {item?.count}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                if (selectedValue != '') {
                  props.navigation.navigate(routes.nacionalidad);
                } else {
                  Alert.alert('LLENAR PARA CONTINUAR')
                }
              }}
              style={[styles.container, { zIndex: -1, borderRadius: wp(5), borderColor: colors.brownColor, width: wp(60), }]}>
              <View style={[styles.leftView, { borderRadius: wp(5), backgroundColor: colors.brownColor }]}>
                <Image tintColor={colors.white} source={appIcons.plus} style={{ height: wp(9), width: wp(9) }} />
              </View>
              <View style={styles.rightView}>
                <Text
                  style={{
                    fontSize: fontPixel(16),
                    color: colors.brownColor,
                    fontFamily: fontFamily.appTextBold,
                  }}>
                  {'NACIONALIDAD'}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ zIndex: -1 }}>
              <Text style={{ fontSize: fontPixel(18), color: '#7A7A7A', fontFamily: fontFamily.appTextMedium, textAlign: 'center' }}>
                Nucleos Familiares
              </Text>
              {familyProfiles && familyProfiles.length > 0 && (
                <FlatList
                  data={familyProfiles}
                  contentContainerStyle={{ marginLeft: wp(5) }}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          props.navigation.navigate(routes.Familia, { item })
                        }
                        style={{
                          marginTop: hp(1),
                          padding: wp(2),
                          flex: 1,
                          flexDirection: 'row',
                          backgroundColor: 'green',
                          alignSelf: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontPixel(16),
                            color: colors.white,
                            fontFamily: fontFamily.appTextMedium,
                          }}>
                          Fam. {index + 1}
                        </Text>
                        <View style={{ alignItems: 'center' }}>
                          <Text
                            style={{
                              fontSize: fontPixel(12),
                              color: colors.white,
                              fontFamily: fontFamily.appTextMedium,
                              marginLeft: wp(5),
                            }}>
                            Total
                          </Text>
                          <Text
                            style={{
                              fontSize: fontPixel(12),
                              color: colors.white,
                              fontFamily: fontFamily.appTextMedium,
                              marginLeft: wp(5),
                            }}>
                            {item?.Total}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                if (selectedValue != '') {
                  props.navigation.navigate(routes.Familia);
                } else {
                  Alert.alert('LLENAR PARA CONTINUAR')
                }
              }}
              style={[styles.container, { zIndex: -1, borderRadius: wp(5), borderColor: colors.green, width: wp(40), }]}>
              <View style={[styles.leftView, { borderRadius: wp(5), backgroundColor: colors.green, }]}>
                <Image tintColor={colors.white} source={appIcons.plus} style={{ height: wp(9), width: wp(9) }} />
              </View>
              <View style={styles.rightView}>
                <Text
                  style={{
                    fontSize: fontPixel(16),
                    color: colors.green,
                    fontFamily: fontFamily.appTextBold,
                  }}>
                  {'FAMILIA'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => {
            const hasProfiles = getProfile && getProfile.length > 0;
            const hasFamilyProfiles = getFamilyProfile && getFamilyProfile.length > 0;

            if (selectedValue != '') {
              if (!hasProfiles && !hasFamilyProfiles) {
                Alert.alert('Sin rescates por enviar');
                return;
              }
              setConfirmModalVisible(!confirmModalVisible);
            } else {
              Alert.alert('LLENAR PARA CONTINUAR');
            }
          }}
            style={[styles.container, { zIndex: -1, right: 5, borderRadius: wp(3), bottom: 0, alignSelf: "flex-end", borderColor: colors.redishColor, width: wp(40), }]}>
            <View style={styles.rightView}>
              <Text style={{ fontSize: fontPixel(16), color: colors.redishColor, fontFamily: fontFamily.appTextBold, }}>{' ENVIAR'}</Text>
            </View>
            <View style={[{ borderRadius: wp(2), backgroundColor: colors.redishColor, padding: 6 }]}>
              <MaterialCommunityIcons name="send" size={30} color="#fff" />
            </View>
          </TouchableOpacity>
        </ScrollView>

        <PopupMenu
          modalVisible={modalVisible}
          onclose={() => setModalVisible(!modalVisible)}
        />
        <ConfirmModal
          modalVisible={confirmModalVisible}
          onclose={() => setConfirmModalVisible(!confirmModalVisible)}
          onSave={() => confirmData()}
          isSubmitting={isSubmitting}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={caravanaModalVisible}
          onRequestClose={() => setCaravanaModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View style={{ backgroundColor: colors.redishColor, padding: 20, width: '80%', borderRadius: 10 }}>
              <Text style={{ fontSize: fontPixel(20), fontFamily: fontFamily.appTextSemiBold, color: colors.brownishColor, textAlign: 'center', marginBottom: 15 }}>
                Nombre de la Caravana
              </Text>
              <TextInput
                style={{ backgroundColor: colors.white, padding: 10, borderRadius: 5, color: colors.black, fontFamily: fontFamily.appTextMedium, marginBottom: 15 }}
                placeholder="Escribe el nombre aquí..."
                placeholderTextColor={colors.grey_Text}
                maxLength={49}
                value={caravanaName}
                onChangeText={(text) => setCaravanaName(text)}
              />
              <TouchableOpacity
                style={{ backgroundColor: colors.brownishColor, padding: 12, borderRadius: 5, alignItems: 'center' }}
                onPress={() => {
                  if (caravanaName.trim() === '') {
                    Alert.alert('Error', 'Por favor ingresa un nombre para la caravana.');
                  } else {
                    setCaravanaModalVisible(false);
                  }
                }}
              >
                <Text style={{ color: colors.redishColor, fontFamily: fontFamily.appTextBold, fontSize: fontPixel(14) }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </WrapperComponent >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainTitle: {
    fontSize: fontPixel(32),
    color: colors.brownishColor,
    fontFamily: fontFamily.appTextBold,
    textTransform: 'uppercase'
  },
  mainDes: {
    fontSize: fontPixel(14),
    color: colors.brownishColor,
    fontFamily: fontFamily.appTextBold,
  },
  description: {
    marginVertical: hp(1),
    // marginHorizontal: wp(8),
    fontSize: fontPixel(24),
    color: colors.grey_Text,
    fontFamily: fontFamily.appTextBold,
    textAlign: "center"
  },
  dateText: {
    fontSize: fontPixel(20),
    color: colors.grey_Text,
    fontFamily: fontFamily.appTextMedium,
    textAlign: 'center',
    marginLeft: wp(2),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderWidth: 3,
    margin: 10,
    marginVertical: wp(5),
  },
  leftView: {
    marginRight: 10,
  },
  rightView: {
    flex: 1,
  },
  iconButton: {
    padding: wp(2),
    position: 'absolute',
    backgroundColor: colors.green,
    bottom: -10,
    right: 5,
    borderRadius: wp(20),
  },
});
