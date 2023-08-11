/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import store from "../../store";
import DosingMoments from "../../components/DosingMoments";
import drugs from "./fixtures/drugs";
import Mockdate from "mockdate";
import dayjs from "dayjs";

const drug = drugs[0];
const content = drug.dosingMoments;

beforeAll(() => {
    Mockdate.set('2020-01-01');
});

afterAll(() => {
    Mockdate.reset();
});

it('should properly render DosingMoments component', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <DosingMoments content={content} drugId={drug.id}/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it.each`
    hour
    ${Object.values(content)[0]}
    ${Object.values(content)[1]}
`('should display proper hours of dosing moments', ({hour}) => {
    render(
        <Provider store={store}>
            <DosingMoments content={content} drugId={drug.id}/>
        </Provider>
    );

    expect(screen.queryByText(hour)).toBeTruthy();
});

it('should not render component if time for taking medicines is up', () => {
    Mockdate.set(dayjs().hour(23).minute(59).toDate());

    render(
        <Provider store={store}>
            <DosingMoments content={content} drugId={drug.id}/>
        </Provider>
    );

    expect(screen.queryByTestId('dosing-moments')).toBeFalsy();
}); 