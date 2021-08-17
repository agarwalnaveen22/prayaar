import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';

export default TempleBlock = ({ temple, type, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress()}
            style={[styles.container, type === "full" ? styles.fullContainer : null]}>
            <Image
                source={temple.image}
                style={[styles.imageStyle, type === "full" ? styles.fullImageStyle : null]}
            />
            <View style={styles.textContainer}>
                <Text
                    numberOfLines={1}
                    style={styles.headingText}>{temple.name}</Text>
                <Text
                    numberOfLines={1}
                    style={styles.subHeadingText}>{temple.location}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp("32%"),
        marginRight: wp("5%"),
        backgroundColor: CONSTANTS.COLOR_WHITE,
        borderRadius: hp("1%"),
        paddingBottom: hp("1.5%")
    },
    fullContainer: {
        width: wp("90%"),
        marginRight: 0,
        marginBottom: hp("2%")
    },
    imageStyle: {
        borderTopLeftRadius: hp("1%"),
        borderTopRightRadius: hp("1%"),
        height: hp("10%"),
        width: "100%"
    },
    fullImageStyle: {
        height: hp("20%"),
    },
    textContainer: {
        paddingHorizontal: wp("2%")
    },
    headingText: {
        fontFamily: "GothamMedium",
        color: CONSTANTS.COLOR_DARK_GREY,
        fontSize: wp("3.5%"),
        fontWeight: "500",
        marginTop: hp("1%")
    },
    subHeadingText: {
        color: CONSTANTS.COLOR_LIGHT_GREY,
        fontSize: wp("3%"),
        marginTop: hp(".5%")
    }
})