import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Modal from "../../../components/modal/Modal";
import {Provider} from "react-redux";
import store from "../../../store";

it('should correctly render opened modal with some content', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <Modal
                modalIsOpen={true}
                content={<p>Some content</p>}
                customRoot={<div className="custom-root"></div>}
            />
        </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});