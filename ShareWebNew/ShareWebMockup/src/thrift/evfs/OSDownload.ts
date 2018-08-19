export default (req, res) => {
    res.send({
        rev: '5CD550027D414FD3B3E6E198CD727580',
        name: 'name1',
        editor: 'editor1',
        modified: 1509561981155168,
        size: 572776,
        client_mtime: 1509561981155168,
        auth_request: {
            method: 'GET',
            url: 'http://192.168.138.45:9028/anyshares3accesstestbucket/09073D6B719F40CAA282594EDF9E68F6/BB113200773F41F485B3F24647B0E06F-i?response-content-disposition=attachment%3b%20filename%3d%22%25e7%2595%2599%25e5%25ba%2595%25e5%25ae%25a1%25e8%25ae%25a11201711020246%22%3b%20filename*%3dutf%2d8''%25e7%2595%2599%25e5%25ba%2595%25e5%25ae%25a1%25e8%25ae%25a11201711020246&x-eoss-length=572776&userid=AKIAI6IFWLK557WYM23A&Expires=1500535406&Signature=1SmkZR93rKMl6JNh0qGnFiuoIUk%3d&x-as-userid=da5bfdc4-cb4b-4b28-90c2-9eca46c3e500'
        }
    });
}