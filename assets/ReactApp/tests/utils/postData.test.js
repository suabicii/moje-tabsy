/**
 * @jest-environment jsdom
 * */
import {postData} from "../../utils/postData";

const postMethodResponse = {status: 'ok'};
let fetchedData;
const setData = data => {
    fetchedData = data;
};
const submittedMockData = {
    name: 'Michael',
    surname: 'Slabikovsky'
};

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(postMethodResponse)
    }));
});

afterEach(() => {
    fetchedData = undefined;
});

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it('should post some data via API and get OK status when connection succeeded', async () => {
    await postData(submittedMockData, 'fake-url-end').then(data => {
        setData(data);
    });

    expect(fetchedData).toEqual(postMethodResponse);
});

it('should throw error when post request failed', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Post request failed'));

    await postData(submittedMockData, 'fake-url-end').then(data => {
        setData(data);
    });

    expect(fetchedData).toBe(undefined);
});