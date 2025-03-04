const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "토큰이 없습니다." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "유효하지 않은 토큰" });
    }
};
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user)
            return res
                .status(400)
                .json({ message: "이미 가입된 이메일입니다." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "회원가입 성공!" });
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
});

// 로그인
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
