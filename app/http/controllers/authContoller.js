import connection from '../../database/connection.js'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const authController = () => {
    const client = connection()
    const RegistervalidateScheama = Joi.object({
        fullname:Joi.string().required().error(()=>{return Error('fullname is required!!!')}),
        email:Joi.string().email().required().error(()=>{return Error('email is required!!!')}),
        password:Joi.string().min(8).required().error(()=>{return Error('password should be minimum 8 char long!!!')}),
        confirmpassword:Joi.ref('password'),
    })
    const LoginvalidateScheama = Joi.object({
        email:Joi.string().email().required().error(()=>{return Error('email is required!!!')}),
        password:Joi.string().required().error(()=>{return Error('password is required!!!')}),
    })
    return {
        register:async(req, res)=> {
            const {fullname,email,password,confirmpassword,} = req.body
            try {
                await RegistervalidateScheama.validateAsync({fullname,email,password,confirmpassword,})
                const user=await client.query('select * from users where email=$1',[email])
                if(user.rowCount>0){
                    return res.status(200).json({msg:'user already exist',})
                }else{
                    const hasedPassword =await bcrypt.hash(password,10)
                    const token = jwt.sign({email,},process.env.tockensecret,{expiresIn:'1H',})
                    try {
                        await client.query('insert into users (fullname,email,password) values ($1,$2,$3)',[fullname,email,hasedPassword])
                        return res.status(200).json({msg:'you are registred successfully..',token,})
                    } catch (error) {
                        return res.status(403).json({mag:'something went wrong!!!',})
                    }
                }
            } catch (error) {
                return res.status(400).json({error:error.message,})
            }
        },
        login:async(req,res)=>{
            const {email,password,} = req.body
            try {
                await LoginvalidateScheama.validateAsync({email,password,})
                try {
                    const data =  await client.query('select * from users where email=$1',[email])
                    if(data.rowCount>0){
                        const incriptPass = data.rows[0].password
                        bcrypt.compare(password,incriptPass).then(comp=>{
                            if(comp){
                                const token = jwt.sign({email,},process.env.tockensecret,{expiresIn:'1h',})
                                return res.json({msg:'logged in successfully!!!',token,})
                            }
                            else{
                                return res.json({err:'wrong email or password',})
                            }
                        })
                    }
                    else{
                        return res.json({msg:'you are not registerd..please register first',})
                    }
                } catch (error) {
                    return res.status(500).json({msg:'iternal server err',})
                }
            } catch (error) {
                return res.status(400).json({error:error.message,})
            }
        },
    }
}
export default authController
