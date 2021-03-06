/**
 * Created by Max Kendall
 * 03/25/2020
 */
import React from 'react';
import { shallow } from 'enzyme';

import { fetchPsc } from "helpers/searchHelper";
import { cleanPscData } from "helpers/pscHelper";
import { PSCCheckboxTreeContainer } from "../../../../../src/js/containers/search/filters/psc/PSCCheckboxTreeContainer";

import {
    topTierResponse,
    secondTierResponse,
    thirdTierResponse,
    fourthTierResponse,
    defaultProps
} from './mockPSC';

jest.mock("helpers/searchHelper", () => ({
    fetchPsc: jest.fn()
}));

const treePopulatedToSecondTier = cleanPscData(topTierResponse.results).map((top) => {
    if (top.id === 'Service') {
        return {
            ...top,
            children: cleanPscData(secondTierResponse.results)
        };
    }
    return top;
});

describe('PscCheckboxTreeContainer', () => {
    describe('fetchPsc', () => {
        const mockFn = jest.fn();
        const container = shallow(<PSCCheckboxTreeContainer {...defaultProps} setPscNodes={mockFn} />);
        beforeEach(async () => {
            mockFn.mockReset();
        });
        it('appends placeholder children to the nodes at the trunk level', async () => {
            fetchPsc.mockImplementation(() => ({
                promise: Promise.resolve({ data: topTierResponse })
            }));
            await container.instance().componentDidMount();
            const newNodes = mockFn.mock.calls[0][1];
            expect(newNodes.length).toEqual(3);

            newNodes
                .forEach((topTier) => {
                    expect(topTier.children.length).toEqual(1);
                    expect(topTier.children[0].isPlaceHolder).toEqual(true);
                });
        });
        it('appends placeholder children to the first branch level (tier 2)', async () => {
            fetchPsc.mockImplementation(() => ({
                promise: Promise.resolve({ data: secondTierResponse })
            }));
            await container.instance().fetchPsc('Service');
            const newNodes = mockFn.mock.calls[0][1];
            expect(newNodes.length).toEqual(23);
            
            newNodes
                .forEach((secondTier) => {
                    expect(secondTier.children.length).toEqual(1);
                    expect(secondTier.children[0].isPlaceHolder).toEqual(true);
                });
        });
        it('appends placeholder children to the second branch level (tier 3)', async () => {
            fetchPsc.mockImplementation(() => ({
                promise: Promise.resolve({ data: thirdTierResponse })
            }));
            await container.instance().fetchPsc('Service/B');
            const newNodes = mockFn.mock.calls[0][1];
            expect(newNodes.length).toEqual(1);

            newNodes
                .forEach((thirdTier) => {
                    expect(thirdTier.children.length).toEqual(1);
                    expect(thirdTier.children[0].isPlaceHolder).toEqual(true);
                });
        });
        it('no placeholder children to the leaf level (tier 4)', async () => {
            fetchPsc.mockImplementation(() => ({
                promise: Promise.resolve({ data: fourthTierResponse })
            }));
            await container.instance().fetchPsc('Service/B/B5');
            const newNodes = mockFn.mock.calls[0][1];
            expect(newNodes.length).toEqual(48);
            newNodes
                .forEach((fourthTier) => {
                    expect(fourthTier.children).toEqual(null);
                });
        });
    });
    describe('onExpand', () => {
        let container;
        const mockSetExpanded = jest.fn();
        const mockFetchPsc = jest.fn();

        beforeEach(async () => {
            mockSetExpanded.mockReset();
            mockFetchPsc.mockReset();
            container = shallow(<PSCCheckboxTreeContainer
                {...defaultProps}
                nodes={treePopulatedToSecondTier}
                setExpandedPsc={mockSetExpanded} />);
            container.instance().fetchPsc = mockFetchPsc;
        });
        it('calls fetchPsc w/ top tier and second tier params', async () => {
            container.instance().onExpand(
                'Service',
                ['Service'],
                true,
                {
                    treeDepth: 0,
                    parent: {}
                }
            );
            expect(mockFetchPsc).toHaveBeenLastCalledWith('Service');
        });
        it('calls fetchPsc w/ top tier & second tier params', async () => {
            container.instance().onExpand(
                'B',
                ['Service', 'B'],
                true,
                {
                    treeDepth: 1,
                    parent: { value: 'Service', ancestors: [] }
                }
            );
            expect(mockFetchPsc).toHaveBeenLastCalledWith('Service/B');
        });
        it('calls fetchPsc w/ top tier, second tier, and third tier params', () => {
            container.instance().onExpand(
                'B5',
                ['Service', 'B', 'B5'],
                true,
                {
                    treeDepth: 2,
                    parent: { value: 'B', ancestors: ['Service'] }
                }
            );
            expect(mockFetchPsc).toHaveBeenLastCalledWith('Service/B/B5');
        });
    });
    describe('onCollapse', () => {
        it('updates the props.expanded array', () => {
            const mockFn = jest.fn();
            const container = shallow(
                <PSCCheckboxTreeContainer
                    {...defaultProps}
                    nodes={treePopulatedToSecondTier}
                    expanded={['Services', 'B']}
                    setExpandedPsc={mockFn} />);
            container.instance().onCollapse(['Services']);
            const newExpanded = mockFn.mock.calls[0][0];
            expect(newExpanded).toEqual(['Services']);
        });
    });
    describe('onCheck', () => {
        it('updates the checked array', async () => {
            const mockFn = jest.fn();
            const container = shallow(<PSCCheckboxTreeContainer
                {...defaultProps}
                nodes={treePopulatedToSecondTier}
                setCheckedPsc={mockFn} />);
            container.instance().onCheck(['Service']);
            const newChecked = mockFn.mock.calls[0][0];
            expect(newChecked).toEqual(['Service']);
        });
    });
    describe('onUncheck', () => {
        it('updates the checked array', async () => {
            const mockFn = jest.fn();
            const container = shallow(<PSCCheckboxTreeContainer
                {...defaultProps}
                nodes={treePopulatedToSecondTier}
                setCheckedPsc={mockFn}
                checked={['Service']} />);

            container.instance().onUncheck([], { value: 'Service', checked: false });

            const newChecked = mockFn.mock.calls[0][0];
            expect(newChecked).toEqual([]);
        });
    });
});
