import authController from '../app/http/controllers/authContoller.js'
import githubSigninController from '../app/http/controllers/githubSigninController.js'
const initRoutes = (app) => {
    app.post('/api/register', authController().register)
    app.post('/api/login', authController().login)
    app.get('/api/githubAuth', githubSigninController().githubAuth)
    app.get('/login/github', githubSigninController().githubAuthRedirect)
}
export default initRoutes
