import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, Touchable, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';

import PageHeading from '../components/PageHeading';
import ReHashButton from '../components/ReHashButton';
import CONSTANTS from '../styles/constants';
import BackgroundImage from '../components/BackgroundImage';
import { bookTicket } from '../services/TempleApi';
import FullPageLoader from '../components/FullPageLoader';

export default BookingDetails = ({ route, navigation }) => {
    const { temple, url, taxVariables } = route.params;

    const [loader, setLoader] = useState(false)

    const makePayment = async () => {
        setLoader(true)
        let data = {
            temple_id: temple?.id,
            ticket_id: temple?.selectedTicketId,
            date: moment(temple.date).format("YYYY-MM-DD"),
            amount: temple?.amount,
            no_of_tickets: temple?.people,
            time: moment(temple.time).format("HH:mm:ss"),
            total_amount: temple?.totaAmount,
            tax_amount: temple?.tax
        }
        await bookTicket(data).then((res) => {
            if (res.status == 1 || res.status === true) {
                navigation.navigate('PaymentSuccess')
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
    }

    return (
        <SafeAreaView style={styles.screenContainer} >
            <FullPageLoader show={loader} />
            <View>
                <BackgroundImage />
                <PageHeading title={"Booking Details"} />
                <View style={styles.cardContainer}>
                    <Image
                        source={temple?.filename?.length ? { uri: url + temple?.filename[0].uri } : ""}
                        style={styles.fullImageStyle}
                    />
                    <View style={styles.cardTextContainer}>
                        <View style={styles.templeNameContainer}>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{
                                    color: CONSTANTS.COLOR_DARK_GREY,
                                    fontWeight: "500",
                                    fontSize: wp("5%")
                                }}>{temple?.name}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={{
                                    color: CONSTANTS.COLOR_ORANGE,
                                    fontWeight: "400",
                                    fontSize: wp("3.2%")
                                }}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.templePeopleContainer}>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{
                                    color: CONSTANTS.COLOR_DARK_GREY,
                                    fontWeight: "500",
                                    fontSize: wp("4%")
                                }}>{temple.people} People</Text>
                            </View>
                            <View>
                                <Text style={{
                                    color: "#9A947E",
                                    fontWeight: "400",
                                    fontSize: wp("3.2%")
                                }}>{temple.ticketType.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.templeVistingDetails}>
                            <View style={styles.labelTextContainer}>
                                <Text style={styles.label}
                                >Date</Text>
                                <Text style={styles.textStyle}
                                >{moment(temple.date).format("DD-MM-YYYY")}</Text>
                            </View>
                            <View style={styles.labelTextContainer}>
                                <Text style={styles.label}
                                >Time</Text>
                                <Text style={styles.textStyle}
                                >{moment(temple.time).format("hh:mm a")}</Text>
                            </View>
                            <View style={styles.labelTextContainer}>
                                <Text style={styles.label}
                                >Day</Text>
                                <Text style={styles.textStyle}
                                >{moment(temple.date).format("dddd")}</Text>
                            </View>
                            <View style={styles.labelTextContainer}>
                                <Text style={styles.label}
                                >Ticket Price</Text>
                                <Text style={styles.textStyle}
                                >Rs.{temple.amount}/Person</Text>
                            </View>

                            <View style={[styles.absoluteCurve, { left: wp("-11%") }]} />
                            <View style={[styles.absoluteCurve, { right: wp("-11%") }]} />

                        </View>
                        <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: "#979797", marginVertical: hp("3%") }} />
                        <View style={{ alignSelf: "center" }}>
                            <Text style={styles.totalAmountLabel}>TOTAL PRICE</Text>
                            <Text style={{
                                color: CONSTANTS.COLOR_DARK_GREY,
                                fontSize: wp("6%"),
                                fontWeight: "bold",
                                textAlign: "center",
                                marginVertical: hp("1%")
                            }}>Rs. {temple.totaAmount}</Text>
                            <Text style={{
                                fontSize: wp("3.2"),
                                color: "#A2A4A6",
                                textAlign: "center"
                            }}>{`CGST (${taxVariables?.CGST}%) + CGST (${taxVariables?.SGST}%) = Rs.${temple?.tax}`} </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <ReHashButton
                    selected={true}
                    onPress={() => makePayment()}
                    title={"Make Payment"} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND
    },
    cardContainer: {
        width: wp("90%"),
        alignSelf: "center",
        backgroundColor: CONSTANTS.COLOR_WHITE,
        borderRadius: hp("1%"),
        paddingBottom: hp("3%"),
        shadowColor: "#979797",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.21,
        shadowRadius: 6,

        elevation: 5,
    },
    fullImageStyle: {
        borderTopLeftRadius: hp("1%"),
        borderTopRightRadius: hp("1%"),
        height: hp("20%"),
        width: "100%"
    },
    cardTextContainer: {
        width: wp("80%"),
        alignSelf: "center"
    },
    templeNameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp("3%"),
        alignItems: "center"
    },
    templePeopleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp("2%"),
        alignItems: "center"
    },
    templeVistingDetails: {
        marginTop: hp("2%"),
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    label: {
        color: CONSTANTS.COLOR_LABEL,
        fontWeight: "bold",
        fontSize: wp("3.2%")
    },
    textStyle: {
        marginTop: hp(".5%"),
        color: "#42436A",
        fontWeight: "bold",
        fontSize: wp("3.6%")
    },
    labelTextContainer: {
        marginTop: hp("2%"),
        width: wp("35%")
    },
    totalAmountLabel: {
        fontWeight: "bold",
        fontSize: wp("3.2"),
        color: "#BDBDC0",
        textAlign: "center"
    },
    buttonContainer: {
        width: wp("80%"),
        alignSelf: "center",
        marginTop: hp("4%")
    },
    absoluteCurve: {
        position: "absolute",
        backgroundColor: CONSTANTS.COLOR_YELLOW,
        width: wp("9%"),
        height: wp("9%"),
        borderRadius: wp("5%"),
        bottom: -hp("2%")
    }
})

