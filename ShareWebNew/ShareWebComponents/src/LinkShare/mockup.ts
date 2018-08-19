import { fakeServer } from 'sinon';

const server = fakeServer.create()

server.respondWith('POST', /link\?method=open/, [
    200,
    { 'Content-Type': 'application/json' },
    ''
]);

export default server;