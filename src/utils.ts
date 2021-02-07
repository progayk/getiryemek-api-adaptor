import {  RequestInit, Response } from "node-fetch";

export const handleError = (e: Error) => {
    console.error(e);
    return e
}

export const createHeaders = (token: string = '') => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Token": token
    }
    return headers
}

export const requestOptions = (method: string, body: object, token?: string) => {
    let options: RequestInit = {
        method: method,
        headers: createHeaders(token),
        redirect: "follow",
        body: '',
    }
    if (body) {
        options.body = JSON.stringify(body)
    }
    return options
}

// TODO what's the type of v?
export const toJson = (v:Response) => v.json()

