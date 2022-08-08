import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import ProfileForm from "../../../components/forms/ProfileForm";

it('should correctly display ProfileForm', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<ProfileForm/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});