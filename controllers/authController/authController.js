import urls from '../../config/urls';
const FOURTEEN_DAYS_IN_MILLISECONDS = 24 * 60 * 60 * 14 * 1000; 
export default class AuthController{
    constructor({ AuthService, OAuthService, env, }){
        this.authService = AuthService;
        this.oauthService = OAuthService;
        this.cookieOptions = {
            httpOnly: true,
            secure: env.NODE_ENV === 'production' ? true : false,
        };
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.googleAuth = this.googleAuth.bind(this);
        this.githubAuth = this.githubAuth.bind(this);
    }
    async register(req, res, next) {
        const isRemember = req.body.remember;
        const token = await this.authService.Signup(req.body);
        if(isRemember){
            this.cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
        } else{
            this.cookieOptions.maxAge = 0;
        }
        res.cookie('token', token, this.cookieOptions);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const message = 'Registered successfuly!';
        return res.status(200).json({
            success: true,
            message,
            token,
        });
    }
    async login (req, res, next) {
        try {
            const isRemember = req.body.remember;
            const token = await this.authService.Signin(req.body);
            if(isRemember){
                this.cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
            } else{
                this.cookieOptions.maxAge = 0;
            }
            res.cookie('token', token, this.cookieOptions);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            const message = 'Logged in successfuly!';
            return res.status(200).json({
                success: true,
                message,
                token,
            });
        } catch (error) {
            next(error);
        }
    }
    githubAuthRedirect (req, res) {
        return res.redirect(urls.githubAuth.GithubAuthScreenUrl);
    }
    async githubAuth (req, res, next) {
        try {
            const { code, } = req.body;
            const isRemember = true;
            const userData = await this.oauthService.GitHubAuth(code);
            const token = await this.authService.Signup(userData);
            if(isRemember){
                this.cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
            } else{
                this.cookieOptions.maxAge = 0;
            }
            res.cookie('token', token, this.cookieOptions);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            const message = 'Logged in successfuly!';
            return res.status(200).json({
                success: true,
                message,
                token,
            });
        } catch (error) {
            next(error);
        }
    }
    googleRedirect (req, res) {
        return res.redirect(urls.googleAuth.googleAuthScreenUrl);
    }
    async googleAuth (req, res, next) {
        try {
            const code = req.query.code;
            const isRemember = true;
            const userData = await this.oauthService.GoogleAuth(code);
            const token = await this.authService.Signup(userData);
            if(isRemember){
                this.cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
            } else{
                this.cookieOptions.maxAge = 0;
            }
            res.cookie('token', token, this.cookieOptions);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            const message = 'Logged in successfuly!';
            return res.status(200).json({
                success: true,
                message,
                token,
            });
        } catch (error) {
            next(error);
        }
    }
}
