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
