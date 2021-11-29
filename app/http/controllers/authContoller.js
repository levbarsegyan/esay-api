import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import registerValidator from '../validators/registerValidator.js'
import loginValidator from '../validators/loginValidator.js'
const authController = () => {  
    return {
        async register(req, res){
            const db = req.app.get('db')
            const { fullname, email, password, confirmpassword, } = req.body
            try {
                await registerValidator.validateAsync({ fullname, email, password, confirmpassword, })
                const user = await db.query('SELECT * FROM users WHERE email=$1', [ email ])
                if (user.rowCount > 0){
                    return res.status(200).json({ msg: 'user already exist', })
                } else {
                    const hasedPassword = await bcrypt.hash(password, 10)
                    const token = jwt.sign({ email, }, process.env.tockensecret, { expiresIn: '1H', })
                    try {
                        await db.query('INSERT INTO users (fullname,email,password) VALUES ($1,$2,$3)', [ fullname, email, hasedPassword ])
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
            const db = req.app.get('db')
            const { email, password, } = req.body
            try {
                await loginValidator.validateAsync({ email, password, })
                try {
                    const data = await db.query('SELECT * FROM users WHERE email=$1', [ email ])
                    if(data.rowCount > 0){
                        const incriptPass = data.rows[ 0 ].password
                        const comp = bcrypt.compare(password, incriptPass)
                        if(comp){
                            const token = jwt.sign({ email, }, process.env.tockensecret, { expiresIn: '1h', })
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
