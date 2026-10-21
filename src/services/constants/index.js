import { Dimensions, PixelRatio } from 'react-native';

const BASE_URL = 'https://ruie2025.dgcor.com';

// URL fija para obtener la configuración dinámica del servidor
export const VALIDATION_URL = 'https://ruie.inami.gob.mx/info/validacionL';
export const FALLBACK_BASE_URL = BASE_URL;

// Función dinámica — recibe la URL guardada en Redux
export const getEndPoints = (baseUrl = BASE_URL) => ({
  signIn:       baseUrl + '/login/validar/',
  airportTypes: baseUrl + '/info/PuntosI',
  Municipios:   baseUrl + '/info/Municipios',
  Fuerza:       baseUrl + '/info/Fuerza',
  Paises:       baseUrl + '/info/Paises',
  InsertR:      baseUrl + '/registro/insertR',
  InsertC:      baseUrl + '/registro/insertC',
});

// Compatibilidad con código existente que importa endPoints directamente
export const endPoints = getEndPoints(BASE_URL);

export const storageKey = {
    user: 'user',
    userName: 'userName',
    wishlist: 'wishlist',
    cart: 'cart',
    searchedData: 'searchedData'
}

export const routes = {
    auth: 'auth',
    tab: 'TabNavigator',
    splash: 'splash',
    login: 'login',
    signup: 'signup',
    nacionalidad: 'nacionalidad',
    Familia: 'Familia',
    profile: 'profile',
    fileCheck: 'fileCheck',
    GUARDAR: 'GUARDAR'
}

export const screenHeight = {
    height3: Math.round((3 / 100) * Dimensions.get('window').height),
    height7: Math.round((7 / 100) * Dimensions.get('window').height),
    height8: Math.round((8.5 / 100) * Dimensions.get('window').height),
    height10: Math.round((10 / 100) * Dimensions.get('window').height),
    height12: Math.round((12.5 / 100) * Dimensions.get('window').height),
    height15: Math.round((15 / 100) * Dimensions.get('window').height),
    height17: Math.round((17 / 100) * Dimensions.get('window').height),
    height20: Math.round((20 / 100) * Dimensions.get('window').height),
    height22: Math.round((22 / 100) * Dimensions.get('window').height),
    height25: Math.round((25 / 100) * Dimensions.get('window').height),
    height28: Math.round((28 / 100) * Dimensions.get('window').height),
    height30: Math.round((30 / 100) * Dimensions.get('window').height),
    height35: Math.round((35 / 100) * Dimensions.get('window').height),
    height40: Math.round((40 / 100) * Dimensions.get('window').height),
    height45: Math.round((45 / 100) * Dimensions.get('window').height),
    height50: Math.round((50 / 100) * Dimensions.get('window').height),
    height55: Math.round((55 / 100) * Dimensions.get('window').height),
    height60: Math.round((60 / 100) * Dimensions.get('window').height),
    height62: Math.round((62 / 100) * Dimensions.get('window').height),
    height70: Math.round((70 / 100) * Dimensions.get('window').height),
    height80: Math.round((80 / 100) * Dimensions.get('window').height),
    height90: Math.round((90 / 100) * Dimensions.get('window').height),
    height100: Math.round(Dimensions.get('window').height),
};

export const screenWidth = {
    width10: Math.round((10 / 100) * Dimensions.get('window').width),
    width15: Math.round((15 / 100) * Dimensions.get('window').width),
    width17: Math.round((17 / 100) * Dimensions.get('window').width),
    width20: Math.round((20 / 100) * Dimensions.get('window').width),
    width22: Math.round((22 / 100) * Dimensions.get('window').width),
    width25: Math.round((25 / 100) * Dimensions.get('window').width),
    width30: Math.round((30 / 100) * Dimensions.get('window').width),
    width33: Math.round((33 / 100) * Dimensions.get('window').width),
    width35: Math.round((35 / 100) * Dimensions.get('window').width),
    width40: Math.round((40 / 100) * Dimensions.get('window').width),
    width45: Math.round((45 / 100) * Dimensions.get('window').width),
    width46: Math.round((46 / 100) * Dimensions.get('window').width),
    width50: Math.round((50 / 100) * Dimensions.get('window').width),
    width55: Math.round((55 / 100) * Dimensions.get('window').width),
    width60: Math.round((60 / 100) * Dimensions.get('window').width),
    width65: Math.round((65 / 100) * Dimensions.get('window').width),
    width70: Math.round((70 / 100) * Dimensions.get('window').width),
    width75: Math.round((75 / 100) * Dimensions.get('window').width),
    width80: Math.round((80 / 100) * Dimensions.get('window').width),
    width90: Math.round((90 / 100) * Dimensions.get('window').width),
    width95: Math.round((95 / 100) * Dimensions.get('window').width),
    width100: Math.round(Dimensions.get('window').width),
};

const { width, height } = Dimensions.get('window');

export const wp = (p) => width * (p / 100);
export const hp = (p) => height * (p / 100);

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const widthBaseScale = SCREEN_WIDTH / 375;
const heightBaseScale = SCREEN_HEIGHT / 812;

function normalize(size, based = 'width') {
    const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
export const widthPixel = size => {
    return normalize(size, 'width');
};
export const heightPixel = size => {
    return normalize(size, 'height');
};
export const fontPixel = size => {
    return heightPixel(size);
};
