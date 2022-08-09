import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Sidebar from "../../components/Sidebar";

it('should correctly render sidebar', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<Sidebar/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});