import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';

export default BookedCard = (props) => {
    const { item, title, subTitle, image } = props
    const [showDetails, setShowDetials] = useState(false)

    const cardDetail = () => (
        <View style={{
            paddingHorizontal: wp("5%")
        }}>
            <View style={styles.templePeopleContainer}>
                <View style={{
                    flex: 1
                }}>
                    <Text style={{
                        color: CONSTANTS.COLOR_DARK_GREY,
                        fontWeight: "500",
                        fontSize: wp("4%")
                    }}>{item?.no_of_tickets} People</Text>
                </View>
                <View>
                    <Text style={{
                        color: "#9A947E",
                        fontWeight: "400",
                        fontSize: wp("3.2%")
                    }}>
                        {item?.tickets_name?.toUpperCase()}
                    </Text>
                </View>
            </View>
            <View style={styles.templeVistingDetails}>
                <View style={styles.labelTextContainer}>
                    <Text style={styles.label}
                    >Date</Text>
                    <Text style={styles.textStyle}
                    >{item?.date ? item?.date : null}</Text>
                </View>
                <View style={styles.labelTextContainer}>
                    <Text style={styles.label}
                    >Time</Text>
                    <Text style={styles.textStyle}
                    >{item?.time}</Text>
                </View>
                <View style={styles.labelTextContainer}>
                    <Text style={styles.label}
                    >Day</Text>
                    <Text style={styles.textStyle}
                    >{item?.day}</Text>
                </View>
            </View>
            <View style={styles.labelTextContainer}>
                <Text style={styles.label}
                >Ticket Price</Text>
                <Text style={styles.textStyle}
                >Rs.{item?.amount}/Person</Text>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-end"
            }}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setShowDetials(false)}
                    style={{
                        paddingVertical: hp("1%"),
                        paddingLeft: wp("5%"),
                    }}>
                    <Text style={styles.detailText}>Less details</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={[styles.cardContainer, showDetails ? styles.cardContainerMargin : null]}>
                <View>
                    <Image
                        source={{ uri: image }}
                        style={[styles.image, showDetails ? { borderBottomLeftRadius: 0 } : null]} />
                </View>
                <View style={styles.cardHeadingContainer}>
                    <Text style={styles.headingText}>{title}</Text>
                    <Text style={styles.subHeadingText}>{subTitle}</Text>
                </View>
                {!showDetails ? <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setShowDetials(true)}
                    style={styles.cardDetailContainer}>
                    <Text style={styles.detailText}>Details</Text>
                </TouchableOpacity>
                    :
                    <View style={{
                        justifyContent: "center",
                        marginRight: wp("5%")
                    }}>
                        <Text style={styles.label}
                        >Price</Text>
                        <Text style={styles.textStyle}
                        >Rs.{item?.total_amount}</Text>
                    </View>
                }
            </View>
            {showDetails ? cardDetail() : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        borderRadius: hp("1%"),
        marginBottom: hp("3%")
    },
    cardContainer: {
        backgroundColor: "#FFF",
        borderRadius: hp("1%"),
        flexDirection: "row",
    },
    cardContainerMargin: {
        borderBottomWidth: 1,
        borderColor: "#979797",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    image: {
        borderTopLeftRadius: hp("1%"),
        borderBottomLeftRadius: hp("1%"),
        width: wp("15%"),
        height: hp("8%"),
        backgroundColor: "#DCDCDC"
    },
    cardHeadingContainer: {
        flex: 1,
        justifyContent: "center",
        marginStart: wp("3%")
    },
    cardDetailContainer: {
        marginHorizontal: wp("3%"),
        justifyContent: "flex-end",
        paddingBottom: hp("1%"),
    },
    headingText: {
        fontSize: wp("3.8%"),
        fontWeight: "600",
        color: CONSTANTS.COLOR_DARK_GREY
    },
    subHeadingText: {
        marginTop: hp(".5%"),
        fontSize: wp("3.2%"),
        fontWeight: "500",
        color: CONSTANTS.COLOR_LABEL
    },
    detailText: {
        fontSize: wp("3.2%"),
        fontWeight: "500",
        color: CONSTANTS.PRIMARY_COLOR
    },

    templePeopleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp("2%"),
        alignItems: "center"
    },
    templeVistingDetails: {
        // marginTop: hp("2%"),
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
        // width: wp("25%")
    },
})