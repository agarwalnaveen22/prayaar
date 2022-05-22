import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import RazorpayCheckout from 'react-native-razorpay';

import Header from '../components/Header.js';
import ReHashButton from '../components/ReHashButton';
import CONSTANTS from '../styles/constants';
import {getTempleTicketList, getSettings} from '../services/TempleApi.js';
import FullPageLoader from '../components/FullPageLoader.js';
import colors from '../utilities/colors.js';
import ReHashTextInput from '../components/ReHashTextInput.js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CONFIG from '../config';
import {bookTicket, confirmPayment} from '../services/TempleApi';
import {CommonActions} from '@react-navigation/native';
import {checkNetwork} from '../services/Api.js';

const amounts = [
  {
    price: 100,
    text: 'Laghu darshan',
  },
  {
    price: 200,
    text: 'Madhya darshan',
  },
  {
    price: 300,
    text: 'Sarva darshan',
  },
];

export default Details = ({route, navigation}) => {
  const {temple, url} = route.params;

  const [selectedOption, setSelectedOption] = useState(null);
  const [donation, setDonation] = useState('');
  const [tickets, setTickets] = useState([]);
  const [taxVariables, setTaxVariables] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [amount, setAmount] = useState(null);
  const [noOfTickets, setNoOfTickets] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const [people, setPeople] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [loader, setLoader] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    getTickets();
    getGst();
  }, []);

  const getTickets = async () => {
    await getTempleTicketList({temple_id: temple?.id})
      .then(res => {
        if (res.status == 1 || res.status === true) {
          if (res?.message?.length) {
            console.log('getTempleTicketList', res);
            setTickets(res?.message);
            let data = res?.message[0];
            setAmount(data?.price);
            setNoOfTickets(data?.remaining_ticket);
            setTicketType(data?.name);
            setSelectedTicketId(data?.id);
            setSelectedTicket(data);
          }
          // if (res?.message.length === 1) {
          //     let data = res?.message[0]
          //     setAmount(data?.price)
          //     setTicketType(data?.name)
          //     setSelectedTicketId(data?.id)
          //     setSelectedTicket(data)
          // }
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

  const getGst = async () => {
    await getSettings()
      .then(res => {
        if (res.status == 1 || res.status === true) {
          res?.message && setTaxVariables(res?.message);
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

  const peopleController = type => {
    let no = 0;
    if (type === 'add') {
      no = people + 1;
    } else {
      no = people - 1;
      if (no < 0) {
        no = 0;
      }
    }
    console.log('no', no);
    console.log('temple', temple);
    if (no <= noOfTickets) {
      setPeople(no);
    }
  };

  const onDateChange = date => {
    setDate(date);
  };

  const showCalendar = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => {
          setCalendarVisible(false);
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setCalendarVisible(false)}
          style={styles.modalOutterContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => null}
            style={styles.modalInnerContainer}>
            <CalendarPicker
              onDateChange={onDateChange}
              minDate={
                moment(selectedTicket?.date_from) < moment(new Date())
                  ? moment(new Date())
                  : moment(selectedTicket?.date_from)
              }
              maxDate={
                selectedOption === 'donate'
                  ? null
                  : moment(selectedTicket?.date_to)
              }
              selectedDayColor={CONSTANTS.COLOR_YELLOW}
              width={wp('95%')}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setDate(''), setCalendarVisible(false);
                }}
                style={styles.modalButton}>
                <Text
                  style={{
                    color: '#BDBDBD',
                    fontSize: wp('3.6%'),
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setCalendarVisible(false)}
                style={styles.modalButton}>
                <Text
                  style={{
                    color: '#FF8A43',
                    fontSize: wp('3.6%'),
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const showTime = () => {
    if (timeVisible) {
      if (Platform.OS === 'ios') {
        return (
          <Modal
            animationType="slide"
            transparent={true}
            visible={timeVisible}
            onRequestClose={() => {
              setTimeVisible(false);
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setTimeVisible(false)}
              style={styles.modalOutterContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => null}
                style={styles.modalInnerContainer}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={time || new Date()}
                  mode={'time'}
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => setTime(selectedDate)}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      setTimeVisible(false);
                    }}
                    style={styles.modalButton}>
                    <Text
                      style={{
                        color: '#BDBDBD',
                        fontSize: wp('3.6%'),
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      setTime(time || new Date()), setTimeVisible(false);
                    }}
                    style={styles.modalButton}>
                    <Text
                      style={{
                        color: '#FF8A43',
                        fontSize: wp('3.6%'),
                      }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        );
      }
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={time || new Date()}
          mode={'time'}
          display="spinner"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setTimeVisible(false);
            event.type === 'dismissed'
              ? null
              : setTime(selectedDate || new Date());
          }}
        />
      );
    }
    return null;
  };

  const bookTemple = () => {
    if (
      noOfTickets >= people &&
      people > 0 &&
      amount > 0 &&
      date !== '' &&
      time !== '' &&
      selectedTicketId !== null
    ) {
      let ticketAmount = amount * people;
      let CGST = taxVariables?.CGST
        ? (ticketAmount * taxVariables?.CGST) / 100
        : 0;
      let SGST = taxVariables?.SGST
        ? (ticketAmount * taxVariables?.SGST) / 100
        : 0;
      let tax = CGST + SGST;
      let totaAmount = ticketAmount + tax;
      navigation.navigate('BookingDetails', {
        temple: {
          ...temple,
          date,
          time,
          amount,
          people,
          ticketType,
          selectedTicketId,
          totaAmount,
          tax,
        },
        url: url,
        taxVariables: taxVariables,
      });
    } else {
      if (date === '') {
        showMessage({
          message: 'Please select the Date',
          type: 'danger',
        });
        return;
      }
      if (time === '') {
        showMessage({
          message: 'Please select the Time',
          type: 'danger',
        });
        return;
      }
      if (people === 0) {
        showMessage({
          message: 'Please select total number of people',
          type: 'danger',
        });
        return;
      }
      if (selectedTicketId === null) {
        showMessage({
          message: 'Please select a Darshana',
          type: 'danger',
        });
        return;
      }
      if (people > noOfTickets) {
        showMessage({
          message: `There are only ${noOfTickets} tickets available`,
          type: 'danger',
        });
        return;
      }
    }
  };

  const donateTemple = () => {
    if (donation && donation > 0) {
      makePayment();
    } else {
      showMessage({
        message: 'Donation amount should be greater than 0',
        type: 'danger',
      });
    }
  };

  const makePayment = async () => {
    setLoader(true);
    let data = {
      booking_type: 0,
      temple_id: temple?.id,
      ticket_id: 0,
      date: moment(new Date()).format('YYYY-MM-DD'),
      amount: donation,
      no_of_tickets: 0,
      time: moment(new Date()).format('HH:mm:ss'),
      total_amount: donation,
      tax_amount: 0,
    };
    console.log('dawd', data);
    if (orderData) {
      openPayment(orderData, data?.total_amount);
    } else {
      await bookTicket(data)
        .then(res => {
          if (res.status && res?.result) {
            if (res?.result) {
              setOrderData(res?.result);
            }
            openPayment(res?.result, data?.total_amount);
          } else {
            if (res.message) {
              showMessage({
                message: res?.message,
                type: 'danger',
              });
            }
            setLoader(false);
          }
        })
        .catch(ee => {
          setLoader(false);
        });
    }
  };

  const openPayment = (orderData, totalAmount) => {
    let options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: CONFIG.RAZOR_PAY,
      amount: totalAmount,
      name: 'Acme Corp',
      order_id: orderData?.order_id, //Replace this with an order_id created using Orders API.
      prefill: {
        email: global.user?.email,
        contact: global.user?.phone_number,
        // name: 'Gaurav Kumar'
      },
      theme: {color: CONSTANTS.PRIMARY_COLOR},
    };
    console.log('option', options);
    RazorpayCheckout.open(options)
      .then(async data => {
        data.booking_id = orderData?.booking_id;
        console.log('data', data);
        await confirmPayment(data)
          .then(res => {
            if (res.status) {
              setLoader(false);
              navigation.navigate('PaymentSuccess', {type: 'donate'});
            } else {
              if (res.message) {
                showMessage({
                  message: res?.message,
                  type: 'danger',
                });
              }
              setLoader(false);
            }
          })
          .catch(ee => {
            setLoader(false);
          });
      })
      .catch(error => {
        // handle failure
        console.log('error', error);
        setLoader(false);
        showMessage({
          message:
            Platform.OS === 'ios'
              ? error?.description
              : error?.error?.description,
          type: 'danger',
        });
      });
  };

  const onOptionPress = async type => {
    if (global.access_token !== null) {
      let isNetwork = await checkNetwork();
      if (isNetwork) {
        setSelectedOption(type);
      } else {
        showMessage({
          message: 'Please connect to internet',
          type: 'danger',
        });
      }
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'authenticationStack',
              params: {
                screen: 'SocialLogin',
                // params:{
                //     screenType: 'login'
                // }
              },
            },
          ],
        }),
      );
    }
  };

  const bookTicketView = () => (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: hp('2%'),
        }}>
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setCalendarVisible(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="calendar" color={'#B7B7B7'} size={wp('4%')} />
              <Text style={[styles.labelStyle, {marginHorizontal: wp('2%')}]}>
                Select Date
              </Text>
              <Icon name="caret-down" color={'#B7B7B7'} size={wp('5%')} />
            </View>
            <Text style={styles.selectedTextStyle}>
              {date ? moment(date).format('DD MMM') : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setTimeVisible(true)}
            style={{marginTop: hp('2%')}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="clock-o" color={'#B7B7B7'} size={wp('4%')} />
              <Text style={[styles.labelStyle, {marginHorizontal: wp('2%')}]}>
                Select Time
              </Text>
              <Icon name="caret-down" color={'#B7B7B7'} size={wp('5%')} />
            </View>
            <Text style={styles.selectedTextStyle}>
              {time ? moment(time).format('hh:mm a') : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.labelStyle}>Number of people</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('1%'),
              alignSelf: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={people === 0 ? 1 : 0.5}
              onPress={() => (people === 0 ? null : peopleController('minus'))}
              style={[styles.peopleController, {backgroundColor: '#D8D8D8'}]}>
              <Icon name="minus" color={'#808080'} size={wp('4%')} />
            </TouchableOpacity>
            <Text
              style={{
                paddingHorizontal: wp('3%'),
                fontSize: wp('3.6'),
                color: CONSTANTS.COLOR_DARK_GREY,
              }}>
              {people}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => peopleController('add')}
              style={[styles.peopleController, {backgroundColor: '#FF8A43'}]}>
              <Icon name="plus" color={CONSTANTS.COLOR_WHITE} size={wp('4%')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {tickets.length ? (
        <>
          <Text style={[styles.labelStyle, {marginTop: hp('2%')}]}>
            {'Darshana details'}
          </Text>
          <View style={styles.amountsContainer}>
            {tickets.map(item => (
              <View style={{marginBottom: hp('1%')}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setNoOfTickets(item?.remaining_ticket),
                      setAmount(item.price),
                      setTicketType(item.name),
                      setSelectedTicket(item),
                      setSelectedTicketId(item?.id);
                  }}
                  style={[
                    styles.amountContainer,
                    item.price === amount ? {backgroundColor: '#FF8A43'} : null,
                  ]}>
                  <Text
                    style={[
                      styles.amountText,
                      item.price === amount
                        ? {color: CONSTANTS.COLOR_WHITE}
                        : null,
                    ]}>{`Rs. ${item.price}`}</Text>
                </TouchableOpacity>
                {item.price === amount && (
                  <Text
                    style={{
                      marginTop: hp('.5%'),
                      color: '#9C9C9C',
                      fontWeight: '500',
                      fontSize: wp('3%'),
                    }}>
                    {item?.name}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </>
      ) : null}
      <Text style={[styles.labelStyle, {marginTop: hp('3%')}]}>Total</Text>
      <Text
        style={{
          marginTop: hp('.5%'),
          color: CONSTANTS.COLOR_DARK_GREY,
          fontWeight: 'bold',
          fontSize: wp('4%'),
        }}>{`Rs. ${people ? people * amount : 0}`}</Text>
    </>
  );

  const donateView = () => (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: hp('2%'),
        }}>
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setCalendarVisible(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="calendar" color={'#B7B7B7'} size={wp('4%')} />
              <Text style={[styles.labelStyle, {marginHorizontal: wp('2%')}]}>
                Select Date
              </Text>
              <Icon name="caret-down" color={'#B7B7B7'} size={wp('5%')} />
            </View>
            <Text style={styles.selectedTextStyle}>
              {date ? moment(date).format('DD MMM') : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginTop: hp('2%')}}>
        <Text
          style={{
            color: colors.label,
            fontWeight: 'bold',
            fontSize: 13,
          }}>
          Donate
        </Text>
        <ReHashTextInput
          placeholder={'Please enter the amount to donate'}
          value={donation}
          onChangeText={val => {
            setDonation(val);
          }}
          keyboardType={'number-pad'}
        />
      </View>
      <Text style={[styles.labelStyle, {marginTop: hp('3%')}]}>Total</Text>
      <Text
        style={{
          marginTop: hp('.5%'),
          color: CONSTANTS.COLOR_DARK_GREY,
          fontWeight: 'bold',
          fontSize: wp('4%'),
        }}>{`Rs. ${donation ? donation : 0}`}</Text>
    </>
  );

  const checkInternet = async () => {
    let isNetwork = await checkNetwork();
    if (isNetwork) {
      selectedOption === 'donate' ? donateTemple() : bookTemple();
    } else {
      showMessage({
        message: 'Please connect to internet',
        type: 'danger',
      });
      return;
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <FullPageLoader show={loader} />
      <Header heading={'Temple Details'} />
      {showCalendar()}
      {showTime()}
      <ScrollView>
        <KeyboardAwareScrollView style={styles.detailContainer}>
          <Image
            source={
              temple?.filename?.length
                ? {uri: url + temple?.filename[0].uri}
                : ''
            }
            style={styles.fullImageStyle}
          />
          <View
            style={{
              paddingTop: hp('2%'),
              paddingHorizontal: wp('3%'),
            }}>
            <Text
              style={{
                color: CONSTANTS.COLOR_DARK_GREY,
                fontWeight: '500',
                fontSize: wp('3.6%'),
              }}>
              {temple.name}
            </Text>
            <Text style={[styles.labelStyle, {marginTop: hp('0.5%')}]}>
              {temple?.Address}
            </Text>
            {selectedOption === null ? (
              <View style={styles.optionContainer}>
                <TouchableOpacity
                  activeOpacity={tickets.length ? 0.5 : 1}
                  onPress={() =>
                    tickets.length ? onOptionPress('book') : null
                  }
                  style={{alignItems: 'center'}}>
                  <View
                    style={[
                      styles.optionImageContainer,
                      !tickets.length && {backgroundColor: '#F1F1F1'},
                    ]}>
                    <Image
                      source={require('../assets/image/ticket_booking.png')}
                      resizeMode="center"
                      style={{
                        width: wp('15%'),
                        height: wp('12%'),
                      }}
                      tintColor={!tickets.length ? '#CFCFCF' : '#FF8B40'}
                    />
                  </View>
                  <Text style={styles.optionText}>Book Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => onOptionPress('donate')}
                  style={{alignItems: 'center'}}>
                  <View
                    style={[
                      styles.optionImageContainer,
                      {
                        borderWidth: 2,
                        borderColor: '#FF8A43',
                      },
                    ]}>
                    <Image
                      source={require('../assets/image/ruppee.png')}
                      resizeMode="center"
                      style={{
                        width: wp('15%'),
                        height: wp('12%'),
                      }}
                    />
                  </View>
                  <Text style={styles.optionText}>Donate</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {selectedOption === 'book' ? bookTicketView() : null}
            {selectedOption === 'donate' ? donateView() : null}
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.buttonContainer}>
          {selectedOption !== null ? (
            <>
              <View style={{flex: 0.35}}>
                <ReHashButton
                  mode="outline"
                  onPress={() => navigation.goBack()}
                  title={'Back'}
                  contentStyle={{
                    borderRadius: hp('1%'),
                    borderWidth: 1,
                    borderColor: '#C3C3C2',
                  }}
                  labelStyle={{
                    color: '#8D91A2',
                  }}
                />
              </View>
              <View style={{flex: 0.55}}>
                <ReHashButton
                  selected={true}
                  onPress={() => checkInternet()}
                  title={selectedOption === 'donate' ? 'Donate' : 'Book'}
                />
              </View>
            </>
          ) : tickets.length || selectedOption === 'null' ? null : (
            <View style={styles.noTicketContainer}>
              <Text style={styles.noTicketText}>No Tickets available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND,
  },
  detailContainer: {
    backgroundColor: CONSTANTS.COLOR_WHITE,
    borderRadius: hp('1%'),
    marginTop: hp('3%'),
    width: wp('90%'),
    alignSelf: 'center',
    paddingBottom: hp('3%'),
    shadowColor: '#979797',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.21,
    shadowRadius: 6,

    elevation: 5,
  },
  fullImageStyle: {
    backgroundColor: CONSTANTS.COLOR_GREY,
    borderTopLeftRadius: hp('1%'),
    borderTopRightRadius: hp('1%'),
    height: hp('25%'),
    width: '100%',
  },
  peopleController: {
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('6%'),
    height: wp('6%'),
  },
  selectedTextStyle: {
    marginTop: hp('.5%'),
    marginLeft: wp('6%'),
    fontSize: wp('3.2%'),
    color: '#FF8A43',
  },
  labelStyle: {
    color: '#9C9C9C',
    fontSize: wp('3%'),
  },
  amountsContainer: {
    marginTop: hp('1%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: '#FF8A43',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('5%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('.5%'),
    borderRadius: hp('2%'),
  },
  amountText: {
    fontSize: wp('3.2%'),
    color: '#67696C',
  },
  buttonContainer: {
    width: wp('90%'),
    alignSelf: 'center',
    marginVertical: hp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOutterContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerContainer: {
    width: wp('95%'),
    backgroundColor: CONSTANTS.COLOR_WHITE,
    borderRadius: hp('1%'),
    paddingVertical: hp('1%'),
  },
  modalButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    marginLeft: wp('3%'),
  },
  noTicketContainer: {
    flex: 1,
    alignItems: 'center',
  },
  noTicketText: {
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: wp('4%'),
    color: '#8D91A2',
  },
  optionContainer: {
    marginTop: hp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionImageContainer: {
    backgroundColor: '#FFF7D8',
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('15%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    marginTop: hp('1%'),
    color: colors.label,
    fontSize: 16,
  },
});
