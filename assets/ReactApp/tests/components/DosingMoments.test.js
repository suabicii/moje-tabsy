/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import {Provider} from "react-redux";
import store from "../../store";
import DosingMoments from "../../components/DosingMoments";
import drugs from "./fixtures/drugs";
import {render, screen} from "@testing-library/react";

const drug = drugs[0];
const content = drug.dosingMoments;

function WrappedComponent() {
    return (
        <Provider store={store}>
            <DosingMoments content={content} drugId={drug.id}/>
        </Provider>
    );
}

it('should properly render DosingMoments component', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<WrappedComponent/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it.each`
    hour
    ${Object.values(content)[0]}
    ${Object.values(content)[1]}
`('should display proper hours of dosing moments', ({hour}) => {
    render(<WrappedComponent/>);

    expect(screen.queryByText(hour)).toBeTruthy();
});