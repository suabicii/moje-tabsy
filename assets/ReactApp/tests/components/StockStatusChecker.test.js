/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import StockStatusChecker from "../../components/StockStatusChecker";
import {act, render, screen} from "@testing-library/react";
import drugs from "./fixtures/drugs";
import {Provider} from "react-redux";
import store from "../../store";
import {fetchDrugs} from "../../features/drugs/drugsSlice";

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

const renderStockStatusChecker = () => {
    render(
        <Provider store={store}>
            <StockStatusChecker/>
        </Provider>
    );
};

it('should correctly render StockStatusChecker component', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <StockStatusChecker/>
        </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should inform user about running out of stock', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drugs)
    }));
    store.dispatch(fetchDrugs());

    await act(() => {
        renderStockStatusChecker();
    });

    expect(screen.getByTestId('stock-warning')).toBeVisible();
    expect(screen.getByTestId('drug-end').textContent).toContain('Witamina C'); // From fixtures/drug.js, quantity 20/80
});

it('should inform user that everything is OK if there is enough drugs in storage', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve([drugs[0]])
    }));
    store.dispatch(fetchDrugs());

    await act(() => {
        renderStockStatusChecker();
    });

    expect(screen.getByTestId('stock-ok')).toBeVisible();
});