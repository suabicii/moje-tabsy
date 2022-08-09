import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugListPage from "../../components/DrugListPage";

it('should correctly render DrugListPage', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<DrugListPage/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
}); 