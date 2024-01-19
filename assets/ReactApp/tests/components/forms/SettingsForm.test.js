/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SettingsForm from "../../../components/forms/SettingsForm";

it('should correctly render SettingsForm', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<SettingsForm/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});