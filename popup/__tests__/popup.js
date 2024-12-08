import { jest } from '@jest/globals';
import expect from 'expect';
import { handleAddTimerBtnClick } from "../popup.js"
import { JSDOM } from 'jsdom';

jest.mock('../popup.js');
describe('Test for popup.js', () => {
    beforeAll(() => {
        // Load the HTML file
        const { window } = new JSDOM();
        global.window = window;
        global.document = window.document;
    });
    test('Clock Start Timer Starts Timer', () => {
        jest.spyOn(chrome.tabs, "query").mockResolvedValue([{
            id: 3,
            active: true,
            currentWindow: true,
            url: "example.com"
        }]);
        jest.spyOn(chrome.runtime, "sendMessage").mockResolvedValue("")

        // const startTimerButton = document.getElementById("add-timer-btn")
        // startTimerButton.click()
        handleAddTimerBtnClick()
        expect(chrome.tabs.query).toBeCalled()
        expect(chrome.runtime.sendMessage).toBeCalled()
    })
});