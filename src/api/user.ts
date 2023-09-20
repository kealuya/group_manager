import request from './request'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function userList() {
    return request({
        url: '/user/list',
        method: 'post',
    })
}
