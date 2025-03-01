import { TextEncoder, TextDecoder } from 'util';

// Object.assign(global, { TextDecoder, TextEncoder , ...require('jest-chrome')});
Object.assign(global, { TextDecoder, TextEncoder });
// Object.assign(global, require('jest-chrome'))
