import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Platform, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showMessage } from "react-native-flash-message";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import CONSTANTS from '../../styles/constants';

import { commonStyles } from '../../utilities/styles';
import AuthHeader from '../../components/AuthHeader';
import AuthFooterComponent from '../../components/AuthFooterComponent';
import { lengthValidation } from '../../utilities/validation';
import { otpVerify } from '../../services/AuthApi';
import FullPageLoader from '../../components/FullPageLoader';

export default OtpVerify = (props) => {

    const [loader, setLoader] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpValid, setOtpValid] = useState(false)

    useEffect(() => {
        let isValid = !isNaN(otp) && lengthValidation(otp.trim(), 5)
        if (isValid !== otpValid) {
            setOtpValid(isValid)
        }
    }, [otp])

    submitOtp = async (code) => {
        if (otpValid) {
            let data = {
                phone_number: props?.route?.params?.phone_number,
                otp: code
            }
            setLoader(true)
            await otpVerify(data).then((res) => {
                if (res.status == 1 || res.status === true) {
                    // showMessage({
                    //     message: "Account verification successfull",
                    //     type: "success",
                    // });
                    props?.navigation?.replace("AccountVerified", { "email": props?.route?.params?.email, "password": props?.route?.params?.password })
                } else {
                    if (res.message) {
                        showMessage({
                            message: res?.message,
                            type: "danger",
                        })
                    }
                }
                setLoader(false)
            }).catch((ee) => {
                setLoader(false)
            })
            return
        } else {
            showMessage({
                message: "OTP is not valid",
                type: "danger",
            });
        }
    }

    return (
        <SafeAreaView style={commonStyles.screenBackground}>
            <FullPageLoader show={loader} />
            <View style={styles.screenContainer}>
                <AuthHeader title={"Login options"} showBack auth />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginLeft:wp("2%") }}>
                    <View style={{
                        height: Platform.OS === "ios" ? hp("73%") : hp("80%"),
                        justifyContent: "space-between",
                    }}>
                        <View>
                            <Text style={styles.createAccountLabel}>Verify through OTP</Text>
                            <Text style={commonStyles.largeHeading}>You will have a more secure account</Text>
                        </View>
                        <View>
                            <Text style={styles.otpLabel}>Enter the OTP you have recieved through SMS or Email</Text>
                            <OTPInputView
                                style={styles.otpContainerStyle}
                                pinCount={6}
                                code={otp}
                                onCodeChanged={code => setOtp(code)}
                                codeInputFieldStyle={styles.otpInputStyle}
                                onCodeFilled={(code) => {
                                    Keyboard.dismiss()
                                    submitOtp(code)
                                    console.log(`Code is ${code}, you are good to go!`)
                                }}
                                keyboard={"number-pad"}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <AuthFooterComponent
                    buttonTitle={"VERIFY"}
                    onButtonPress={() => submitOtp(otp)}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        width: wp("90%"),
        alignSelf: "center",
    },
    createAccountLabel: {
        marginTop: hp("2%"),
        marginBottom: hp("1%"),
        fontSize: wp("4%"),
        color: CONSTANTS.COLOR_DARK_GREY,
        opacity: 0.6
    },
    inputContainer: {
        marginTop: hp("3%")
    },
    otpLabel: {
        fontSize: wp("4.5%"),
        color: CONSTANTS.COLOR_DARK_GREY,
        lineHeight: 25,
        width: wp("85%")
    },
    otpInputStyle: {
        borderWidth: 0,
        backgroundColor: "#E9E9E9",
        color: CONSTANTS.COLOR_DARK_GREY
    },
    otpContainerStyle: {
        width: '85%',
        height: 100
    }
})