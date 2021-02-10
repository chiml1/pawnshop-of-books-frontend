import { API_BASE_URL, ACCESS_TOKEN } from '../constants/Stuff';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllBooks() {
    return request({
        url: API_BASE_URL + "/books",
        method: 'GET'
    });
}

export function createBook(pollData) {
    return request({
        url: API_BASE_URL + "/books/new",
        method: 'POST',
        body: JSON.stringify(pollData)
    });
}
export function updateBook(id, bookData) {
    return request({
        url: API_BASE_URL + "/books/"+id,
        method: 'PUT',
        body: JSON.stringify(bookData)
    })
}

export function buyBooks(id, book){
    return request({
        url: API_BASE_URL +"/buy/"+id,
        method: 'POST',
        body: JSON.stringify(book)
    })
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/user/profile/" + username,
        method: 'GET'
    });
}

export function getBoughtBooks(username) {
    return request({
        url: API_BASE_URL + "/user/profile/" + username + "/added",
        method: 'GET'
    });
}

export function getAddedBooks(username) {
    return request({
        url: API_BASE_URL + "/user/profile/" + username + "/bought",
        method: 'GET'
    });
}
