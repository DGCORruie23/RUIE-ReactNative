import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  airportTypes: null,
  Municipios: null,
  Fuerza: null,
  Paises: null,
  profileSave: null,
  FamiliesProfileSave: null,
  daltosRapid: null,
  ResumenData: null,
  puestisADisposicion: null,
  forwardData: {},
  InsertRData: null,
  InsertCData: null,
};

export const userDataSlice = createSlice({
  name: 'userDATA',
  initialState,
  reducers: {
    userData: (state, action) => {
      state.userData = action.payload;
    },
    getAirportTypes: (state, action) => {
      state.airportTypes = action.payload;
    },
    getMunicipios: (state, action) => {
      state.Municipios = action.payload;
    },
    getFuerza: (state, action) => {
      state.Fuerza = action.payload;
    },
    getPaises: (state, action) => {
      state.Paises = action.payload;
    },
    profileSaved: (state, action) => {
      state.profileSave = action.payload;
    },
    familiesProfileSave: (state, action) => {
      state.FamiliesProfileSave = action.payload;
    },
    DaltosRapid: (state, action) => {
      state.daltosRapid = action.payload;
    },
    SaveResumenData: (state, action) => {
      state.ResumenData = action.payload;
    },
    SavePuestisADisposicion: (state, action) => {
      state.puestisADisposicion = action.payload;
    },
    SaveForwardData: (state, action) => {
      state.forwardData = action.payload;
    },
    SaveInsertRData: (state, action) => {
      state.InsertRData = action.payload;
    },
    SaveInsertCData: (state, action) => {
      state.InsertCData = action.payload;
    },
  },
});

export const {
  userData,
  getAirportTypes,
  getMunicipios,
  getFuerza,
  getPaises,
  profileSaved,
  familiesProfileSave,
  DaltosRapid,
  SaveResumenData,
  SavePuestisADisposicion,
  SaveForwardData,
  SaveInsertRData,
  SaveInsertCData,
} = userDataSlice.actions;

export default userDataSlice.reducer;
