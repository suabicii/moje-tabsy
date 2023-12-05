import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import OutOfStockDates from "../../components/OutOfStockDates";
import drugs from "./fixtures/drugs";
import Mockdate from "mockdate";

beforeAll(() => {
    Mockdate.set('2020-01-01');
});

afterAll(() => {
    Mockdate.reset();
});


it('should correctly render OutOfStockDates component', () => {
    const renderer = new ReactShallowRenderer();

    renderer.render(<OutOfStockDates drugList={drugs}/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});