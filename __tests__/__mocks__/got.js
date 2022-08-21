const got = jest.createMockFromModule('got');
const post = async function (url, options){
    return {
        body: '{ "access_token":"xxxxxx" }',
    };
};
const get = async function (url, options){
    if(url == 'https:
        return {
            body: '[{ "email":"xxxxxx" }]',
        };
    }
    if(url == 'https:
        return {
            body: '{ "sub": 123456, "email":"xxxxxx", "name":"xxxxxx" }',
        };
    }
    return {
        body: '{ "id":"xxxxxx", "name":"xxxxxx" }',
    };
};
got.post = post;
got.get = get;
module.exports = got;
describe('Verify got is mocked', function () {
    it('should mock got module', async (done) => {
        const postRes = await got.post('testurl');
        const getRes = await got.get('testurl');
        expect(postRes).toHaveProperty('body');
        expect(getRes).toHaveProperty('body');
        done();
    });
});
