import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, View, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../styles/constants';

import AuthHeader from "../../components/AuthHeader";
import ReHashButton from '../../components/ReHashButton';
import { commonStyles } from "../../utilities/styles";
import FullPageLoader from "../../components/FullPageLoader";
import { login } from '../../services/AuthApi';

export default AccountVerified = ({ route, navigation }) => {

    const [loader, setLoader] = useState(false)
    const loginUser = async () => {
        let data = {
            email: route?.params?.email,
            password: route?.params?.password,
        }
        setLoader(true)
        console.log("data",data)
        await login(data).then(async (res) => {
            if (res.status) {
                await AsyncStorage.setItem('access_token', res?.token)
                await AsyncStorage.setItem('user_data', JSON.stringify(res?.userdata))
                showMessage({
                    message: "Suucessfully logged in",
                    type: "success",
                });
                navigation?.replace("appStack")
            } else {
                if (res.message) {
                    showMessage({
                        message: res.message,
                        type: "danger",
                    })
                }
            }
            setLoader(false)
        }).catch((ee) => {
            setLoader(false)
        })
    }
    return (
        <SafeAreaView style={commonStyles.screenBackground}>
            <FullPageLoader show={loader} />
            <>
                <View style={styles.screenContainer}>
                    <AuthHeader title="Account verified" />
                    <View style={styles.successContainer}>
                        <Image
                            source={require('../../assets/image/verified.png')}
                            style={{
                                width: wp("30%"),
                                height: hp("10%")
                            }}
                            resizeMode="contain"
                        />
                        <Text style={styles.successHeadingText} >Your account has been verified successfully.</Text>
                        <Text style={styles.successSubHeadingText} >You can book tickets now</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <ReHashButton
                        title="BOOK TICKETS NOW"
                        onPress={() => loginUser()}
                    />
                </View>
            </>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        width: wp("100%"),
        paddingHorizontal: wp("5%"),
        alignSelf: "center",
        backgroundColor: CONSTANTS.COLOR_LIGHT_YELLOW
    },
    successContainer: {
        backgroundColor: CONSTANTS.COLOR_LIGHT_GREEN,
        bottom: -hp("5%"),
        alignItems: "center",
        paddingVertical: hp("5%"),
        borderRadius: hp("1%")
    },
    successHeadingText: {
        fontSize: wp("4.2%"),
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: hp("2%"),
        color: CONSTANTS.COLOR_DARK_GREY,
        width: wp("50%")
    },
    successSubHeadingText: {
        fontSize: wp("3.5%"),
        fontWeight: "400",
        textAlign: "center",
        color: CONSTANTS.COLOR_LABEL,
        width: wp("50%")
    },
    buttonContainer: {
        zIndex:-10,
        width: wp("90%"),
        alignSelf: "center",
        marginTop: hp("10%")
    }
})