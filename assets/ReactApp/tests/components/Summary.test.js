import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Summary from "../../components/Summary";

it('should correctly render summary', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<Summary/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});