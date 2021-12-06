export const emailvalidation = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}

export const phonevalidation = (phone) => {
    var phoneno = /^\d{10}$/;
    if (phone.match(phoneno)) {
        return true
    }
    return false
}

export const lengthValidation = (text, length) => {
    if (text.length >= length) {
        return true
    }
    return false
}