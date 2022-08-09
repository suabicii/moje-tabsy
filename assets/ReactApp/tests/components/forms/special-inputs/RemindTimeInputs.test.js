import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import RemindTimeInputs from "../../../../components/forms/special-inputs/RemindTimeInputs";

it('should correctly render remind time input', () => {
    const renderer = new ReactShallowRenderer();
    const handleUnitInputChange = jest.fn();
    renderer.render(<RemindTimeInputs handleUnitInputChange={handleUnitInputChange} amount={1}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});