import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import NotFoundPage from "../../components/NotFoundPage";

it('should correctly render NotFoundPage', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<NotFoundPage/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});