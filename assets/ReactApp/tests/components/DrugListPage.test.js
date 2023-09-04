/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugListPage from "../../components/DrugListPage";
import {BrowserRouter} from "react-router-dom";

it('should correctly render DrugListPage', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <BrowserRouter>
            <DrugListPage/>
        </BrowserRouter>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
}); 