import URL_CONSTANT from "./UrlConstant";
import { get, post, put } from "./Api";

export const signUp = async (data) => {
    let url = URL_CONSTANT.SIGNUP_URL;
    let resp = await post(url, data);
    return resp;
}

export const otpVerify = async (data) => {
    let url = URL_CONSTANT.OTP_VERIFY;
    let resp = await post(url, data);
    return resp;
}

export const login = async (data) => {
    let url = URL_CONSTANT.LOGIN;
    let resp = await post(url, data);
    return resp;
}