import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { commonStyles } from '../../utilities/styles';
import AuthHeader from '../../components/AuthHeader';
import ReHashTextInput from '../../components/ReHashTextInput';
import { emailvalidation, lengthValidation, phonevalidation } from '../../utilities/validation';
import AuthFooterComponent from '../../components/AuthFooterComponent';
import { login, signUp } from '../../services/AuthApi';
import FullPageLoader from '../../components/FullPageLoader';
import CONSTANTS from '../../styles/constants';
import { setToken } from '../../services/Api';

export default SignUp = (props) => {

    const { screenType } = props?.route?.params;

    const [loader, setLoader] = useState(false)
    const [email, setEmail] = useState("")
    // const [email, setEmail] = useState("kihoke6992@ineedsa.com")
    const [emailError, setEmailError] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [phone, setPhone] = useState("")
    // const [phone, setPhone] = useState("1111111111")
    const [phoneError, setPhoneError] = useState(false)
    const [phoneValid, setPhoneValid] = useState(false)
    const [password, setPassword] = useState("")
    // const [password, setPassword] = useState("Abcd@1234")
    const [passwordError, setPasswordError] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)

    useEffect(() => {
        setEmail("")
        setPassword("")
        setPhone("")
        setPhoneError(false)
        setEmailError(false)
        setPasswordError(false)
    }, [screenType])

    useEffect(() => {
        let isValid = emailvalidation(email.trim())
        if (isValid !== emailValid) {
            setEmailValid(isValid)
        }
    }, [email])

    useEffect(() => {
        let isValid = phonevalidation(phone.trim())
        if (isValid !== phoneValid) {
            setPhoneValid(isValid)
        }
    }, [phone])

    useEffect(() => {
        let isValid = lengthValidation(password.trim(), 8)
        if (isValid !== passwordValid) {
            setPasswordValid(isValid)
        }
    }, [password])

    const submitSignUpForm = async () => {
        if (emailValid && phoneValid && passwordValid) {
            let data = {
                is_social: 0,
                email: email,
                password: password,
                phone_number: phone,
                role_id: 4
            }
            setLoader(true)
            await signUp(data).then((res) => {
                if (res.status) {
                    showMessage({
                        message: "OTP has sent",
                        type: "success",
                    });
                    props?.navigation?.replace("OtpVerify", { "phone_number": phone, "email": email, "password": password })
                } else {
                    if (res.message) {
                        res.message.hasOwnProperty('email') && setEmailError(true)
                        res.message.hasOwnProperty('password') && setPasswordError(true)
                        res.message.hasOwnProperty('phone_number') && setPhoneError(true)
                        for (const [key, value] of Object.entries(res.message)) {
                            showMessage({
                                message: value,
                                type: "danger",
                            })
                        }
                    }
                }
                setLoader(false)
            }).catch((ee) => {
                setLoader(false)
            })
        } else {
            showMessage({
                message: "Please fill all the details correctly in signup",
                type: "danger",
            });
        }
    }

    const submitLoginForm = async () => {
        if (emailValid && passwordValid) {
            let data = {
                email: email,
                password: password,
            }
            setLoader(true)
            await login(data).then(async (res) => {
                if (res.status) {
                    await setToken(res?.token)
                    await AsyncStorage.setItem('access_token', res?.token)
                    await AsyncStorage.setItem('user_data', JSON.stringify(res?.userdata))
                    global.user = res?.userdata
                    global.access_token = res?.token
                    showMessage({
                        message: "Suucessfully logged in",
                        type: "success",
                    });
                    props?.navigation?.replace("appStack")
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
        } else {
            showMessage({
                message: "Please fill all the details correctly in login",
                type: "danger",
            });
        }
    }

    return (
        <SafeAreaView style={commonStyles.screenBackground}>
            <FullPageLoader show={loader} />
            <View style={styles.screenContainer}>
                <AuthHeader title={"Login options"} showBack auth />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={{
                        height: Platform.OS === "ios" ? hp("65%") : hp("68%"),
                        justifyContent: "space-between"
                    }}>
                        <View>
                            <Text style={styles.createAccountLabel}>{screenType === "signup" ? `Create an account` : `Login to your account`}</Text>
                            <Text style={commonStyles.largeHeading}>{screenType === "signup" ? `Signup now to plan your visit…` : `Login now to plan your visit…`}</Text>
                        </View>
                        <View>
                            <View style={styles.inputContainer}>
                                <ReHashTextInput
                                    label={"Email address"}
                                    placeholder={"Email address"}
                                    value={email}
                                    onChangeText={(val) => { setEmail(val), setEmailError(false) }}
                                    validInput={emailValid}
                                    keyboardType={"email-address"}
                                    error={emailError}
                                />
                            </View>
                            {screenType === "signup" && <View style={styles.inputContainer}>
                                <ReHashTextInput
                                    label={"Phone number"}
                                    placeholder={"Phone number"}
                                    value={phone}
                                    onChangeText={(val) => { setPhone(val), setPhoneError(false) }}
                                    validInput={phoneValid}
                                    keyboardType={"number-pad"}
                                    error={phoneError}
                                />
                            </View>
                            }
                            <View style={styles.inputContainer}>
                                <ReHashTextInput
                                    label={"Password"}
                                    placeholder={"Password"}
                                    value={password}
                                    onChangeText={(val) => { setPassword(val), setPasswordError(false) }}
                                    validInput={passwordValid}
                                    secureTextEntry={true}
                                    error={passwordError}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <AuthFooterComponent
                    buttonTitle={screenType === "signup" ? "SIGNUP" : "LOGIN"}
                    onButtonPress={() => screenType === "signup" ? submitSignUpForm() : submitLoginForm()}
                    alreadyHaveAccount={screenType === "signup" ? true : false}
                    dontHaveAccount={screenType === "signup" ? false : true}
                    termOfService
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
    }
})