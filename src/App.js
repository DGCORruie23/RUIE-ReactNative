import React, { Component } from 'react';
import { LogBox, View } from 'react-native';
import { MainNavigator } from './services/navigation';
// Redux Add
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./redux/store";

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <View style={{ flex: 1 }}>
            <MainNavigator />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;