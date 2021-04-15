export function removeDoubleSlash(str) {
    return str.replace(/\/\/+/g, "/");
}

export function getKeyByObjectPropertyValue(map, searchValue) {
    for (let key of Object.getOwnPropertyNames(map)) {
        if (map[key] === searchValue)
            return key;
    }
}

export function verifyJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getAPIURL() {
    return localStorage.getItem('apiurl');
}