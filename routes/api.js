import authController from '../app/http/controllers/authContoller.js'
import githubSigninController from '../app/http/controllers/githubSigninController.js'
const initRoutes = (app) => {
    app.get('/', (req, res) => res.return('<h1>Welcome to EasyCollab</h1>'))
    app.post('/api/register', authController().register)
    app.post('/api/login', authController().login)
    app.get('/api/githubAuth', githubSigninController().githubAuth)
    app.get('/login/github', githubSigninController().githubAuthRedirect)
}
export default initRoutes
