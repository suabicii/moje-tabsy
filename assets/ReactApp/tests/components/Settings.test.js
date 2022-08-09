import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Settings from "../../components/Settings";

it('should correctly render Settings Page', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<Settings/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});