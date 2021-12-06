import React from "react";
import { ActivityIndicator, View } from "react-native";
import CONSTANTS from '../styles/constants';

export default FullPageLoader = ({ show }) => {
    if (show) {
        return <View style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 10
        }}>
            <ActivityIndicator size="large" color={CONSTANTS.PRIMARY_COLOR} />
        </View>
    }
    return null
}