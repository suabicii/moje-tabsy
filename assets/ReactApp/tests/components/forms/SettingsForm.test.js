/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SettingsForm from "../../../components/forms/SettingsForm";
import {fireEvent, render, screen} from "@testing-library/react";

it('should correctly render SettingsForm', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<SettingsForm/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should save dark mode state to localStorage after form submission', () => {
    render(<SettingsForm/>);

    fireEvent.click(screen.getByTestId('settings-submit'));
    const darkModeState = localStorage.getItem('darkMode');

    expect(darkModeState).toBeTruthy();
});

it('should save dark mode state to localStorage after checkbox change and form submission', () => {
    render(<SettingsForm/>);

    fireEvent.click(screen.getByTestId('dark-mode-switcher'));
    fireEvent.click(screen.getByTestId('settings-submit'));
    const darkModeState = localStorage.getItem('darkMode');

    expect(darkModeState).toBeTruthy();
});