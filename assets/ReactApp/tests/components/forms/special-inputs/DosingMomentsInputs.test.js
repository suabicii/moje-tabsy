/**
 * @jest-environment jsdom
 * */
import React from "react";
import {render, screen} from "@testing-library/react";
import DosingMomentsInputs from "../../../../components/forms/special-inputs/DosingMomentsInputs";
import ReactShallowRenderer from "react-test-renderer/shallow";

const dosingMoments = [
    ['hour1', '00:00'],
    ['hour2', '00:01']
];

it('should correctly render dosing moments inputs', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<DosingMomentsInputs dosingMoments={dosingMoments}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should render DosingMomentsInputs component with collection of DosingMomentInput and correct values', () => {
    render(<DosingMomentsInputs dosingMoments={dosingMoments}/>);
    expect(screen.getByTestId('hour1')).toHaveValue('00:00');
    expect(screen.getByTestId('hour2')).toHaveValue('00:01');
});