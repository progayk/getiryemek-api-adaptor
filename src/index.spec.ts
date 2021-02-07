import Getiryemek from './index'
import { AuthCredential } from './index'
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

jest.mock('node-fetch', () => jest.fn());

beforeEach(() => { mocked(fetch).mockClear() });

const credential: AuthCredential = {
    username: 'pionpos',
    password: 'no-password',
    token: '',
    restaurantSecretKey: '',
    restaurantId: '',
}
test('should create a getiryemek object ', () => {
    const getir = new Getiryemek('', credential)
    expect(typeof getir).toBe('object')
})

test('getiryemek object should have app secret key', () => {
    const getir = new Getiryemek('', credential)
    expect(getir.getAppSecretKey()).toBeTruthy()
})

test('should add proxy url to target url when call final url', () => {
    const getir = new Getiryemek('ahmet/', credential)
    const expected = 'ahmet/' + getir.targetUrl + '/url'
    expect(getir.finalUrl('/url')).toEqual(expected)
})

describe('test api', () => {
    test('hasToken should return false if there s not a token', () => {
        const getir = new Getiryemek('', credential)
        expect(getir.hasToken()).toBeFalsy()
    })
    test('should logn the restuarant and return restaurant id and token', async () => {
        // provide a mock implementation for the mocked fetch:
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.resolve({
                json() {
                    return Promise.resolve({
                        "restaurantId": "restaurantId",
                        "token": "token"
                    });
                }
            });
        });

        const getir = new Getiryemek('', credential)
        await getir.loginRestaurant();
        expect(mocked(fetch).mock.calls.length).toBe(1);
        expect(getir.credential.token).toBe('token');
        expect(getir.credential.restaurantId).toBe('restaurantId');
    })

    test('should fetch unapproved orders from api', async () => {
        // provide a mock implementation for the mocked fetch:
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.resolve({
                json() {
                    return Promise.resolve([]);
                }
            });
        });

        const getir = new Getiryemek('', credential)
        const result = await getir.getUnseenOrders();
        expect(mocked(fetch).mock.calls.length).toBe(1);
        expect(result).toBeDefined();
        expect(result.length).toBe(0);
    })
})
