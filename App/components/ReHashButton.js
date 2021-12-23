import React, { useEffect, useState } from 'react';
import { StyleSheet, Keyboard, View } from 'react-native';
import { Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';

export default ReHashButton = (props) => {
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setShowButton(false);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setShowButton(true);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    if (showButton) {
        return (
            <View style={[props?.mode === "outline" ? null : styles.shadow, { zIndex: 0 }]}>
                <Button
                    mode={props?.mode ? props?.mode : "contained"}
                    onPress={() => props?.onPress ? props?.onPress() : console.log('Pressed')}
                    contentStyle={[styles.contentStyle, props?.contentStyle]}
                    labelStyle={[styles.labelStyle, props?.labelStyle]}
                >
                    {`${props?.title}`}
                </Button>
            </View>
        )
    }
    return null
}

const styles = StyleSheet.create({
    shadow: {
        borderRadius: hp("1%"),
        shadowColor: CONSTANTS.PRIMARY_COLOR,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
    contentStyle: {
        height: hp("6.5%"),
        alignItems: "center",
        justifyContent: "center",
        // borderWidth: 1,
        // borderColor: "#C3C3C2"
    },
    labelStyle: {
        fontWeight: "bold",
        fontSize: wp("4.5%"),
        color: "#FFF"
    }
})