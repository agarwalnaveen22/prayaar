import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const commonStyles = StyleSheet.create({
    screenBackground: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    screenBackgroundTwo: {
        flex: 1,
        backgroundColor: "#EDEEF2"
    },
    largeHeading: {
        fontWeight: "bold",
        fontSize: wp("8%"),
        color: "#434956"
    }
})