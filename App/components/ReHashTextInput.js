import React from 'react';
import { TextInput } from 'react-native-paper';
import CONSTANTS from '../styles/constants';
import Icon from 'react-native-vector-icons/FontAwesome';

export default ReHashTextInput = (props) => {
    return (
        <TextInput
            style={{
                backgroundColor: "#FFF"
            }}
            secureTextEntry={props?.secureTextEntry ? props?.secureTextEntry : false}
            mode={"outlined"}
            outlineColor={"#D4D4D4"}
            multiline={props?.multiline ? props?.multiline : false}
            label={props?.label ? props?.label : ""}
            placeholder={props?.placeholder ? props?.placeholder : ""}
            right={props.validInput && <TextInput.Icon name="check-circle" color={CONSTANTS.PRIMARY_COLOR} />}
            left={props?.left && <TextInput.Icon name={() => <Icon name={'search'} size={20}  color={"#BFBFBF"} />} />}
            value={props?.value}
            onBlur={() => props?.onBlur ? props?.onBlur() : null}
            onChangeText={props?.onChangeText}
            keyboardType={props?.keyboardType ? props?.keyboardType : "default"}
            onSubmitEditing={() => props?.onSubmitEditing ? props?.onSubmitEditing() : null}
            error={props?.error}
            returnKeyType={props?.returnKeyType ? props?.returnKeyType : 'done'}
        />
    )
}