import {describe, expect, test} from '@jest/globals';
import Home from '../app/(browse)/(home)/page';

describe('home page', () => {
    test('home page returns html', () => {
        expect(Home()).toBe("<div className=\"flex flex-col gap-y-4\">\n  <h1>Home Page</h1>\n</div>");
    });
  });
