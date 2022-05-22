import React from 'react';
import {SafeAreaView, Modal, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const WebViewComponent = props => {
  const {url = 'https://www.google.co.in/', visible, onClose} = props;
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        this.setModalVisible(!modalVisible);
      }}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingHorizontal: wp('5%'),
              paddingVertical: hp('1%'),
            }}>
            <Icon name="close" size={wp('6%')} color={colors.primaryColor} />
          </TouchableOpacity>
        </View>
        <WebView source={{uri: url}} />
      </SafeAreaView>
    </Modal>
  );
};

export default WebViewComponent;
