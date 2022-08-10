import jwt from 'jsonwebtoken';
const FOURTEEN_DAYS_IN_MILLISECONDS = 24 * 60 * 60 * 14 * 1000;
const assignToken = (email) => {
    return jwt.sign({ email, }, process.env.tokensecret, {
        expiresIn: '1H',
    });
};
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
};
const sendToken = (email, remember, message, res) =>{
    const token = assignToken(email);
    if(remember){
        cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
    } else{
        cookieOptions.maxAge = 0;
    }
    res.cookie('token', token, cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({
        success: true,
        message,
        token,
    });
};
export default sendToken;
