import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';
import expect from 'expect';

describe('Snapshot Test for index.html', () => {
    let document;

    beforeAll(() => {
        // Load the HTML file
        const html = fs.readFileSync(path.resolve(__dirname, '../popup.html'), 'utf-8');
        const dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
   
    });

    test('HTML structure matches the snapshot', () => {
        // Take a snapshot of the body content
        expect(document.body.innerHTML).toMatchSnapshot();
    });
});
