import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import CONSTANTS from '../styles/constants';

export default ReHashTextInput = (props) => {
    return (
        <View style={[style.appInputWrapper, props.inputWrapperStyle]}>
            <TextInput
                {...{
                    key: props.label,
                    mode: props.mode,
                    dense: props.dense,
                    label: props.label,
                    placeholder: props.placeholder,
                    value: props.value,
                    autoCapitalize: props.autoCapitalize,
                    onChangeText: props.onChangeText,
                    keyboardType:
                        props.keyboardType !== 'password' ? props.keyboardType : 'default',
                    returnKeyType: props.returnKeyType || 'done',
                    secureTextEntry: props.secureTextEntry,
                    style: [style.appInput, props.inputStyle],
                    theme: {
                        colors: {
                            placeholder: CONSTANTS.COLOR_GREY,
                            text: CONSTANTS.COLOR_BLACK,
                            primary: "transparent",
                            background: CONSTANTS.COLOR_WHITE,
                        },
                    },
                }}
                left={
                    props.icon ? < TextInput.Icon
                        name={() => props.icon}
                    /> : null
                }
            />
        </View>
    );
}

const style = StyleSheet.create({
    appInputWrapper: {},
    appInput: {
        marginTop: -5,
        width: "100%",
        alignSelf: 'center',
    }
});