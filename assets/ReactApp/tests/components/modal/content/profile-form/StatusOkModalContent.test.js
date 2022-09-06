import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import StatusOkModalContent from "../../../../../components/modal/content/profile-form/StatusOkModalContent";

it('should correctly render StatusOkModalContent', () => {
    const renderer = new ReactShallowRenderer();
    const setIsModalOpen = jest.fn();

    renderer.render(<StatusOkModalContent setIsModalOpen={setIsModalOpen}/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});