/**
 * @jest-environment jsdom
 * */
import {fetchData} from "../../utils/fetchData";

let fetchedData;
const mockData = {data: 'some data'};
const setData = data => {
    fetchedData = data;
};

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(mockData)
    }));
});

afterEach(() => {
    fetchedData = undefined;
});

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it('should fetch some JSON data from API if connection succeeded',async () => {
    await fetchData('/fake-api/some-data').then(data => {
        setData(data);
    });

    expect(fetchedData).toEqual(mockData);
});

it('should get error when fetching data from API failed', async () => {
    fetch.mockRejectedValueOnce(new Error('Cannot fetch data'));

    await fetchData('/fake-api/some-data').then(data => {
        setData(data);
    });

    expect(fetchedData).toBeUndefined();
});