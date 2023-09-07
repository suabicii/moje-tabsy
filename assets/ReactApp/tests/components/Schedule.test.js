/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Schedule from "../../components/Schedule";
import {Provider} from "react-redux";
import store from "../../store";
import Mockdate from "mockdate";
import {render, screen} from "@testing-library/react";
import dayjs from "dayjs";
import {fetchDrugs, setDrugs} from "../../features/drugs/drugsSlice";
import drugs from "./fixtures/drugs";

const drug = drugs[0];
const dosingMomentsContent = drug.dosingMoments;

beforeAll(() => {
    Mockdate.set('2020-01-01');
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drugs)
    }));
});

beforeEach(() => {
    store.dispatch(fetchDrugs());
});

afterAll(() => {
    Mockdate.reset();
});

function WrappedComponent() {
    return (
        <Provider store={store}>
            <Schedule/>
        </Provider>
    );
}

it('should correctly render Schedule component', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<WrappedComponent/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it.each`
    hour
    ${Object.values(dosingMomentsContent)[0]}
    ${Object.values(dosingMomentsContent)[1]}
`('should display proper hours of dosing moments', ({hour}) => {
    render(<WrappedComponent/>);

    expect(screen.queryByText(hour)).toBeTruthy();
});

it('should display information about empty drug list if all drugs was taken', () => {
    store.dispatch(setDrugs([]));
    const {container} = render(<WrappedComponent/>);

    const emptyInfo = container.querySelector('.drug-list-empty');

    expect(emptyInfo).toBeTruthy();
});

it('should not render component if time for taking medicines is up', () => {
    Mockdate.set(dayjs().hour(23).minute(59).toDate());

    render(<WrappedComponent/>);

    expect(screen.queryByTestId('dosing-moments')).toBeFalsy();
});