import React from 'react';
import { StyleSheet, SafeAreaView, Image, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { commonStyles } from '../../utilities/styles';
import AuthFooterComponent from '../../components/AuthFooterComponent';

export default SocialLogin = (props) => {
    return (
        <SafeAreaView style={commonStyles.screenBackground}>
            <Image
                source={require('../../assets/image/screen_image_background.png')}
                style={styles.imageBackground}
                resizeMode="contain"
            />
            <View style={styles.screenContainer}>
                <View>
                    <Image style={{ width: wp("40%"), height: hp("10%") }} resizeMode={"contain"} source={require('../../assets/image/logo.png')} />
                    <Text style={commonStyles.largeHeading}>Your temple visit starts here…</Text>
                </View>
                <View>
                    <AuthFooterComponent
                        buttonTitle={"SIGNUP"}
                        onButtonPress={() => props?.navigation.navigate("SignUp", { screenType: "signup" })}
                        alreadyHaveAccount
                        termOfService
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageBackground: {
        position: "absolute",
        width: wp("100%"),
        height: hp("80%"),
    },
    screenContainer: {
        flex: 1,
        marginHorizontal: wp("5%"),
        justifyContent: "space-between"
    }
})