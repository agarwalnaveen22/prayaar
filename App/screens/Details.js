import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { showMessage } from "react-native-flash-message";

import Header from '../components/Header.js';
import ReHashButton from '../components/ReHashButton';
import CONSTANTS from '../styles/constants';

const amounts = [
    {
        price: 100,
        text: "Laghu darshan"
    },
    {
        price: 200,
        text: "Madhya darshan"
    },
    {
        price: 300,
        text: "Sarva darshan"
    },
]

export default Details = ({ route, navigation }) => {

    const { temple } = route.params;

    const [amount, setAmount] = useState(300)
    const [ticketType, setTicketType] = useState("Sarva darshan")
    const [people, setPeople] = useState(0)
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [calendarVisible, setCalendarVisible] = useState(false)
    const [timeVisible, setTimeVisible] = useState(false)

    const peopleController = (type) => {
        let no = 0
        if (type === "add") {
            no = people + 1
        } else {
            no = people - 1
            if (no < 0) {
                no = 0
            }
        }
        setPeople(no)
    }

    const onDateChange = (date) => {
        setDate(date)
    }

    const showCalendar = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={calendarVisible}
                onRequestClose={() => {
                    setCalendarVisible(false)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setCalendarVisible(false)}
                    style={styles.modalOutterContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => null}
                        style={styles.modalInnerContainer}>
                        <CalendarPicker
                            onDateChange={onDateChange}
                            minDate={new Date()}
                            selectedDayColor={CONSTANTS.COLOR_YELLOW}
                            width={wp("95%")}
                        />
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "flex-end"
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => { setDate(""), setCalendarVisible(false) }}
                                style={styles.modalButton}
                            >
                                <Text style={{
                                    color: "#BDBDBD",
                                    fontSize: wp("3.6%")
                                }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => setCalendarVisible(false)}
                                style={styles.modalButton}
                            >
                                <Text style={{
                                    color: "#FF8A43",
                                    fontSize: wp("3.6%")
                                }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        )
    }

    const showTime = () => {
        if (timeVisible) {
            if (Platform.OS === "ios") {
                return (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={timeVisible}
                        onRequestClose={() => {
                            setTimeVisible(false)
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => setTimeVisible(false)}
                            style={styles.modalOutterContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => null}
                                style={styles.modalInnerContainer}>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={time || new Date()}
                                    mode={"time"}
                                    display="spinner"
                                    minimumDate={new Date()}
                                    onChange={(event, selectedDate) => setTime(selectedDate)}
                                />
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end"
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => { setTimeVisible(false) }}
                                        style={styles.modalButton}
                                    >
                                        <Text style={{
                                            color: "#BDBDBD",
                                            fontSize: wp("3.6%")
                                        }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => { setTime(time || new Date()), setTimeVisible(false) }}
                                        style={styles.modalButton}
                                    >
                                        <Text style={{
                                            color: "#FF8A43",
                                            fontSize: wp("3.6%")
                                        }}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>
                )
            }
            return <DateTimePicker
                testID="dateTimePicker"
                value={time || new Date()}
                mode={"time"}
                display="spinner"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                    setTimeVisible(false)
                    event.type === "dismissed" ? null : setTime(selectedDate || new Date())
                }}
            />
        }
        return null


    }

    const bookTemple = () => {
        if (people > 0 && amount > 0 && date !== "" && time !== "") {
            navigation.navigate('BookingDetails', { temple: { ...temple, date, time, amount, people, ticketType } })
        }
        else {
            showMessage({
                message: "Please select all the fields.",
                type: "danger",
            });
        }
    }

    return (
        <SafeAreaView style={styles.screenContainer} >
            <Header />
            {showCalendar()}
            {showTime()}
            <ScrollView>
                <View style={styles.detailContainer}>
                    <Image
                        source={temple.image}
                        style={styles.fullImageStyle}
                    />
                    <View style={{
                        paddingTop: hp("2%"),
                        paddingHorizontal: wp("3%")
                    }}>
                        <Text style={{
                            fontFamily: "GothamMedium",
                            color: CONSTANTS.COLOR_DARK_GREY,
                            fontWeight: "500",
                            fontSize: wp("3.6%"),
                        }}>{temple.name}</Text>
                        <Text style={[styles.labelStyle, { marginTop: hp("0.5%") }]}>{temple.location}, 10am - 5pm</Text>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: hp("2%")
                        }}>
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => setCalendarVisible(true)}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="calendar" color={"#B7B7B7"} size={wp("4%")} />
                                        <Text style={[styles.labelStyle, { marginHorizontal: wp("2%") }]}>Select Date</Text>
                                        <Icon name="caret-down" color={"#B7B7B7"} size={wp("5%")} />
                                    </View>
                                    <Text style={styles.selectedTextStyle}>{date ? moment(date).format("DD MMM") : ""}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => setTimeVisible(true)}
                                    style={{ marginTop: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="clock-o" color={"#B7B7B7"} size={wp("4%")} />
                                        <Text style={[styles.labelStyle, { marginHorizontal: wp("2%") }]}>Select Time</Text>
                                        <Icon name="caret-down" color={"#B7B7B7"} size={wp("5%")} />
                                    </View>
                                    <Text style={styles.selectedTextStyle}>{time ? moment(time).format("hh:mm a") : ""}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.labelStyle}>Number of people</Text>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: hp("1%"),
                                    alignSelf: "flex-end"
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={people === 0 ? 1 : 0.5}
                                        onPress={() => people === 0 ? null : peopleController("minus")}
                                        style={[styles.peopleController, { backgroundColor: "#D8D8D8" }]}>
                                        <Icon name="minus" color={"#808080"} size={wp("4%")} />
                                    </TouchableOpacity>
                                    <Text style={{
                                        paddingHorizontal: wp("3%"),
                                        fontSize: wp("3.6"),
                                        color: CONSTANTS.COLOR_DARK_GREY
                                    }}>{people}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => peopleController("add")}
                                        style={[styles.peopleController, { backgroundColor: "#FF8A43" }]}>
                                        <Icon name="plus" color={CONSTANTS.COLOR_WHITE} size={wp("4%")} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.labelStyle, { marginTop: hp("2%") }]}>{temple.location}</Text>
                        <View style={styles.amountsContainer}>
                            {
                                amounts.map((item) => (
                                    <View style={{
                                        marginRight: wp("2%")
                                    }}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => { setAmount(item.price), setTicketType(item.text) }}
                                            style={[styles.amountContainer, item.price === amount ? { backgroundColor: "#FF8A43" } : null]}>
                                            <Text style={[styles.amountText, item.price === amount ? { color: CONSTANTS.COLOR_WHITE } : null]}>{`Rs. ${item.price}`}</Text>
                                        </TouchableOpacity>
                                        <Text style={{
                                            marginTop: hp(".5%"),
                                            color: "#9C9C9C",
                                            fontWeight: "500",
                                            fontSize: wp("3%")
                                        }}>{item.text}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        <Text style={[styles.labelStyle, { marginTop: hp("3%") }]}>Total</Text>
                        <Text style={{
                            marginTop: hp(".5%"),
                            color: CONSTANTS.COLOR_DARK_GREY,
                            fontWeight: "bold",
                            fontSize: wp("4%"),
                        }}>{`Rs ${people ? people * amount : 0}`}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ flex: 0.35 }}>
                        <ReHashButton
                            onPress={() => navigation.goBack()}
                            title={"Cancel"} />
                    </View>
                    <View style={{ flex: 0.55 }}>
                        <ReHashButton
                            selected={true}
                            onPress={() => bookTemple()}
                            title={"Book"} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND
    },
    detailContainer: {
        backgroundColor: CONSTANTS.COLOR_WHITE,
        borderRadius: hp("1%"),
        marginTop: hp("3%"),
        width: wp("90%"),
        alignSelf: "center",
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
        height: hp("25%"),
        width: "100%"
    },
    peopleController: {
        borderRadius: wp("3%"),
        justifyContent: "center",
        alignItems: 'center',
        width: wp("6%"),
        height: wp("6%"),
    },
    selectedTextStyle: {
        marginTop: hp(".5%"),
        marginLeft: wp("6%"),
        fontSize: wp("3.2%"),
        color: "#FF8A43"
    },
    labelStyle: {
        color: "#9C9C9C",
        fontSize: wp("3%"),
    },
    amountsContainer: {
        marginTop: hp("1%"),
        flexDirection: "row",
        flexWrap: "wrap"
    },
    amountContainer: {
        borderWidth: 1,
        borderColor: "#FF8A43",
        justifyContent: "center",
        alignItems: "center",
        marginRight: wp("5%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp(".5%"),
        borderRadius: hp("2%")
    },
    amountText: {
        fontSize: wp("3.2%"),
        color: "#67696C"
    },
    buttonContainer: {
        width: wp("90%"),
        alignSelf: "center",
        marginVertical: hp("4%"),
        flexDirection: "row",
        justifyContent: "space-between"
    },
    modalOutterContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalInnerContainer: {
        width: wp("95%"),
        backgroundColor: CONSTANTS.COLOR_WHITE,
        borderRadius: hp("1%"),
        paddingVertical: hp("1%")
    },
    modalButton: {
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("4%"),
        marginLeft: wp("3%")
    }
})
