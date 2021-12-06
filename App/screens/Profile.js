import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PageHeading from '../components/PageHeading';
import ReHashButton from '../components/ReHashButton';
import CONSTANTS from '../styles/constants';
import BackgroundView from '../components/BackgroundView';
import EditableInput from '../components/EditableInput';
import { emailvalidation, phonevalidation } from '../utilities/validation'
import { showMessage } from 'react-native-flash-message';
import { profileUpdate } from '../services/TempleApi';
import FullPageLoader from '../components/FullPageLoader';

export default Profile = ({ navigation }) => {
    const [loader, setLoader] = useState(false)
    const [name, setName] = useState(global?.user?.name)
    const [nameError, setNameError] = useState(false)
    const [editName, setEditName] = useState(false)
    const [phone, setPhone] = useState(global?.user?.phone_number)
    const [phoneError, setPhoneError] = useState(false)
    const [editPhone, setEditPhone] = useState(false)
    const [phoneValid, setPhoneValid] = useState(false)
    const [email, setEmail] = useState(global?.user?.email)
    const [emailError, setEmailError] = useState(false)
    const [editEmail, setEditEmail] = useState(false)
    const [emailValid, setEmailValid] = useState(false)

    useEffect(() => {
        let isValid = emailvalidation(email ? email.trim() : "")
        if (isValid !== emailValid) {
            setEmailValid(isValid)
        }
    }, [email])

    useEffect(() => {
        let isValid = phonevalidation(phone ? phone.trim() : "")
        if (isValid !== phoneValid) {
            setPhoneValid(isValid)
        }
    }, [phone])

    const saveDetails = async () => {
        if (emailValid && phoneValid && name && name.length) {
            setLoader(true)
            let data = {
                name,
                email,
                phone_number: phone
            }
            await profileUpdate(data).then(async (res) => {
                if (res.status == 1 || res.status === true) {
                    await AsyncStorage.setItem('user_data', JSON.stringify(res?.userdata))
                    global.user = res?.userdata
                    showMessage({
                        message: "User details Updated",
                        type: "success"
                    })
                    navigation.goBack()
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
        } else {
            showMessage({
                message: "Please fill all the details",
                type: "danger"
            })
        }
    }

    return (
        <SafeAreaView style={styles.screenContainer} >
            <BackgroundView />
            <FullPageLoader show={loader} />
            <PageHeading title={"Profile"} />
            <View style={{
                width: wp("90%"),
                alignSelf: "center",
                backgroundColor: "#FFF",
                borderRadius: hp("1%"),
                paddingHorizontal: wp("3%"),
                paddingVertical: hp("2%"),
                elevation: 3
            }}>
                <View style={styles.inputContainer}>
                    <Icon name="user-circle" color={CONSTANTS.COLOR_GREY} size={wp("10%")} style={{ marginRight: wp("5%") }} />
                    <View style={{ flex: 1 }}>
                        <EditableInput
                            editDetail={editName}
                            showEditIcon={true}
                            inputValue={name}
                            inputPlaceholder={"User name"}
                            onInputChangeText={(val) => setName(val)}
                            onInputSubmitEditing={() => setEditName(false)}
                            inputBlur={() => setEditName(false)}
                            textPlaceholder="User name"
                            onEditIconPress={() => setEditName(true)}
                            inputError={nameError}
                        />
                    </View>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#979797", marginVertical: hp("1.5%") }} />
                <View style={styles.inputContainer}>
                    <Icon name="phone" color={CONSTANTS.COLOR_GREY} size={wp("6%")} style={{ marginRight: wp("5%") }} />
                    <View style={{ flex: 1 }}>
                        <EditableInput
                            editDetail={editPhone}
                            inputKeyboard={"number-pad"}
                            inputPlaceholder={"Phone number"}
                            inputValue={phone}
                            inputValid={phoneValid}
                            onInputChangeText={(val) => setPhone(val)}
                            onInputSubmitEditing={() => setEditPhone(false)}
                            inputBlur={() => setEditPhone(false)}
                            textPlaceholder="Phone number"
                            onEditIconPress={() => setEditPhone(true)}
                            inputError={phoneError}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <MaterialIcon name="email" color={CONSTANTS.COLOR_GREY} size={wp("6%")} style={{ marginRight: wp("5%") }} />
                    <View style={{ flex: 1 }}>
                        <EditableInput
                            editDetail={editEmail}
                            inputKeyboard={"email-address"}
                            inputPlaceholder={"Email address"}
                            inputValue={email}
                            inputValid={emailValid}
                            onInputChangeText={(val) => setEmail(val)}
                            onInputSubmitEditing={() => setEditEmail(false)}
                            inputBlur={() => setEditEmail(false)}
                            textPlaceholder="Email address"
                            onEditIconPress={() => setEditEmail(true)}
                            inputError={emailError}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <ReHashButton
                    selected={true}
                    onPress={() => saveDetails()}
                    title={"SAVE"} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND
    },
    buttonContainer: {
        width: wp("80%"),
        alignSelf: "center",
        marginTop: hp("4%")
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: hp("1%")
    }
})
