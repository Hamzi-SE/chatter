// Creating Token And Saving In Cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
}

module.exports = sendToken;