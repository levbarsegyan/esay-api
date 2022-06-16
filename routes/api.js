import authController from '../app/http/controllers/authController.js';
import githubAuthController from '../app/http/controllers/githubAuthController.js';
import googleAuthController from '../app/http/controllers/googleAuthController.js';
import passwordController from '../app/http/controllers/passwordController.js';
const initRoutes = (app) => {
    app.get('/', (req, res) => res.send('<h1>Welcome to EasyCollab</h1>'));
    app.post('/register', authController().register);
    app.post('/login', authController().login);
    app.get('/oauth/redirect/github', githubAuthController().githubAuthRedirect);
    app.post('/oauth/signin/github', githubAuthController().githubAuth);
    app.get('/oauth/redirect/google', googleAuthController().googleRedirect);
    app.post('/oauth/signin/google', googleAuthController().googleauth);
    app.post('/forgot_password', passwordController().forgot_password);
    app.post('/reset_password', passwordController().reset_password);
};
export default initRoutes;
