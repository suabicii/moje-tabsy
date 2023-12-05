import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import OutOfStockDates from "../../components/OutOfStockDates";
import drugs from "./fixtures/drugs";
import Mockdate from "mockdate";
import store from "../../store";
import {fetchDrugs} from "../../features/drugs/drugsSlice";
import {Provider} from "react-redux";

beforeAll(() => {
    Mockdate.set('2020-01-01');
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drugs)
    }));

    store.dispatch(fetchDrugs());
});

afterAll(() => {
    Mockdate.reset();
    global.fetch.mockClear();
    delete global.fetch;
});


it('should correctly render OutOfStockDates component', () => {
    const renderer = new ReactShallowRenderer();

    renderer.render(
        <Provider store={store}>
            <OutOfStockDates/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});