/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Summary from "../../components/Summary";
import {act, render, screen} from "@testing-library/react";
import drugs from "./fixtures/drugs";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "../../store";
import {fetchDrugs, setDrugs} from "../../features/drugs/drugsSlice";
import Mockdate from "mockdate";
import dayjs from "dayjs";

afterAll(() => {
    Mockdate.reset();
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
    Mockdate.set(dayjs().hour(16).minute(0).toDate());

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drugs)
    }));

    store.dispatch(fetchDrugs());
    const drug = drugs[0];
    const dosingMomentsKeys = Object.keys(drug.dosingMoments);

    await act(() => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Summary/>
                </BrowserRouter>
            </Provider>
        );
    });

    expect(screen.getByTestId(`schedule-drugName${drug.id}`).textContent).toContain('Xanax');
    expect(screen.getByTestId(`schedule-dosingHour-${drug.id}-${dosingMomentsKeys[1]}`).textContent).toContain('18:00');
});

it('should display information about empty drug list in schedule and stock status checker', () => {
    store.dispatch(setDrugs([]));
    const {container} = render(
        <Provider store={store}>
            <BrowserRouter>
                <Summary/>
            </BrowserRouter>
        </Provider>
    );

    const emptyInfo = container.querySelectorAll('.drug-list-empty');

    expect(emptyInfo.length).toBeGreaterThan(0);
});