import { afterEach, beforeAll, beforeEach, describe, jest, test } from '@jest/globals';
import expect from 'expect';
import { JSDOM } from 'jsdom';
import { ADD_PURCHASE_TIMER_STAT_ACTION, DELETE_TIMER_ACTION, RESET_TIMER_ACTION } from '../../constants';
import { ADD_TIMER_BTN_ID, DELETE_TIMER_LINK_ID, getCurrentTabUrl, getCurrentUrlFromActiveTab, getProductPriceFromPage, handlePostFeedbackSubmission, openOptionsPage, openPage, OPTIONS_PAGE_LINK_ID, PURCHASE_FEEDBACK_BTNS_CLASS, removeExistingTimerInterval, RESET_TIMER_BTNS_CLASS, setTimeUsingBackgroundProcess, STATS_PAGE_LINK_CLASS, STATS_PAGE_NAME, toggleAddTimerContainerVisibility, toggleExistingTimerContainerVisibility, updateDOMwithCountDown } from '../../utils';
import { getUrlData } from '../../utils_chrome_api';
import { addAddTimerBtnClickEventListener, addDeleteTimerLinkClickEventListener, addOptionsPageLinkClickEventListener, addPurchaseFeedbackBtnClickEventListeners, addResetTimerBtnClickEventListeners, addStatsPageLinkClickEventListener, executeAddTimerButtonClicked, executeDeleteTimerLinkClicked, executePurchaseFeedbackBtnClicked, executeResetTimerButtonClicked } from "../popup";


jest.mock('../../utils', () => ({
    setTimeUsingBackgroundProcess: jest.fn(),
    getCurrentUrlFromActiveTab: jest.fn(),
    getProductPriceFromPage: jest.fn(),
    updateDOMwithCountDown: jest.fn(),
    checkActiveInterventions: jest.fn(),
    checkForExistingTimer: jest.fn(),
    removeExistingTimerInterval: jest.fn(),
    executeResetTimerButtonClicked: jest.fn(),
    executeDeleteTimerLinkClicked: jest.fn(),
    getCurrentTabUrl: jest.fn(),
    toggleAddTimerContainerVisibility: jest.fn(),
    toggleExistingTimerContainerVisibility: jest.fn(),
    openOptionsPage: jest.fn(),
    openPage: jest.fn(),
    handlePostFeedbackSubmission: jest.fn(),
}));
jest.mock('../../utils_chrome_api', () => ({
    getUrlData: jest.fn(),
}));
describe('Test for popup.ts', () => {
    beforeAll(() => {
        // Load the HTML file
        const { window } = new JSDOM();
        global.window = window as any;
        global.document = window.document;
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('Clock Start Timer Starts Timer', async () => {
        (setTimeUsingBackgroundProcess as jest.Mock<typeof setTimeUsingBackgroundProcess>).mockResolvedValue("time");
        (getCurrentUrlFromActiveTab as jest.Mock<typeof getCurrentUrlFromActiveTab>).mockResolvedValue("https://example.com");
        (getProductPriceFromPage as jest.Mock<typeof getProductPriceFromPage>).mockResolvedValue(100);
        (updateDOMwithCountDown as jest.Mock<typeof updateDOMwithCountDown>).mockReturnValue();
        executeAddTimerButtonClicked();

        await new Promise(process.nextTick);
        // await jest.runAllTimersAsync();

        expect(setTimeUsingBackgroundProcess).toBeCalledWith("set-timer", "https://example.com", 100);
        expect(getCurrentUrlFromActiveTab).toBeCalled();
        expect(getProductPriceFromPage).toBeCalled();
        expect(setTimeUsingBackgroundProcess).toBeCalled();
        expect(updateDOMwithCountDown).toBeCalledWith("time");
    })
});

describe('addAddTimerBtnClickEventListener', () => {
    let addTimerBtn: HTMLElement | null;
    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = `<button id="${ADD_TIMER_BTN_ID}"></button>`;
        addTimerBtn = document.getElementById(ADD_TIMER_BTN_ID);
        jest.clearAllMocks();
    });

    test('should add a click event listener to the "Add Timer" button', async () => {
        const addEventListenerSpy = jest.spyOn(addTimerBtn!, 'addEventListener');
        addAddTimerBtnClickEventListener();
        await new Promise(process.nextTick);
        expect(addEventListenerSpy).toHaveBeenCalledWith('click', executeAddTimerButtonClicked);
    });

    test('should not throw an error if the "Add Timer" button is not found', () => {
        document.body.innerHTML = ''; // Remove the button from the DOM
        expect(() => addAddTimerBtnClickEventListener()).not.toThrow();
    });
});

describe('addResetTimerBtnClickEventListeners', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <button class="${RESET_TIMER_BTNS_CLASS}">Reset Timer 1</button>
            <button class="${RESET_TIMER_BTNS_CLASS}">Reset Timer 2</button>
        `;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should add click event listeners to all elements with the reset timer button class', async () => {
        const resetTimerBtns = document.getElementsByClassName(RESET_TIMER_BTNS_CLASS);
        const something = Array.from(resetTimerBtns).map(btn => {
            return jest.spyOn(btn!, 'addEventListener');
        });
        addResetTimerBtnClickEventListeners();
        await new Promise(process.nextTick);

        Array.from(something).forEach(mockSpy => {
            // const addEventListenerSpy = jest.spyOn(btn, 'addEventListener');
            expect(mockSpy).toHaveBeenCalledWith('click', executeResetTimerButtonClicked);
        });
    });
});
describe('addPurchaseFeedbackBtnClickEventListeners', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <button class="${PURCHASE_FEEDBACK_BTNS_CLASS}">Feedback Button 1</button>
            <button class="${PURCHASE_FEEDBACK_BTNS_CLASS}">Feedback Button 2</button>
        `;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should add click event listeners to all elements with the feedback timer button class', async () => {
        const resetTimerBtns = document.getElementsByClassName(PURCHASE_FEEDBACK_BTNS_CLASS);
        const something = Array.from(resetTimerBtns).map(btn => {
            return jest.spyOn(btn!, 'addEventListener');
        });
        addPurchaseFeedbackBtnClickEventListeners();
        await new Promise(process.nextTick);

        Array.from(something).forEach(mockSpy => {
            // const addEventListenerSpy = jest.spyOn(btn, 'addEventListener');
            expect(mockSpy).toHaveBeenCalledWith('click', executePurchaseFeedbackBtnClicked);
        });
    });
});

describe('executeResetTimerButtonClicked', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should remove existing timer interval', () => {
        executeResetTimerButtonClicked();
        expect(removeExistingTimerInterval).toHaveBeenCalled();
    });

    test('should get current URL and product price concurrently', async () => {
        (getCurrentUrlFromActiveTab as jest.Mock<typeof getCurrentUrlFromActiveTab>).mockResolvedValue('http://example.com');
        (getProductPriceFromPage as jest.Mock<typeof getProductPriceFromPage>).mockResolvedValue(100);

        await executeResetTimerButtonClicked();

        expect(getCurrentUrlFromActiveTab).toHaveBeenCalled();
        expect(getProductPriceFromPage).toHaveBeenCalled();
    });

    test('should set timer using background process and update DOM with countdown', async () => {
        const mockEndTime = Date.now() + 10000;
        (getCurrentUrlFromActiveTab as jest.Mock<typeof getCurrentUrlFromActiveTab>).mockResolvedValue('http://example.com');
        (getProductPriceFromPage as jest.Mock<typeof getProductPriceFromPage>).mockResolvedValue(100);
        (setTimeUsingBackgroundProcess as jest.Mock<typeof setTimeUsingBackgroundProcess>).mockResolvedValue(mockEndTime);

        executeResetTimerButtonClicked();
        await new Promise(process.nextTick);


        expect(setTimeUsingBackgroundProcess).toHaveBeenCalledWith(RESET_TIMER_ACTION, 'http://example.com', 100);
        expect(updateDOMwithCountDown).toHaveBeenCalledWith(mockEndTime);
    });
});

describe('addDeleteTimerLinkClickEventListener', () => {
    let deleteTimerLink: HTMLElement | null;

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = `
            <a id="${DELETE_TIMER_LINK_ID}"></a>
        `;
        deleteTimerLink = document.getElementById(DELETE_TIMER_LINK_ID);
    });

    test('should add a click event listener to the delete timer link', async () => {
        const addEventListenerSpy = jest.spyOn(deleteTimerLink!, 'addEventListener');
        addDeleteTimerLinkClickEventListener();
        await new Promise(process.nextTick);
        expect(addEventListenerSpy).toHaveBeenCalledWith('click', executeDeleteTimerLinkClicked);
    });

    test('should not throw an error if delete timer link is not found', () => {
        document.body.innerHTML = ''; // Clear the document body
        expect(() => addDeleteTimerLinkClickEventListener()).not.toThrow();
    });
});


describe('executeDeleteTimerLinkClicked', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // let mockQuery =jest.spyOn(chrome.runtime, 'sendMessage');
        // let mockSendMessage =jest.spyOn(chrome.tabs, 'query');
    });

    test('should delete the timer and update the DOM accordingly', async () => {
        let mockSendMessage = jest.spyOn(chrome.runtime, 'sendMessage');
        let mockQuery = jest.spyOn(chrome.tabs, 'query');
        const mockTabs = [{ id: 1, url: 'http://example.com', index: 0, pinned: false, highlighted: false, windowId: 1, active: true, incognito: false, selected: true, discarded: false, autoDiscardable: true, groupId: -1 }];
        const mockUrl = 'http://example.com';

        mockQuery.mockResolvedValue(mockTabs);
        (getCurrentTabUrl as jest.Mock<typeof getCurrentTabUrl>).mockReturnValue(mockUrl);
        mockSendMessage.mockResolvedValue("");

        executeDeleteTimerLinkClicked();
        await new Promise(process.nextTick);


        expect(mockQuery).toHaveBeenCalledWith({ active: true, currentWindow: true });
        expect(getCurrentTabUrl).toHaveBeenCalledWith(mockTabs);
        expect(mockSendMessage).toHaveBeenCalledWith({ action: DELETE_TIMER_ACTION, url: mockUrl, initiator: 'popup' });
        expect(removeExistingTimerInterval).toHaveBeenCalled();
        expect(toggleAddTimerContainerVisibility).toHaveBeenCalledWith(true);
        expect(toggleExistingTimerContainerVisibility).toHaveBeenCalledWith(false);
    });
});

describe('addOptionsPageLinkClickEventListener', () => {
    let optionsPageLink: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `<a id="${OPTIONS_PAGE_LINK_ID}"></a>`;
        optionsPageLink = document.getElementById(OPTIONS_PAGE_LINK_ID) as HTMLElement;
    });

    test('should add a click event listener to the options page link', () => {
        addOptionsPageLinkClickEventListener();
        optionsPageLink.click();
        expect(openOptionsPage).toHaveBeenCalled();
    });

    test('should not throw an error if the options page link is not found', () => {
        document.body.innerHTML = '';
        expect(() => addOptionsPageLinkClickEventListener()).not.toThrow();
    });
});


describe('addStatsPageLinkClickEventListener', () => {
    let statsPageLink: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `<a class="${STATS_PAGE_LINK_CLASS}"></a>`;
        statsPageLink = document.getElementsByClassName(STATS_PAGE_LINK_CLASS)[0] as HTMLElement;
    });

    test('should add a click event listener to the stats page link', () => {
        addStatsPageLinkClickEventListener();
        statsPageLink.click();
        expect(openPage).toHaveBeenCalledWith(STATS_PAGE_NAME);
    });

    test('should not throw an error if the stats page link is not found', () => {
        document.body.innerHTML = '';
        expect(() => addStatsPageLinkClickEventListener()).not.toThrow();
    });
});
describe('executePurchaseFeedbackBtnClicked', () => {
    let event: Event;
    let target: HTMLElement;

    beforeEach(() => {
        target = document.createElement('button');
        event = { target } as unknown as Event;
        (getCurrentUrlFromActiveTab as jest.Mock<typeof getCurrentUrlFromActiveTab>).mockResolvedValue('http://example.com');
        (getUrlData as jest.Mock<typeof getUrlData>).mockResolvedValue({ time: 1234567890, price: 100 });
        jest.spyOn(chrome.runtime, 'sendMessage').mockResolvedValue('');
        jest.spyOn(chrome.tabs, 'query').mockResolvedValue([{
            id: 1, url: 'http://example.com',
            index: 0,
            pinned: false,
            highlighted: false,
            windowId: 0,
            active: false,
            incognito: false,
            selected: false,
            discarded: false,
            autoDiscardable: false,
            groupId: 0
        }]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should send a message with deferred purchase when proceededWithPurchase is not "y"', async () => {
        target.dataset.proceededWithPurchase = 'n';

        executePurchaseFeedbackBtnClicked(event);
        await new Promise(process.nextTick);


        expect(getCurrentUrlFromActiveTab).toHaveBeenCalled();
        expect(getUrlData).toHaveBeenCalledWith('http://example.com');
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
            action: ADD_PURCHASE_TIMER_STAT_ACTION,
            url: 'http://example.com',
            initiator: 'popup',
            wasDeferred: true,
            timerEndTime: 1234567890,
            price: 100,
        });
        expect(handlePostFeedbackSubmission).toHaveBeenCalled();
    });

    test('should send a message with completed purchase when proceededWithPurchase is "y"', async () => {
        target.dataset.proceededWithPurchase = 'y';

        executePurchaseFeedbackBtnClicked(event);
        await new Promise(process.nextTick);


        expect(getCurrentUrlFromActiveTab).toHaveBeenCalled();
        expect(getUrlData).toHaveBeenCalledWith('http://example.com');
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
            action: ADD_PURCHASE_TIMER_STAT_ACTION,
            url: 'http://example.com',
            initiator: 'popup',
            wasDeferred: false,
            timerEndTime: 1234567890,
            price: 100,
        });
        expect(handlePostFeedbackSubmission).toHaveBeenCalled();
    });
});