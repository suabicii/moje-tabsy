import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import NavbarMain from "../../components/NavbarMain";

it('should correctly render main navbar', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<NavbarMain/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});