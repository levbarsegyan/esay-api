import authController from '../app/http/controllers/authContoller.js'
import githubSigninController from '../app/http/controllers/githubSigninController.js'
const initRoutes = (app) => {
    app.get('/', (req, res) => res.send('<h1>Welcome to EasyCollab</h1>'))
    app.post('/register', authController().register)
    app.post('/login', authController().login)
    app.get('/githubAuth', githubSigninController().githubAuth)
    app.get('/login/github', githubSigninController().githubAuthRedirect)
}
export default initRoutes
