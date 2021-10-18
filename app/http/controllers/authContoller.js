import connection from '../../database/connection.js'
import Joy from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const authController = () => {
    const client = connection()
    const validateScheama = Joy.object({
        fullname:Joy.string().required(),
        email:Joy.string().email().required(),
        password:Joy.string().min(8).required(),
        confirmpassword:Joy.ref('password'),
    })
    return {
        register:async(req, res)=> {
            const {fullname,email,password,confirmpassword,} = req.body
            try {
                await validateScheama.validateAsync({fullname,email,password,confirmpassword,})
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
    }
}
export default authController
