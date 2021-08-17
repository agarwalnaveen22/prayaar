import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';

export default PageHeading = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp("90%"),
        alignSelf: "center",
        paddingVertical: hp("2%")
    },
    textStyle: {
        color: CONSTANTS.COLOR_DARK_GREY,
        fontWeight: "500",
        fontSize: wp("4.5%")
    }
})