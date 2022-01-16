import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Image, Text, View, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { Settings, LoginManager, Profile } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { commonStyles } from '../../utilities/styles';
import AuthFooterComponent from '../../components/AuthFooterComponent';
import { showMessage } from 'react-native-flash-message';
import FullPageLoader from '../../components/FullPageLoader';
import { socialLogin } from '../../services/AuthApi';

export default SocialLogin = (props) => {

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        Settings.initializeSDK();
        LoginManager.setLoginBehavior('WEB_ONLY')
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
            webClientId: '860617456887-jg3nue2unnhaem0pvmdlutd3bjcggfda.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        });
    }, [])

    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("userinfo", userInfo)
            if (userInfo) {
                let data = {
                    email: userInfo?.user?.email,
                    social_number: userInfo?.idToken,
                    name: userInfo?.user?.name,
                    phone: userInfo?.user?.phone,
                    app_type: "user",
                    is_social: 1,
                    role_id: 4,
                    social_platform: "google"
                }
                console.log("social goole data", data)
                setLoader(true)
                await socialLogin(data).then(async (res) => {
                    if (res.status) {
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
                        try {
                            await GoogleSignin.signOut();
                        } catch (error) {
                            console.error(error);
                        }
                        if (res.message) {
                            if (typeof res.message === 'object') {
                                for (const [key, value] of Object.entries(res.message)) {
                                    showMessage({
                                        message: value,
                                        type: "danger",
                                    })
                                }
                            }
                            else {
                                showMessage({
                                    message: res?.message,
                                    type: "danger",
                                })
                            }
                        }
                    }
                    setLoader(false)
                }).catch((ee) => {
                    setLoader(false)
                })
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
                showMessage({
                    message: "Please try again later",
                    type: "danger",
                })
            }

        }
    };

    const facebookSignIn = async () => {
        LoginManager.logInWithPermissions(["public_profile"]).then(
            async function (result) {
                console.log("result", result)
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    setLoader(true)
                    getFacebookProfile()
                    console.log(
                        "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );
    }

    const getFacebookProfile = async () => {
        console.log("in getFacebookProfile")
        try {
            await Profile.getCurrentProfile().then(
                async function (currentProfile) {
                    if (currentProfile) {
                        console.log("currentProfile", currentProfile)
                        console.log("The current logged user is: " +
                            currentProfile.name
                            + ". His profile id is: " +
                            currentProfile.userID
                        );
                        let data = {
                            email: currentProfile?.email ? currentProfile?.email : "dummy@dummy1.com",
                            social_number: currentProfile?.userID,
                            name: currentProfile?.name,
                            phone: currentProfile?.phone,
                            app_type: "user",
                            is_social: 1,
                            role_id: 4,
                            social_platform: "facebook"
                        }
                        setLoader(true)
                        console.log("social facebook data", data)
                        await socialLogin(data).then(async (res) => {
                            if (res.status) {
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
                                try {
                                    await LoginManager.logOut()
                                } catch (error) {
                                    console.error(error);
                                }
                                if (res.message) {
                                    if (typeof res.message === 'object') {
                                        for (const [key, value] of Object.entries(res.message)) {
                                            showMessage({
                                                message: value,
                                                type: "danger",
                                            })
                                        }
                                    }
                                    else {
                                        showMessage({
                                            message: res?.message,
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
                        getFacebookProfile()
                    }
                }
            );
        }
        catch {
            setLoader(false)
        }
    }
    return (
        <SafeAreaView style={commonStyles.screenBackground}>
            <FullPageLoader show={loader} />
            <Image
                source={require('../../assets/image/screen_image_background.png')}
                style={styles.imageBackground}
                resizeMode="contain"
            />
            <View style={styles.screenContainer}>
                <View>
                    <Image style={{ width: wp("40%"), height: hp("10%") }} resizeMode={"contain"} source={require('../../assets/image/logo.png')} />
                    <Text style={commonStyles.largeHeading}>Your temple mangement starts here…</Text>
                </View>

                <View>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => facebookSignIn()}
                        style={[styles.socialButtonContainer, { backgroundColor: "#D5E5FF", }]}>
                        <View style={styles.socialImageContainer}>
                            <Image
                                source={require('../../assets/image/facebook.png')}
                                resizeMode='contain'
                                style={styles.socialImage}
                            />
                        </View>
                        <Text style={styles.socialText}>Continue with Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => googleSignIn()}
                        style={[styles.socialButtonContainer, { backgroundColor: "#FFE9E9", }]}>
                        <View style={styles.socialImageContainer}>
                            <Image
                                source={require('../../assets/image/google.png')}
                                resizeMode='contain'
                                style={styles.socialImage}
                            />
                        </View>
                        <Text style={styles.socialText}>Continue with Google</Text>
                    </TouchableOpacity>
                    <AuthFooterComponent
                        buttonTitle={"SIGNUP"}
                        onButtonPress={() => props?.navigation.navigate("SignUp", { screenType: "signup" })}
                        alreadyHaveAccount
                        termOfService
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageBackground: {
        position: "absolute",
        width: wp("100%"),
        height: hp("80%"),
    },
    screenContainer: {
        flex: 1,
        marginHorizontal: wp("5%"),
        justifyContent: "space-between"
    },
    socialButtonContainer: {
        width: wp("60%"),
        alignSelf: "center",
        borderRadius: hp("5%"),
        flexDirection: "row",
        alignItems: "center",
        height: hp("6%"),
        // justifyContent: "center",
        marginBottom: hp("3%")
    },
    socialImageContainer: {
        width: "25%",
        alignItems: "center",
    },
    socialImage: {
        width: wp("5%"),
        height: wp("5%")
    },
    socialText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#3B3B3B",
    }
})