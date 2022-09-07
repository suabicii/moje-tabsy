import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import StatusFailModalContent from "../../../../../components/modal/content/profile-form/StatusFailModalContent";

it('should correctly render StatusFailModalContent', () => {
    const renderer = new ReactShallowRenderer();
    const setIsModalOpen = jest.fn();

    renderer.render(<StatusFailModalContent setIsModalOpen={setIsModalOpen}/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});