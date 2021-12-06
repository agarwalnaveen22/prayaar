import URL_CONSTANT from "./UrlConstant";
import { get, post, put } from "./Api";

export const getPopularTempleList = async (data) => {
    let url = URL_CONSTANT.POPULAR_TEMPLE_LIST;
    let resp = await post(url, data);
    return resp;
}

export const getTempleList = async (data) => {
    let url = URL_CONSTANT.TEMPLE_LIST;
    let resp = await post(url, data);
    return resp;
}

export const getTempleTicketList = async (data) => {
    let url = URL_CONSTANT.TEMPLE_TICKET_LIST;
    let resp = await post(url, data);
    return resp;
}

export const bookTicket = async (data) => {
    let url = URL_CONSTANT.BOOK_TICKET;
    let resp = await post(url, data);
    return resp;
}

export const bookedTicketList = async (data) => {
    let url = URL_CONSTANT.BOOKED_TICKED_LIST;
    let resp = await post(url, data);
    return resp;
}

export const getSettings = async (data) => {
    let url = URL_CONSTANT.USER_SETTINGS;
    let resp = await post(url, data);
    return resp;
}

export const profileUpdate = async (data) => {
    let url = URL_CONSTANT.PROFILE_UPDATE;
    let resp = await post(url, data);
    return resp;
}