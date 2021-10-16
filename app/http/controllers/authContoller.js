import connection from '../../database/connection.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const authController = () => {
    return {
        register(req, res) {
            const {fullname,email,password,} = req.body
            bcrypt.hash(password,10).then(hasedPassword=>{
                const token = jwt.sign({fullname,email,},process.env.tockensecret,{expiresIn:'1h',})
                const client = connection()
                client.query('insert into users (fullname,email,password) values ($1,$2,$3)',[fullname,email,hasedPassword]).then(()=>{
                    return res.status(200).json({msg:'you are registred successfully..',token,})
                }).catch((e)=>{
                    console.log(e)
                    return res.status(403).json({mag:'something went wrong!!!',})
                })
            })
        },
        login(req,res) {
            const {email,password,} = req.body
            const client = connection()
            client.query('select * from users where email=$1',[email]).then(data=>{
                if(data.rowCount>0){
                    console.log(data)
                    const incriptPass = data.rows[0].password
                    bcrypt.compare(password,incriptPass).then(comp=>{
                        if(comp){
                            return res.json({msg:'logged in successfully!!!',})
                        }
                        else{
                            return res.json({err:'wrong email or password',})
                        }
                    })
                }
                else{
                    return res.json({msg:'you are not registerd..please register first',})
                }
            })
        },
    }
}
export default authController
