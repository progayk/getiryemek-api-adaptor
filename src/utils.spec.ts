import { createHeaders, requestOptions} from './utils'

test('should create headers with token', () => {
    const token = 'my-token'
    const headers = createHeaders(token)
    expect(headers.Token).toEqual(token)
})

test('should create a empty token if no value passed', () => {
    const token = ''
    const headers = createHeaders(token)
    expect(headers.Token).toEqual(token)
})

test('should create request options with method, body', () => {
    const options = requestOptions('POST', {})
    expect(options.method).toEqual('POST')
    expect(options.body).toEqual('{}')
})
