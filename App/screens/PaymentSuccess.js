import React, {useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';

import CONSTANTS from '../styles/constants';
import BackgroundImage from '../components/BackgroundImage';
import Header from '../components/Header';

export default PaymentSuccess = ({route, navigation}) => {
  const {type, bookingId} = route.params || {};

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Temples');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Header heading={'Payment successful'} />
      <View>
        <BackgroundImage />
        <View style={styles.paymentDataContainer}>
          <Image
            source={require('../assets/image/success.png')}
            style={{
              backgroundColor: 'transparent',
              marginTop: hp('3%'),
              resizeMode: 'contain',
              width: wp('20%'),
              height: hp('8%'),
            }}
          />
          <Text
            style={{
              width: wp('50%'),
              marginTop: hp('3%'),
              textAlign: 'center',
              fontSize: wp('4.5%'),
              fontWeight: 'bold',
              color: CONSTANTS.COLOR_DARK_GREY,
            }}>
            {type === 'donate'
              ? 'Your donation has been successful.'
              : 'Your payment has been successful.'}
          </Text>
          <Text
            style={{
              width: wp('60%'),
              marginTop: hp('2%'),
              textAlign: 'center',
              fontSize: wp('3.5%'),
              color: '#8D91A2',
            }}>
            {type === 'donate'
              ? 'We have sent you an email with the invoice'
              : 'We have sent you an email with tickets and invoice'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Temples')}>
            <Text
              style={{
                marginTop: hp('3%'),
                textAlign: 'center',
                fontSize: wp('3.5%'),
                fontWeight: 'bold',
                color: '#FF8C41',
              }}>
              {'TAKE ME HOME'}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: hp('10%'),
              textAlign: 'center',
              fontSize: wp('3.2%'),
              fontWeight: '500',
              color: '#8D91A2',
            }}>
            {type === 'donate' ? '' : 'View your tickets in'}
          </Text>
          {type !== 'donate' ? (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('BookedTicket')}>
              <Text
                style={{
                  marginTop: hp('.5%'),
                  textAlign: 'center',
                  fontSize: wp('3.2%'),
                  fontWeight: '500',
                  color: '#FF8C41',
                }}>
                Booked tickets.
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {type === 'book' ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp('3%'),
          }}>
          <QRCode value={String(bookingId)} backgroundColor="transparent" />
          <Text
            style={{
              marginTop: hp('1%'),
              textAlign: 'center',
              fontSize: wp('3.2%'),
              fontWeight: 'bold',
              color: '#8D91A2',
            }}>
            SHOW THIS QR CODE AT THE ENTRANCE
          </Text>
          <Text
            style={{
              marginTop: hp('5%'),
              textAlign: 'center',
              fontSize: wp('3%'),
              color: '#8D91A2',
            }}>
            OR REMEMBER THE CODE
          </Text>
          <Text
            style={{
              marginTop: hp('1%'),
              textAlign: 'center',
              fontSize: wp('3.8%'),
              fontWeight: 'bold',
              color: '#1B1B1B',
            }}>
            {bookingId}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND,
  },
  paymentDataContainer: {
    marginTop: hp('2%'),
    width: wp('90%'),
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#DBFFC5',
    paddingBottom: hp('2%'),
    shadowColor: '#979797',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.21,
    shadowRadius: 6,

    elevation: 5,
  },
});
