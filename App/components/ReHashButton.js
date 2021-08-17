import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';


export default ReHashButton = ({ selected, title, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress()}
            style={[styles.container, selected ? styles.selectedContainer : null]}>
            <Text style={[styles.titleText, selected ? styles.selectedTitleText : null]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: hp("2%"),
        borderRadius: hp("1%"),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#C3C3C2"
    },
    selectedContainer: {
        borderWidth:0,
        backgroundColor: CONSTANTS.COLOR_ORANGE,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: wp("4%"),
        color: "#8D91A2"
    },
    selectedTitleText: {
        color: CONSTANTS.COLOR_WHITE
    }
})