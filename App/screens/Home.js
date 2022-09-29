import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';

import Header from '../components/Header';
import TempleBlock from '../components/TempleBlock';
import CONSTANTS from '../styles/constants';
import FullPageLoader from '../components/FullPageLoader';
import {getTempleList, getPopularTempleList} from '../services/TempleApi';

let temples = [];

export default Home = ({navigation}) => {
  const [allTemples, setAllTemples] = useState(null);
  const [allPopularTemples, setAllPopularTemples] = useState([]);
  const [templeImageUrl, setTempleImageUrl] = useState(null);
  const [search, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loader, setLoader] = useState(true);
  const [isFetchingTemple, setIsFetchingTemple] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (search) {
        if (searchValue.length) {
          setSearchValue('');
          setSearch(false);
          setAllTemples(temples);
        } else {
          BackHandler.exitApp();
        }
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [search, searchValue]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPopularTemples();
      getTemples();
    });
    return unsubscribe;
  }, [navigation]);

  const getTemples = async () => {
    await getTempleList()
      .then(res => {
        if (res.status == 1 || res.status === true) {
          if (res?.message?.length) {
            temples = res?.message;
            setAllTemples(res?.message);
          }
          setTempleImageUrl(res?.url);
        } else {
          if (res.message) {
            showMessage({
              message: res?.message,
              type: 'danger',
            });
          }
        }
        setLoader(false);
        setIsFetchingTemple(false);
      })
      .catch(ee => {
        setLoader(false);
        setIsFetchingTemple(false);
      });
  };

  const getPopularTemples = async () => {
    await getPopularTempleList()
      .then(res => {
        if (res.status == 1 || res.status === true) {
          res?.message?.length && setAllPopularTemples(res?.message);
          setTempleImageUrl(res?.url);
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

  const sectionHeader = (title = '') => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );

  const navigateToDetail = item => {
    navigation.navigate('Details', {temple: item, url: templeImageUrl});
    setSearchValue('');
    setSearch(false);
    setAllTemples(temples);
  };

  const renderPopularItem = ({item}) => (
    <TempleBlock
      temple={item}
      type={'fixed'}
      onPress={() => navigateToDetail(item)}
      url={templeImageUrl}
    />
  );

  const renderAllItem = ({item}) => (
    <TempleBlock
      temple={item}
      type={'full'}
      onPress={() => navigateToDetail(item)}
      url={templeImageUrl}
    />
  );

  const onSearch = text => {
    if (text.length) {
      setSearchValue(text);
      setSearch(true);
      let data = temples.filter(item =>
        item?.name?.toLowerCase().includes(text.toLowerCase()),
      );
      setAllTemples(data);
    } else {
      setSearchValue('');
      setSearch(false);
      setAllTemples(temples);
    }
  };

  const noDataFound = () => (
    <View style={{alignItems: 'center', flex: 1, marginTop: hp('5%')}}>
      <Image
        source={require('../assets/image/temple_no_image.jpeg')}
        style={{
          width: wp('50%'),
          height: hp('30%'),
        }}
      />
      <Text
        style={{
          fontSize: wp('4.5%'),
          marginTop: hp('5%'),
          textAlign: 'center',
          width: wp('80%'),
        }}>
        Sorry, No such temple information is found in our database!
      </Text>
    </View>
  );

  const onRefresh = () => {
    if (!isFetchingTemple) {
      setIsFetchingTemple(true);
      getPopularTemples();
      getTemples();
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <FullPageLoader show={loader} />
      <Header searchValue={searchValue} onSearch={onSearch} />
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
        }}>
        {allTemples !== null && (
          <FlatList
            ListHeaderComponent={() => {
              return !search &&
                allPopularTemples &&
                allPopularTemples.length ? (
                <>
                  {sectionHeader('Popular temples')}
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={allPopularTemples}
                    renderItem={renderPopularItem}
                    keyExtractor={item => item.id}
                  />
                  {sectionHeader('All temples')}
                </>
              ) : (
                sectionHeader('All temples')
              );
            }}
            showsHorizontalScrollIndicator={true}
            data={allTemples}
            renderItem={renderAllItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={noDataFound()}
            onRefresh={() => (!isFetchingTemple ? onRefresh() : null)}
            refreshing={isFetchingTemple}
            ListFooterComponent={() => <View style={{height: hp('20%')}} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND,
  },
  sectionHeaderContainer: {
    paddingVertical: hp('1.5%'),
  },
  sectionHeaderTitle: {
    color: CONSTANTS.COLOR_DARK_GREY,
    fontWeight: 'bold',
    fontSize: wp('4.2%'),
  },
});
