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

const drug = drugs[0];
const content = drug.dosingMoments;

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

    expect(screen.queryByText(hour)).not.toBeFalsy();
});