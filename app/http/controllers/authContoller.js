import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import registerValidator from '../validators/registerValidator.js'
import loginValidator from '../validators/loginValidator.js'
import UserModel from '../../database/models/User.js' 
const authController = () => {  
    return {
        async register(req, res){
            let { fullname, email, password, confirmpassword, } = req.body
            email = email.trim()
            try {
                await registerValidator.validateAsync({ fullname, email, password, confirmpassword, })
                const user = await UserModel.findAll({ where: { email, }, })
                if (user.length > 0){
                    return res.status(200).json({ msg: 'user already exist', })
                } else {
                    const hasedPassword = await bcrypt.hash(password, 10)
                    const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1H', })
                    try {
                        await UserModel.create({
                            fullname,
                            email,
                            password: hasedPassword,
                        })
                        return res.status(200).json({ msg: 'you are registred successfully..', token, })
                    } catch (error) {
                        return res.status(500).json({ msg: `${error} - something went wrong!!!`, })
                    }
                }
            } catch (error) {
                console.log(error)
                return res.status(400).json({ error: error.message, })
            }
        },
        async login(req, res){
            const { email, password, } = req.body
            try {
                await loginValidator.validateAsync({ email, password, })
                try {
                    const user = await UserModel.findAll({ where: { email, }, })
                    if(user.length > 0){
                        const incriptPass = user[ 0 ].dataValues.password
                        const comp = bcrypt.compare(password, incriptPass)
                        if(comp){
                            const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1h', })
                            return res.json({ msg: 'logged in successfully!!!', token, })
                        }
                        else{
                            return res.json({ err: 'wrong email or password', })
                        }
                    }
                    else{
                        return res.json({ msg: 'you are not registerd..please register first', })
                    }
                } catch (error){
                    return res.status(500).json({ msg: 'iternal server err', })
                }
            } catch (error){
                return res.status(400).json({ error: error.message, })
            }
        },
    }
}
export default authController
