import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Modal from "../../../components/modal/Modal";

it('should correctly render opened modal with some content', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
            <Modal
                modalIsOpen={true}
                content={<p>Some content</p>}
                customRoot={<div className="custom-root"></div>}
            />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});