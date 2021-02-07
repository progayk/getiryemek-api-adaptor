require('dotenv').config();
import fetch from 'node-fetch';
import { handleError, requestOptions, toJson } from "./utils";

if (!process.env.APP_SECRET_KEY) {
    console.error('could not find APP_SECRET_KEY in .env file. You have to provide appSecretKey that you obtain from getiryemek.')
}

export type AuthCredential = {
    username: string,
    password: string,
    token: string,
    restaurantSecretKey: string,
    restaurantId: string,
}

class Getiryemek {
    private appSecretKey: string = process.env.APP_SECRET_KEY!
    readonly targetUrl: string = 'https://food-external-api-gateway.development.getirapi.com'
    constructor(
        public proxyUrl: string = '',
        public credential: AuthCredential
    ) { }


    finalUrl(url: string) {
        return this.proxyUrl + this.targetUrl + url
    }
    getAppSecretKey() {
        return this.appSecretKey
    }
    loginRestaurant() {
        return fetch(this.finalUrl('/auth/login'), requestOptions(
            'POST', {
            appSecretKey: this.appSecretKey,
            restaurantSecretKey: this.credential.restaurantSecretKey
        }))
            .then(toJson)
            .then(json => {
                this.credential.token = json.token;
                this.credential.restaurantId = json.restaurantId;
            })
            .catch(console.error)
    }
    hasToken() {
        return this.credential.token.length
    }
    async getUnseenOrders() {
        if (!this.hasToken()) {
            await this.loginRestaurant()
        }
        return fetch(this.finalUrl('/food-orders/periodic/unapproved'),
            requestOptions('POST', {}, this.credential.token))
            .then(toJson)
            .catch(handleError)
    }
}

export default Getiryemek