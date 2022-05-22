import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Keyboard, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

import CONSTANTS from '../styles/constants';
import ReHashButton from './ReHashButton';

export default AuthFooterComponent = props => {
  const navigation = useNavigation();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setShowButton(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setShowButton(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (showButton) {
    return (
      <>
        <View style={styles.buttContainer}>
          <ReHashButton
            title={props?.buttonTitle}
            onPress={() =>
              props?.onButtonPress ? props?.onButtonPress() : null
            }
          />
        </View>
        {props?.alreadyHaveAccount && (
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text style={styles.alreadyAccount}>Already have an account? </Text>
            <Text
              onPress={() =>
                navigation.navigate('SignUp', {screenType: 'login'})
              }
              style={[styles.alreadyAccount, styles.loginLabel]}>
              Login.
            </Text>
          </View>
        )}
        {props?.dontHaveAccount && (
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text style={styles.alreadyAccount}>Don’t have an account? </Text>
            <Text
              onPress={() =>
                navigation.navigate('SignUp', {screenType: 'signup'})
              }
              style={[styles.alreadyAccount, styles.loginLabel]}>
              Signup.
            </Text>
          </View>
        )}
        {props?.termOfService ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={props?.onPressTermService}>
            <Text style={styles.termsLabel}>Terms of service</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  buttContainer: {
    marginBottom: hp('2.5%'),
    zIndex: 5,
  },
  termsLabel: {
    marginVertical: hp('1.5%'),
    fontWeight: '400',
    fontSize: wp('3.8%'),
    color: CONSTANTS.COLOR_DARK_GREY,
    opacity: 0.45,
    textAlign: 'center',
  },
  alreadyAccount: {
    fontWeight: '500',
    fontSize: wp('4%'),
    color: CONSTANTS.COLOR_DARK_GREY,
    opacity: 0.4,
    textAlign: 'center',
  },
  loginLabel: {
    color: CONSTANTS.PRIMARY_COLOR,
    fontWeight: 'bold',
    opacity: 1,
  },
});
