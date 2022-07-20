import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugModalContent from "../../../components/modal/DrugModalContent";

it('should correctly render modal content with form', function () {
    const renderer = new ReactShallowRenderer();
    const setIsModalOpen = jest.fn();
    renderer.render(<DrugModalContent setIsModalOpen={setIsModalOpen}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
}); 