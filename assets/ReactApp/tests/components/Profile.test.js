import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Profile from "../../components/Profile";

it('should correctly render Profile page', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<Profile/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});