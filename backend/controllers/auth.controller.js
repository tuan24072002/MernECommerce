import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const accessTokenExpiresAt = Date.now() + 15 * 60 * 1000;
const refreshTokenExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: accessTokenExpiresAt,
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: refreshTokenExpiresAt,
    })
    return { accessToken, refreshToken }
}
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent XSS attacks, cross-site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent CSRF attacks, cross-site requests forgery attack
        maxAge: 15 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent XSS attacks, cross-site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent CSRF attacks, cross-site requests forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await User.create({ name, email, password });


        //Authenticate
        const { accessToken, refreshToken } = generateToken(user._id);
        user.accessTokenCode = accessToken;
        user.accessTokenExpiresAt = Date.now() + 15 * 60 * 1000;
        user.refreshTokenCode = refreshToken;
        user.refreshTokenExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        user.lastLogin = Date.now();
        const saveUser = await user.save();

        setCookies(res, accessToken, refreshToken)
        return res.status(201).json({
            user: {
                _id: saveUser._id,
                name: saveUser.name,
                email: saveUser.email,
                role: saveUser.role
            },
            message: "User created successfully"
        })
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ message: error.message })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!(await user.comparePassword(password))) {
            return res.status(404).json({ message: "Password is wrong" })
        }
        const { accessToken, refreshToken } = generateToken(user._id);
        user.accessTokenCode = accessToken;
        user.accessTokenExpiresAt = accessTokenExpiresAt;
        user.refreshTokenCode = refreshToken;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        user.lastLogin = Date.now();
        const saveUser = await user.save();
        setCookies(res, accessToken, refreshToken)
        return res.json({
            user: {
                _id: saveUser._id,
                name: saveUser.name,
                email: saveUser.email,
                role: saveUser.role
            }
        })
    } catch (error) {
        console.log("Error in login", error.message);
        res.status(500).json({ message: error.message })
    }

}
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.userId);
            user.accessTokenCode = undefined;
            user.accessTokenExpiresAt = undefined;
            user.refreshTokenCode = undefined;
            user.refreshTokenExpiresAt = undefined;
            await user.save();
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout", error.message);
        res.status(500).json({ message: error.message })
    }
}
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provider" });
        }
        const user = await User.findOne({
            refreshTokenCode: refreshToken,
            refreshTokenExpiresAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
        res.cookie("accessToken", accessToken, {
            httpOnly: true, //prevent XSS attacks, cross-site scripting attack
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //prevent CSRF attacks, cross-site requests forgery attack
            maxAge: 15 * 60 * 1000
        });
        user.accessTokenCode = accessToken;
        user.accessTokenExpiresAt = accessTokenExpiresAt;
        await user.save();
        return res.json({ message: "Token refreshed successfully" })
    } catch (error) {
        console.log("Error in refresh token", error.message);
        res.status(500).json({ message: error.message })
    }
}
export const getProfile = async (req, res) => {
    try {
        res.json({
            user: req.user
        })
    } catch (error) {
        console.log("Error in get profile", error.message);
        res.status(500).json({ message: error.message })
    }
}