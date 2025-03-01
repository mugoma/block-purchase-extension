import { saveOptions, restoreOptions } from '../options';
import {afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
/**
 * @jest-environment jsdom
 */


describe.skip('Options Page', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input type="checkbox" id="timer">
            <input type="text" id="timer-duration">
            <input type="checkbox" id="reviews">
            <div id="status"></div>
            <button id="save"></button>
        `;

        jest.spyOn(chrome.storage.local, 'set');
        const mockGet = jest.spyOn(chrome.storage.local, 'get');
        // (mockGet as jest.Mock<typeof chrome.storage.local.get>).mockResolvedValue({ timer: true, reviews: true, timerDuration: 24 });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should save options to chrome storage', async () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;
        const reviewsCheckbox = document.getElementById('reviews') as HTMLInputElement;
        const statusDiv = document.getElementById('status');

        timerCheckbox.checked = true;
        timerDurationInput.value = '30';
        reviewsCheckbox.checked = false;

        await saveOptions();

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            timer: true,
            timerDuration: '30',
            reviews: false
        });

        expect(statusDiv?.textContent).toBe('Options saved.');

        // Check if status message clears after 750ms
        jest.advanceTimersByTime(750);
        expect(statusDiv?.textContent).toBe('');
    });

    test('should restore options from chrome storage', async () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;
        const reviewsCheckbox = document.getElementById('reviews') as HTMLInputElement;

        await restoreOptions();

        expect(timerCheckbox.checked).toBe(true);
        expect(timerDurationInput.value).toBe('24');
        expect(timerDurationInput.disabled).toBe(false);
        expect(reviewsCheckbox.checked).toBe(true);
    });

    test('should disable timer duration input when timer is unchecked', () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;

        timerCheckbox.checked = false;
        const event = new Event('change');
        timerCheckbox.dispatchEvent(event);

        expect(timerDurationInput.disabled).toBe(true);
    });

    test('should enable timer duration input when timer is checked', () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;

        timerCheckbox.checked = true;
        const event = new Event('change');
        timerCheckbox.dispatchEvent(event);

        expect(timerDurationInput.disabled).toBe(false);
    });
});
/**
 * @jest-environment jsdom
 */

describe.skip('Options Page', () => {
    beforeEach(() => {
        document.body.innerHTML = `
                <input type="checkbox" id="timer">
                <input type="text" id="timer-duration">
                <input type="checkbox" id="reviews">
                <div id="status"></div>
                <button id="save"></button>
            `;

        jest.spyOn(chrome.storage.local, 'set');
        const mockGet = jest.spyOn(chrome.storage.local, 'get');
        // (mockGet as jest.Mock<typeof chrome.storage.local.get>).mockResolvedValue({ timer: true, reviews: true, timerDuration: 24 });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should save options to chrome storage', async () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;
        const reviewsCheckbox = document.getElementById('reviews') as HTMLInputElement;
        const statusDiv = document.getElementById('status');

        timerCheckbox.checked = true;
        timerDurationInput.value = '30';
        reviewsCheckbox.checked = false;

        await saveOptions();

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            timer: true,
            timerDuration: '30',
            reviews: false
        });

        expect(statusDiv?.textContent).toBe('Options saved.');

        // Check if status message clears after 750ms
        jest.advanceTimersByTime(750);
        expect(statusDiv?.textContent).toBe('');
    });

    test('should restore options from chrome storage', async () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;
        const reviewsCheckbox = document.getElementById('reviews') as HTMLInputElement;

        await restoreOptions();

        expect(timerCheckbox.checked).toBe(true);
        expect(timerDurationInput.value).toBe('24');
        expect(timerDurationInput.disabled).toBe(false);
        expect(reviewsCheckbox.checked).toBe(true);
    });

    test('should disable timer duration input when timer is unchecked', () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;

        timerCheckbox.checked = false;
        const event = new Event('change');
        timerCheckbox.dispatchEvent(event);

        expect(timerDurationInput.disabled).toBe(true);
    });

    test('should enable timer duration input when timer is checked', () => {
        const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;

        timerCheckbox.checked = true;
        const event = new Event('change');
        timerCheckbox.dispatchEvent(event);

        expect(timerDurationInput.disabled).toBe(false);
    });

    test('should call restoreOptions on DOMContentLoaded', () => {
        // const restoreOptionsSpy = jest.spyOn(window, 'restoreOptions');
        // document.dispatchEvent(new Event('DOMContentLoaded'));
        // expect(restoreOptionsSpy).toHaveBeenCalled();
    });

    test('should call saveOptions on save button click', () => {
        // const saveOptionsSpy = jest.spyOn(window, 'saveOptions');
        // const saveButton = document.getElementById('save');
        // saveButton?.click();
        // expect(saveOptionsSpy).toHaveBeenCalled();
    });
});
export { saveOptions, restoreOptions };

