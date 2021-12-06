import React from 'react';
import { View } from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';

export default BackgroundView = () => {
    return (
        <View style={{
            position: "absolute",
            height: hp("60%"),
            width: wp("100%"),
            backgroundColor: CONSTANTS.COLOR_LIGHT_YELLOW,
            borderBottomLeftRadius: hp("2%"),
            borderBottomRightRadius: hp("2%")
        }} />
    )
}