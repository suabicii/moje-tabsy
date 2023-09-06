/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Schedule from "../../components/Schedule";
import {Provider} from "react-redux";
import store from "../../store";
import Mockdate from "mockdate";
import {render} from "@testing-library/react";

beforeAll(() => {
    Mockdate.set('2020-01-01');
});

afterAll(() => {
    Mockdate.reset();
});

it('should correctly render Schedule component', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <Schedule/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display information about empty drug list if all drugs was taken', () => {
    const {container} = render(
        <Provider store={store}>
            <Schedule/>
        </Provider>
    );

    const emptyInfo = container.querySelector('.drug-list-empty');

    expect(emptyInfo).toBeTruthy();
});