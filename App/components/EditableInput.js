import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ReHashTextInput from './ReHashTextInput';
import CONSTANTS from '../styles/constants';

export default EditableInput = ({ editDetail, showEditIcon, inputPlaceholder, inputMultiline, inputValue, inputValid, inputKeyboard, onInputChangeText, onInputSubmitEditing, textPlaceholder, onEditIconPress, inputError, inputBlur }) => {
    return (
        <View style={styles.container}>
            {
                editDetail ? <ReHashTextInput
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    multiline={inputMultiline ? inputMultiline : false}
                    onChangeText={onInputChangeText}
                    onSubmitEditing={onInputSubmitEditing}
                    keyboardType={inputKeyboard}
                    validInput={inputValid}
                    error={inputError}
                    onBlur={inputBlur}
                />
                    :
                    <View style={styles.inputContainer}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.textStyle}>{inputValue ? inputValue : textPlaceholder}</Text>
                        </View>
                        {showEditIcon ? <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => onEditIconPress ? onEditIconPress() : null}
                            style={styles.editIconContainer}>
                            <Icon name="edit" size={wp("6%")} color={CONSTANTS.PRIMARY_COLOR} />
                        </TouchableOpacity> :
                            null
                        }
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // marginTop: hp("1%")
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textStyle: {
        fontWeight: "600",
        color: CONSTANTS.COLOR_DARK_GREY,
        fontSize: wp("4%")
    },
    editIconContainer: {
        paddingHorizontal: wp("1%"),
        paddingVertical: hp(".5%")
    }
})