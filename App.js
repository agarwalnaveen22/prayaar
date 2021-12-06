/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigation from './App/navigations'
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FullPageLoader from './App/components/FullPageLoader';
import { SafeAreaView } from 'react-native-safe-area-context';

const App: () => Node = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FF8B43',
      placeholder: "rgba(0.29, 0.33, 0.38, 0.45)",
    },
  };

  const [loggedIn, setLoggedIn] = useState(null)
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    global.user = null
    global.access_token = null
    checktoken()
  }, [])

  const checktoken = async () => {
    try {
      value = await AsyncStorage.getItem('access_token');
    } catch (err) {
      console.log("Access token not found")
    }

    try {
      let user = await AsyncStorage.getItem('user_data');
      global.user = JSON.parse(user)
    } catch (err) {
      console.log("User not found")
    }

    if (value) {
      global.access_token = value
      setLoggedIn(true)
      setLoader(false)
      SplashScreen.hide()
    }
    else {
      setLoggedIn(false)
      setLoader(false)
      SplashScreen.hide()
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        {
          loader ?
            // <FullPageLoader show={loader} />
            null
            :
            <Navigation loggedIn={loggedIn} />
        }
      </SafeAreaView>
      <FlashMessage position="bottom" floating={true} autoHide={true} />
    </PaperProvider>
  );
};

export default App;
