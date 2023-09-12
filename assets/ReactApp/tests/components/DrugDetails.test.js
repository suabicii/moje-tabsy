import React from "react";
import drugs from "./fixtures/drugs";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugDetails from "../../components/DrugDetails";

it('should correctly render DrugDetails component', () => {
    const drug = drugs[0];
    const renderer = new ReactShallowRenderer();

    renderer.render(<DrugDetails drug={drug}/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});