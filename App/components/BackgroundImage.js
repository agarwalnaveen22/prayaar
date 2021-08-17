import React from 'react';
import { View } from 'react-native';
import CONSTANTS from '../styles/constants';

export default BackgroundImage = () => {
    return (
        <View
            style={{
                position: "absolute",
                width: '100%',
                height: "85%",
                backgroundColor: CONSTANTS.COLOR_YELLOW
            }}
        />
    )
}
