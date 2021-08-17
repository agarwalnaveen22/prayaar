/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { Node } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import StackNavigation from './App/navigations/StackNavigation'
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from "react-native-flash-message";

const App: () => Node = () => {

  useEffect(() => {
    SplashScreen.hide()
  })

  return (
    <PaperProvider>
      <StackNavigation />
      <FlashMessage position="top" />
    </PaperProvider>
  );
};

export default App;
