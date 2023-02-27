/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Summary from "../../components/Summary";
import {act, render, screen} from "@testing-library/react";
import drugs from "./fixtures/drugs";
import {BrowserRouter} from "react-router-dom";
import dayjs from "dayjs";
import {Provider} from "react-redux";
import store from "../../store";
import {fetchDrugs} from "../../features/drugs/drugsSlice";

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it('should correctly render summary', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <Summary/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display drug dosing schedule with correct values',  async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drugs)
    }));

    store.dispatch(fetchDrugs());

    await act(() => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Summary customDate={dayjs('2022-01-01T16:00:00')}/>
                </BrowserRouter>
            </Provider>
        );
    });

    expect(screen.getByTestId('schedule-drugName').textContent).toContain('Xanax');
    expect(screen.getByTestId('schedule-dosingHour').textContent).toContain('18:00');
});