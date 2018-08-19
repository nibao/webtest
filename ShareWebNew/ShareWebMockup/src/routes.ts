import { createServer } from 'service-mocker/server';

export const {router: ShareMgnt} = createServer('/api/ShareMgnt');
export const {router: EVFS} = createServer('/api/EVFS');
export const {router: EACHTTP} = createServer('http://127.0.0.1:9998/v1/');