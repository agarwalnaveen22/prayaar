import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import CONSTANTS from '../styles/constants';


export default AuthHeader = ({ title, showBack, auth }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {showBack && <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.goBack()}
                style={styles.backContainer}
            >
                <Icon name="arrow-back-sharp" size={wp("7%")} style={styles.iconStyle} />
            </TouchableOpacity>
            }
            <Text style={[showBack ? styles.titleText : styles.subTitleText, auth && { color: CONSTANTS.PRIMARY_COLOR }]}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: hp("7%"),
    },
    backContainer: {
        width: wp("10%"),
        height: hp("7%"),
        justifyContent: "center",
    },
    iconStyle: {
        color: CONSTANTS.COLOR_DARK_GREY,
        opacity: 0.45,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: wp("4.2%"),
        color: CONSTANTS.COLOR_HEADING
    },
    subTitleText: {
        fontWeight: "bold",
        fontSize: wp("5%"),
        color: CONSTANTS.COLOR_HEADING
    }
})