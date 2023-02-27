import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import MainPage from "../../components/MainPage";
import {Provider} from "react-redux";
import store from "../../store";

it('should correctly render MainPage', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <MainPage/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});