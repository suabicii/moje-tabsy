import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import MainPage from "../../components/MainPage";

it('should correctly render MainPage', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<MainPage/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});