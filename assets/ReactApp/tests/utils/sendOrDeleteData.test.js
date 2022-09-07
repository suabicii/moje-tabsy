/**
 * @jest-environment jsdom
 * */
import {sendOrDeleteData} from "../../utils/sendOrDeleteData";

const response = {status: 'It works!'};
let fetchedData;
const setData = data => {
    fetchedData = data;
};
const submittedMockData = {
    thisIs: 'some', dummy: 'data'
};

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(response)
    }));
});

afterEach(() => {
    fetchedData = undefined;
});

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it.each`
    identifier | data | requestMethod | route
    ${null} | ${submittedMockData} | ${'POST'} | ${'fake-route'},
    ${'my-email@domain.com'} | ${submittedMockData} | ${'PUT'} | ${'fake-route'},
    ${'someId'} | ${null} | ${'DELETE'} | ${'fake-route'}
`("should send $requestMethod request and retrieve positive information",
    async ({
               identifier,
               data,
               requestMethod,
               route
           }) => {
        await sendOrDeleteData(identifier, data, requestMethod, route).then(data => {
            setData(data);
        });

        expect(fetchedData).toEqual(response);
    }
)

it.each`
    identifier | data | requestMethod | route
    ${null} | ${submittedMockData} | ${'POST'} | ${'fake-route'},
    ${'my-email@domain.com'} | ${submittedMockData} | ${'PUT'} | ${'fake-route'},
    ${'someId'} | ${null} | ${'DELETE'} | ${'fake-route'}
`('should throw error when $requestMethod request failed',
    async ({
               identifier,
               data,
               requestMethod,
               route
           }) => {
        global.fetch.mockRejectedValueOnce(new Error(`${requestMethod} request failed`));

        await sendOrDeleteData(identifier, data, requestMethod, route).then(data => {
            setData(data);
        });

        expect(fetchedData).toBe(undefined);
    }
);
