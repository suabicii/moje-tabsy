import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import RemindTimeInput from "../../../../components/forms/special-inputs/RemindTimeInput";

it('should correctly render remind time input', () => {
    const renderer = new ReactShallowRenderer();
    const handleUnitInputChange = jest.fn();
    renderer.render(<RemindTimeInput handleUnitInputChange={handleUnitInputChange} ordinalNumber={1}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});