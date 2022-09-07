import catchAsync from './../../utils/catchAsync';
const home = catchAsync(async (req, res, next) => {
    return res.send('Welcome to EasyCollab API!');
});
export { home };
