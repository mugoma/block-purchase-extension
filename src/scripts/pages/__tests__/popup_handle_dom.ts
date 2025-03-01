import { beforeEach, describe, jest, test } from '@jest/globals';
import expect from 'expect';
import { checkActiveInterventions, checkForExistingTimer } from '../../utils';
import { addDeleteTimerLinkClickEventListener, addOptionsPageLinkClickEventListener, addResetTimerBtnClickEventListeners, addStatsPageLinkClickEventListener, handleDOMLoad } from "../popup";
// import { handleDOMLoad } from '../popup';

jest.mock('../popup.ts', () => {
    const originalModule = jest.requireActual<typeof import('../popup')>('../popup');
    return {
        ...originalModule,
        addAddTimerBtnClickEventListener: jest.fn(),
        addDeleteTimerLinkClickEventListener: jest.fn(),
        addResetTimerBtnClickEventListeners: jest.fn(),
        addOptionsPageLinkClickEventListener: jest.fn(),
        addStatsPageLinkClickEventListener: jest.fn()
    }
});
jest.mock('../../utils', () => ({
    checkActiveInterventions: jest.fn(),//
    checkForExistingTimer: jest.fn(),
}));
const addAddTimerBtnClickEventListener = require('../popup').addAddTimerBtnClickEventListener;
// TODO: Fix the test cases
describe.skip('handleDOMLoad', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call checkActiveInterventions', () => {
        handleDOMLoad();
        expect(checkActiveInterventions).toHaveBeenCalled();
    });

    test('should call checkForExistingTimer', () => {
        handleDOMLoad();
        expect(checkForExistingTimer).toHaveBeenCalled();
    });
    test('should call addAddTimerBtnClickEventListener', async () => {
        // (addAddTimerBtnClickEventListener as jest.Mock<typeof addAddTimerBtnClickEventListener>).mockReturnValue()
        handleDOMLoad();
        expect(addAddTimerBtnClickEventListener).toHaveBeenCalled();
    });
    test('should call addDeleteTimerLinkClickEventListener', () => {
        handleDOMLoad();
        expect(addDeleteTimerLinkClickEventListener).toHaveBeenCalled();
    });
    test('should call addResetTimerBtnClickEventListeners', () => {
        handleDOMLoad();
        expect(addResetTimerBtnClickEventListeners).toHaveBeenCalled();
    });
    test('should call addOptionsPageLinkClickEventListener', () => {
        handleDOMLoad();
        expect(addOptionsPageLinkClickEventListener).toHaveBeenCalled();
    });
    test('should call addStatsPageLinkClickEventListener', () => {
        handleDOMLoad();
        expect(addStatsPageLinkClickEventListener).toHaveBeenCalled();
    });
});

