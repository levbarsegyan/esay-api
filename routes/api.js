import authController from '../app/http/controllers/authContoller.js'
import verfyemail from '../app/http/controllers/verifyemailController.js'
const initRoutes = (app) => {
    app.post('/api/register', authController().register)
    app.post('/api/login', authController().login)
    app.get('/verifyemail/:token',verfyemail)
}
export default initRoutes
