import authController from '../app/http/controllers/authContoller.js'
const initRoutes = (app) => {
    app.post('/api/register', authController().register)
    app.post('/api/login', authController().login)
}
export default initRoutes
