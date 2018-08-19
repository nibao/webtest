import fakeServerFactory from '../../libs/fake-server-factory';

export default fakeServerFactory(server => {
    server.respondWith('POST', /auth1\?method=getconfig/, [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
            https: true
        })
    ]);

    server.respondWith('POST', /redirect\?method=gethostinfo/, [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
            host: 'anyshare.eisoo.com',
            port: 80,
            https_port: 443,
        })
    ]);
})
