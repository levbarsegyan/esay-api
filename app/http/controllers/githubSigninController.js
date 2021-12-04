import got from 'got'
import UserModel from '../../database/models/User.js'
import jwt from 'jsonwebtoken'
const githubSigninController = () => {
    return {
        async githubAuth (req, res) {
            res.redirect(`https:
        },
        async githubAuthRedirect (req, res) {
            const response = await got.post(`https:
            const accessToken = JSON.parse(response.body).access_token
            let getuser = await got.get('https:
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            })
            getuser = JSON.parse(getuser.body)
            let getuserEmail =  await got.get('https:
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            })
            getuserEmail = JSON.parse(getuserEmail.body)
            const username = getuser.name
            const userid = getuser.id
            const email = getuserEmail[ 1 ].email
            try {
                const isUserExist = await UserModel.findAll({ where: { userid: userid.toString(), }, })
                if (isUserExist.length == 0) {
                    await UserModel.create({
                        fullname: username,
                        email,
                        userid,
                        provider: 'github auth',
                    })
                }
                const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1H', })
                return res.status(200).json({ msg: 'sign in successfully', token: token, })
            } catch (error) {
                console.log(error)
                return res.status(500).json({ msg: 'something went wrong', })
            }
        },
    }
}
export default githubSigninController
