/**
 * @jest-environment jsdom
 * */
import React from "react";
import DosingMomentInput from "../../../../components/forms/special-inputs/DosingMomentInput";
import {render, screen} from "@testing-library/react";
import ReactShallowRenderer from "react-test-renderer/shallow";

it('should correctly render dosing moment input', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<DosingMomentInput name="some_name" value="00:00"/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should render single dosing moment input with correct name and value', () => {
    render(<DosingMomentInput name="some_name" value="00:00"/>);
    expect(screen.getByTestId('some_name-test').getAttribute('name')).toBe('some_name');
    expect(screen.getByTestId('some_name-test')).toHaveValue('00:00');
});