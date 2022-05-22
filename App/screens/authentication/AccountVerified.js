import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../styles/constants';

import AuthHeader from '../../components/AuthHeader';
import ReHashButton from '../../components/ReHashButton';
import {commonStyles} from '../../utilities/styles';
import FullPageLoader from '../../components/FullPageLoader';
import {login} from '../../services/AuthApi';
import colors from '../../utilities/colors';

export default AccountVerified = ({route, navigation}) => {
  const [loader, setLoader] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    loginUser();
  }, [route]);

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const loginUser = async () => {
    let data = {
      email: route?.params?.email,
      password: route?.params?.password,
      app_type: 'user',
    };
    setLoader(true);
    console.log('data', data);
    await login(data)
      .then(async res => {
        if (res.status) {
          setLoginSuccess(true);
          await AsyncStorage.setItem('access_token', res?.token);
          await AsyncStorage.setItem(
            'user_data',
            JSON.stringify(res?.userdata),
          );
          // showMessage({
          //     message: "Suucessfully logged in",
          //     type: "success",
          // });
          // navigation?.replace("appStack")
        } else {
          if (res.message) {
            showMessage({
              message: res.message,
              type: 'danger',
            });
          }
        }
        setLoader(false);
      })
      .catch(ee => {
        setLoader(false);
      });
  };

  const navigateUser = () => {
    if (loginSuccess) {
      navigation?.replace('appStack');
    } else {
      loginUser();
    }
  };
  return (
    <SafeAreaView style={commonStyles.screenBackground}>
      <FullPageLoader show={loader} />
      <>
        <View style={styles.screenContainer}>
          <AuthHeader title="Account verified" />
          <View style={styles.successContainer}>
            <Image
              source={require('../../assets/image/verified.png')}
              style={{
                width: wp('30%'),
                height: hp('10%'),
              }}
              resizeMode="contain"
            />
            <Text style={styles.successHeadingText}>
              Your account has been verified successfully.
            </Text>
            <Text style={styles.successSubHeadingText}>
              You can book tickets now
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <ReHashButton
            title="BOOK TICKETS NOW"
            onPress={() => navigateUser()}
          />
        </View>
        <Text
          style={{
            marginTop: hp('6%'),
            marginBottom: hp('4%'),
            alignSelf: 'center',
            fontSize: wp('3.4%'),
            fontWeight: '400',
            color: colors.COLOR_DARK_GREY,
            opacity: 0.45,
          }}>
          OR
        </Text>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigateUser()}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: wp('4%'),
              fontWeight: '700',
              color: '#FF8C41',
            }}>
            Donate Now
          </Text>
        </TouchableOpacity>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    alignSelf: 'center',
    backgroundColor: CONSTANTS.COLOR_LIGHT_YELLOW,
  },
  successContainer: {
    backgroundColor: CONSTANTS.COLOR_LIGHT_GREEN,
    bottom: -hp('3%'),
    alignItems: 'center',
    paddingTop: hp('5%'),
    paddingBottom: hp('3%'),
  },
  successHeadingText: {
    fontSize: wp('4.2%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('2%'),
    color: CONSTANTS.COLOR_DARK_GREY,
    width: wp('50%'),
  },
  successSubHeadingText: {
    marginTop: hp('2%'),
    fontSize: wp('3.5%'),
    fontWeight: '400',
    textAlign: 'center',
    color: CONSTANTS.COLOR_LABEL,
    width: wp('40%'),
  },
  buttonContainer: {
    zIndex: -10,
    width: wp('90%'),
    alignSelf: 'center',
    marginTop: hp('10%'),
  },
});
