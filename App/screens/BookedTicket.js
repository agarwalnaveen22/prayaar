import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';

import PageHeading from '../components/PageHeading';
import CONSTANTS from '../styles/constants';
import BackgroundView from '../components/BackgroundView';
import BookedCard from '../components/BookedCard';
import FullPageLoader from '../components/FullPageLoader';
import {bookedTicketList} from '../services/TempleApi';
import Header from '../components/Header';

export default BookedTicket = ({navigation}) => {
  const [loader, setLoader] = useState(true);
  const [bookedTickets, setBookedTickets] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookedTickets();
    });
    return unsubscribe;
  }, [navigation]);

  const getBookedTickets = async () => {
    await bookedTicketList()
      .then(res => {
        if (res.status == 1 || res.status === true) {
          res?.message && res?.message.length && setBookedTickets(res?.message);
        } else {
          if (res.message) {
            showMessage({
              message: res?.message,
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

  const renderAllItem = ({item}) => (
    <BookedCard
      key={1}
      image={'http://prayaar.tk/images/' + item?.filename?.uri}
      item={item}
      title={item?.temple_name}
      subTitle={`On ${item?.date}`}
    />
  );

  const noDataFound = () => (
    <View style={{alignItems: 'center', flex: 1, marginTop: hp('5%')}}>
      <Image
        source={require('../assets/image/temple_no_image.png')}
        style={{
          width: wp('50%'),
          height: hp('20%'),
        }}
      />
      <Text style={{fontSize: wp('4.5%'), marginTop: hp('5%')}}>
        You have not booked any tickets
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <BackgroundView />
      <Header heading="Bookings" />
      <FullPageLoader show={loader} />
      {bookedTickets !== null ? (
        <View
          style={{
            width: wp('90%'),
            alignSelf: 'center',
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={bookedTickets}
            renderItem={renderAllItem}
            keyExtractor={item => item.id}
            ListFooterComponent={() => <View style={{height: hp('10%')}} />}
            ListEmptyComponent={noDataFound()}
          />
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
  buttonContainer: {
    width: wp('80%'),
    alignSelf: 'center',
    marginTop: hp('4%'),
  },
});
