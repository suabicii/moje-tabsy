/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SettingsForm from "../../../components/forms/SettingsForm";
import {fireEvent, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../../store";
import changeTheme from "../../../utils/changeTheme";

jest.mock('../../../utils/changeTheme', () => ({
    __esModule: true,
    default: jest.fn()
}));

beforeAll(() => {
    changeTheme.mockImplementation(darkMode => {
        console.log(`Dark mode in SettingsForm was set to: ${darkMode}`);
    });
});

afterAll(() => {
    jest.clearAllMocks();
});

function WrappedComponent() {
    return (
        <Provider store={store}>
            <SettingsForm/>
        </Provider>
    );
}

it('should correctly render SettingsForm', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<WrappedComponent/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should save dark mode state to localStorage after form submission', () => {
    render(<WrappedComponent/>);

    fireEvent.click(screen.getByTestId('settings-submit'));
    const darkModeState = localStorage.getItem('darkMode');

    expect(darkModeState).toBeTruthy();
});

it('should save dark mode state to localStorage after checkbox change and form submission', () => {
    render(<WrappedComponent/>);

    fireEvent.click(screen.getByTestId('dark-mode-switcher'));
    fireEvent.click(screen.getByTestId('settings-submit'));
    const darkModeState = localStorage.getItem('darkMode');

    expect(darkModeState).toBeTruthy();
});