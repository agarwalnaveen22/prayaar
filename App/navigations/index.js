// In App.js in a new project

import * as React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CONSTANTS from '../styles/constants';
import SocialLogin from "../screens/authentication/SocialLogin";
import SignUp from '../screens/authentication/SignUp';
import OtpVerify from '../screens/authentication/OtpVerify';
import AccountVerified from '../screens/authentication/AccountVerified';

import Home from '../screens/Home';
import Details from '../screens/Details';
import BookingDetails from '../screens/BookingDetails';
import PaymentMode from '../screens/PaymentMode';
import PaymentSuccess from '../screens/PaymentSuccess';
import Profile from '../screens/Profile';
import BookedTicket from '../screens/BookedTicket';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default Navigation = ({ loggedIn }) => {

    const authenticationStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="SocialLogin"
            >
                <Stack.Screen name="SocialLogin" component={SocialLogin} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="OtpVerify" component={OtpVerify} />
                <Stack.Screen name="AccountVerified" component={AccountVerified} />
            </Stack.Navigator>
        )
    }

    const drawerNavigation = () => {
        return (
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false
                }}
                swipe
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                initialRouteName="Home">
                <Drawer.Screen name="Home" component={appStack} />
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="BookedTicket" component={BookedTicket} />
            </Drawer.Navigator>
        )
    }

    const signOut = async (props) => {
        await AsyncStorage.removeItem('access_token')
        global.user = null
        global.access_token = null
        props?.navigation.replace("authenticationStack")
    }

    const CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <View style={{ paddingHorizontal: wp("5%") }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: hp("2%")
                    }}>
                        <Icon name="user-circle" color={CONSTANTS.COLOR_GREY} size={wp("10%")} style={{ marginRight: wp("5%") }} />
                        <Text style={styles.drawerLabelStyle}>{global.user?.name ? global.user?.name : "User"}</Text>
                    </View>
                    <DrawerItem
                        style={{ flex: 1 }}
                        label="Home"
                        labelStyle={styles.drawerLabelStyle}
                        onPress={() => {
                            props.navigation.navigate('Home');
                        }}
                    />
                    <DrawerItem
                        style={{ flex: 1 }}
                        label="Booked Ticket"
                        labelStyle={styles.drawerLabelStyle}
                        onPress={() => {
                            props.navigation.navigate('BookedTicket');
                        }}
                    />
                    <DrawerItem
                        style={{ flex: 1 }}
                        label="Profile"
                        labelStyle={styles.drawerLabelStyle}
                        onPress={() => {
                            props.navigation.navigate('Profile');
                        }}
                    />
                    <DrawerItem
                        style={{ flex: 1 }}
                        label="Sign Out"
                        labelStyle={styles.drawerLabelStyle}
                        onPress={() => signOut(props)}
                    />
                </View>
            </DrawerContentScrollView>
        );
    }

    const appStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="Temples"
            >
                <Stack.Screen name="Temples" component={Home} />
                <Stack.Screen name="Details" component={Details} />
                <Stack.Screen name="BookingDetails" component={BookingDetails} />
                <Stack.Screen name="PaymentMode" component={PaymentMode} />
                <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
            </Stack.Navigator>
        )
    }
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={loggedIn ? "appStack" : "authenticationStack"}
            >
                <Stack.Screen name="authenticationStack" component={authenticationStack} />
                <Stack.Screen name="appStack" component={drawerNavigation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    drawerLabelStyle: {
        color: CONSTANTS.COLOR_HEADING,
        fontWeight: "bold",
        lineHeight: 17,
        fontSize: wp("4%")
    }
});