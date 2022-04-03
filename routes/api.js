import authController from '../app/http/controllers/authController.js';
import githubSigninController from '../app/http/controllers/githubSigninController.js';
import GoogleAuthController from '../app/http/controllers/GoogleAuthController.js';
const initRoutes = (app) => {
    app.get('/', (req, res) => res.send('<h1>Welcome to EasyCollab</h1>'));
    app.post('/register', authController().register);
    app.post('/login', authController().login);
    app.get(
        '/oauth/redirect/github',
        githubSigninController().githubAuthRedirect
    );
    app.post('/oauth/signin/github', githubSigninController().githubAuth);
    app.get('/oauth/redirect/google', GoogleAuthController().googleRedirect);
    app.post('/oauth/signin/google', GoogleAuthController().googleauth);
};
export default initRoutes;
