/**
 * @jest-environment jsdom
 * */
import React from "react";
import changeTheme from "../../utils/changeTheme";
import {render, screen} from "@testing-library/react";

const renderMockComponent = () => {
    render(<nav id="sidebarMenu" role="navigation">Let's assume there is a sidebar here</nav>);
};

it('should change theme to light', () => {
    renderMockComponent();
    changeTheme(false);
    expect(screen.queryByRole('navigation')).toHaveClass('bg-white');
});

it('should change theme to dark', () => {
    renderMockComponent();
    changeTheme(true);
    expect(screen.queryByRole('navigation')).toHaveClass('bg-dark');
});