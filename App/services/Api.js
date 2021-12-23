import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { goToScreen } from '../navigations/navigation_action';

let apiCall = axios.create({
    baseURL: 'http://prayaar.tk/api/',
    // timeout: 10000,
});

export const setToken = (token) => {
    apiCall.defaults.headers.common['Authorization'] = token;
}

const setClientToken = async () => {
    try {
        value = await AsyncStorage.getItem('access_token');
    } catch (err) {
        console.log("Access token not found")
    }
    if (value) {
        apiCall.defaults.headers.common['Authorization'] = value;
    }
};

const signOut = async () => {
    await AsyncStorage.removeItem('access_token')
    global.user = null
    global.access_token = null
    goToScreen("authenticationStack", {
        screen: "SignUp",
        params: {
            screenType: "login"
        }
    })
}

export const get = async (url, data = {}) => {
    await setClientToken();
    return await apiCall.get(url, { params: data })
        .then((success) => {
            if (success?.data && success?.data?.error) {
                if (success?.data?.messages === "Token Expired") {
                    signOut()
                }
            }
            console.log("success", success)
            return success?.data
        })
        .catch((error) => {
            console.log("error", error)
            showMessage({
                message: "Something went wrong",
                type: "danger"
            })
            return false
        });
}

export const post = async (url, data = {}) => {
    await setClientToken();
    return await apiCall.post(url, data)
        .then((success) => {
            if (success?.data && success?.data?.error) {
                if (success?.data?.messages === "Token Expired") {
                    signOut()
                }
            }
            console.log("success", success)
            return success?.data
        })
        .catch((error) => {
            console.log("error", error)
            showMessage({
                message: "Something went wrong",
                type: "danger"
            })
            return false
        });
}

export const put = async (url, data = {}) => {
    await setClientToken();
    return await apiCall.put(url, data)
        .then((success) => {
            console.log("success", success)
            return "success"
        })
        .catch((error) => {
            console.log("error", error)
            showMessage({
                message: "Something went wrong",
                type: "danger"
            })
            return false
        });
}

// Set JSON Web Token in Client to be included in all calls
// export const setClientToken = token => {
//     APIKit.interceptors.request.use(function (config) {
//         config.headers.Authorization = `Bearer ${token}`;
//         return config;
//     });
// };

// export default APIKit;