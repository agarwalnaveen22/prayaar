import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

import PageHeading from '../components/PageHeading';
import ReHashButton from '../components/ReHashButton';
import CONSTANTS from '../styles/constants';
import BackgroundImage from '../components/BackgroundImage';


const paymentModes = [
    { name: "Wallets", id: 1 },
    { name: "Credit/Debit Cards", id: 2 },
    { name: "Net Banking", id: 3 },
    { name: "BHIM UPI", id: 4 },
    { name: "Debit Card with Pin", id: 5 },
]

const paymentTypes = [
    { image: require("../assets/image/paytm.png"), name: "Paytm", id: 1 },
    { image: require("../assets/image/amazon_pay.png"), name: "Amzon pay", id: 2, offer: "Up to 20% cashback" },
    { image: require("../assets/image/phonepe.png"), name: "PhonePe", id: 3 },
    { image: require("../assets/image/lazypay.png"), name: "Lazypay", id: 4 },
    { image: require("../assets/image/simpl.png"), name: "Simpl", id: 5 },
    { image: require("../assets/image/mobikwik.png"), name: "Mobikwik", id: 6 },

]

export default PaymentMode = ({ navigation }) => {

    const [paymentMode, setPaymentMode] = useState(1)
    const [paymentType, setPaymentType] = useState(1)

    const renderPaymentModes = () => (
        paymentModes.map((item, index) => (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPaymentMode(item.id)}
                style={[styles.paymentModeContainer, index === (paymentModes.length - 1) ? { borderBottomWidth: 0 } : null]}>
                <View style={[styles.paymentModeTextContainer, paymentMode === item.id ? { backgroundColor: "rgba(255, 138, 67, 0.5)" } : null]}>
                    <Text style={styles.paymentModeText}>{item.name}</Text>
                </View>
                {
                    paymentMode === item.id && <View style={styles.arrowAbsoluteStyle}>
                        <Image
                            source={require('../assets/image/Triangle.png')}
                            style={styles.imageSelectTriangle}
                        />
                    </View>
                }

            </TouchableOpacity>
        ))
    )

    const renderPaymentTypes = () => (
        paymentTypes.map((item) => (
            <View style={styles.paymentTypeContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setPaymentType(item.id)}
                    style={{
                        borderWidth: 1,
                        borderColor: CONSTANTS.COLOR_GREY,
                        backgroundColor: CONSTANTS.COLOR_WHITE,
                        borderRadius: wp("6%"),
                    }}>
                    <Image
                        source={item.image}
                        style={styles.paymentTypeImage}
                    />
                    {paymentType === item.id && <View style={styles.absoluteCheckContainer}>
                        <Icon name="check" color={"#FF8B43"} size={wp("6%")} />
                    </View>
                    }
                </TouchableOpacity>
                <Text style={styles.paymentTypeNameText}>{item.name}</Text>
                {item?.offer && <Text style={styles.paymentTypeOfferText}>{item.offer}</Text>
                }
            </View>
        ))
    )

    return (
        <SafeAreaView style={styles.screenContainer} >
            <View>
                <BackgroundImage />
                <PageHeading title={"Select a payment mode"} />
                <View style={styles.paymentModeTypeContainer}>
                    <View style={{
                        flex: 0.35,
                        zIndex: 1
                    }}>
                        {renderPaymentModes()}
                    </View>
                    <View style={{
                        flex: 0.65,
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }} >
                        {renderPaymentTypes()}
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <ReHashButton
                    selected={true}
                    onPress={() => navigation.navigate('PaymentSuccess')}
                    title={"Confirm Payment"} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND
    },
    paymentModeTypeContainer: {
        width: wp("90%"),
        alignSelf: "center",
        flexDirection: "row",
        borderRadius: hp("1%"),
        backgroundColor: "#FDFDFD",

        shadowColor: "#979797",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.21,
        shadowRadius: 6,

        elevation: 5,
    },
    paymentModeContainer: {
        height: hp("10%"),
        backgroundColor: "#E6E6E6",
        borderBottomWidth: 2,
        borderBottomColor: CONSTANTS.COLOR_WHITE,
        flexDirection: "row",
    },
    paymentModeTextContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6E6E6",
        paddingHorizontal: wp("2%")
    },
    paymentModeText: {
        textAlign: "center",
        color: CONSTANTS.COLOR_DARK_GREY,
        fontWeight: "500",
        fontSize: wp("3.5%")
    },
    imageSelectTriangle: {
        tintColor: "rgba(255, 138, 67, 0.5)",
        position: "absolute",
        width: wp("3%"),
        right: wp("-2.9%")
    },
    arrowAbsoluteStyle: {
        justifyContent: "center",
        backgroundColor: CONSTANTS.COLOR_WHITE,
        right: 0,
        height: "100%"
    },
    paymentTypeContainer: {
        width: "50%",
        alignItems: "center",
        marginTop: hp("3%"),
        paddingHorizontal: wp("2%")
    },
    paymentTypeImage: {
        borderRadius: wp("6%"),
        width: wp("12%"),
        height: wp("12%")
    },
    paymentTypeNameText: {
        marginTop: hp("1%"),
        color: "#42436A",
        fontWeight: "bold",
        fontSize: wp("3.2%")
    },
    paymentTypeOfferText: {
        marginTop: hp(".5%"),
        color: "#FF8B41",
        fontSize: wp("2.8%")
    },
    absoluteCheckContainer: {
        position: "absolute",
        borderRadius: wp("6%"),
        backgroundColor: "rgba(68, 65, 63, 0.6)",
        height: wp("12%"),
        width: wp("12%"),
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        width: wp("80%"),
        alignSelf: "center",
        marginTop: hp("4%")
    },
})
