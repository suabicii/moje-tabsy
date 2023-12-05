/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Summary from "../../components/Summary";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "../../store";

it('should correctly render summary', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <Summary/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display information about empty drug list in schedule, stock status checker and out of stock dates area', () => {
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