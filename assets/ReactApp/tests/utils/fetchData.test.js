import {fetchData} from "../../utils/fetchData";

const unmockedFetch = global.fetch;

let fetchedData;
const mockData = {data: 'some data'};
const setData = data => {
    fetchedData = data;
};

beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(mockData)
    }));
});

afterEach(() => {
    fetchedData = undefined;
});

afterAll(() => {
    global.fetch = unmockedFetch;
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