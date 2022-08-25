/**
 * @jest-environment jsdom
 * */
import {updateData} from "../../utils/updateData";
import {postData} from "../../utils/postData";

const putMethodResponse = {status: 'It works!'};
let fetchedData;
const setData = data => {
    fetchedData = data;
};
const submittedUpdates = {
    thisIs: 'some',
    dummy: 'data'
};

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(putMethodResponse)
    }));
});

afterEach(() => {
    fetchedData = undefined;
});

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it('should send put request and retrieve positive information', async () => {
    await updateData('my-email@domain.com', submittedUpdates, 'fake-url-end').then(data => {
        setData(data);
    });

    expect(fetchedData).toEqual(putMethodResponse);
})

it('should throw error when put request failed', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Put request failed'));

    await postData('my-email@domain.com', submittedUpdates, 'fake-url-end').then(data => {
        setData(data);
    });

    expect(fetchedData).toBe(undefined);
});
