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
import Header from '../components/Header';

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
            <Header heading={"Help"} />
            <FullPageLoader show={loader} />
            <View style={{
                marginTop: hp("2%"),
                marginHorizontal: wp("5%")
            }}>
                <Text style={{
                    textAlign: "justify",
                    lineHeight: 22,
                    fontSize: wp("3.5%")
                }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
                <Text style={{
                    fontSize: wp("4%"),
                    fontWeight: "bold",
                    marginTop: hp("2%")
                }}>
                    Customer support :- 1234567890
                </Text>
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
