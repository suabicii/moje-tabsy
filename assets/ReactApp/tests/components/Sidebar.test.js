/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Sidebar from "../../components/Sidebar";
import {fireEvent, render, screen} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";

it('should correctly render sidebar', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<Sidebar/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should close sidebar menu after clicking a link', () => {
    render(
        <BrowserRouter>
            <Sidebar/>
        </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId('main-route-link'));

    expect(screen.getByRole('navigation')).not.toHaveClass('show');
});