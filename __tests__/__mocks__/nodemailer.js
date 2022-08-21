const nodemailer = jest.createMockFromModule('nodemailer');
const createTransport = function createTransport(options) {
    return { 
        sendMail: (email, callback) => {
            return { accepted: [ 'testmail@gmail.com' ], };
        },
        use: (data, options) => {
        },
        verify: () => {
        },
    };
};
nodemailer.createTransport = createTransport;
module.exports = nodemailer;
describe('Verify nodemailer is mocked', function () {
    it('should mock nodemailer module', (done) => {
        const smtpTransport = nodemailer.createTransport();
        const response = smtpTransport.sendMail();
        expect(response).toHaveProperty('accepted');
        done();
    });
});
