/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import StockStatusChecker from "../../components/StockStatusChecker";
import {DrugListContainer} from "../../container/DrugListContainer";
import {render, screen} from "@testing-library/react";
import drugs from "./fixtures/drugs";

const renderStockStatusChecker = (initialState = null) => {
    render(
        <DrugListContainer.Provider initialState={initialState || drugs}>
            <StockStatusChecker/>
        </DrugListContainer.Provider>
    );
};

it('should correctly render StockStatusChecker component', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <DrugListContainer.Provider>
            <StockStatusChecker/>
        </DrugListContainer.Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should inform user about running out of stock', () => {
    renderStockStatusChecker();

    expect(screen.getByTestId('stock-warning')).toBeVisible();
    expect(screen.getByTestId('drug-end').textContent).toContain('Witamina C'); // From fixtures/drug.js, quantity 20/80
});

it('should inform user that everything is OK if there is enough drugs in storage', () => {
    renderStockStatusChecker([drugs[0]]);

    expect(screen.getByTestId('stock-ok')).toBeVisible();
});