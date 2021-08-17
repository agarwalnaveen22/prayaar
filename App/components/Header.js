import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';

import CONSTANTS from '../styles/constants';
import ReHashTextInput from './ReHashTextInput';

export default Header = ({ searchValue, onSearch }) => {

    const [search, setSearch] = useState("")

    useEffect(() => {
        setSearch(searchValue)
    }, [searchValue])

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.headerMenuContainer}
                activeOpacity={0.5}
                onPress={() => null}
            >
                <Icon name="menu" color={CONSTANTS.COLOR_DARK_GREY} size={wp("8%")} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <ReHashTextInput
                    {
                    ...{
                        mode: "outlined",
                        placeholder: "Search temples to book…",
                        onChangeText: (val) => { setSearch(val), onSearch && onSearch(val) },
                        value: search,
                        icon: <Icon name="search" color={CONSTANTS.COLOR_GREY} size={wp("6%")} />,
                        dense: false,
                    }
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: hp("2%"),
        paddingHorizontal: wp("3%"),
        backgroundColor: CONSTANTS.COLOR_YELLOW,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    headerMenuContainer: {
        backgroundColor: "#DAB528",
        justifyContent: "center",
        alignItems: "center",
        height: wp("11%"),
        width: wp("11%"),
        borderRadius: wp("6%"),
        marginRight: wp("3%")
    }
})