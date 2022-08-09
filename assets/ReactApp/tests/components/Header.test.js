import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Header from "../../components/Header";

it('should correctly render Header', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<Header/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});