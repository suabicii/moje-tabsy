/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import NavbarMain from "../../components/NavbarMain";
import {Provider} from "react-redux";
import store from "../../store";
import {fireEvent, render, screen} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function WrappedComponent() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <NavbarMain/>
                <Sidebar/>
            </BrowserRouter>
        </Provider>
    );
}

const changeTheme = require('../../utils/changeTheme');
let changeThemeMock;


beforeEach(() => {
    changeThemeMock = jest.spyOn(changeTheme, 'default');
});

afterAll(() => {
    jest.clearAllMocks();
});

it('should correctly render main navbar', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <NavbarMain/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should change theme to light', () => {
    render(<WrappedComponent/>);

    expect(changeThemeMock).toHaveBeenLastCalledWith(false);
});

it('should change theme to dark after clicking toggler', () => {
    render(<WrappedComponent/>);

    fireEvent.click(screen.getByTestId('dark-theme-toggle'));

    expect(changeThemeMock).toBeCalledWith(true);
});
