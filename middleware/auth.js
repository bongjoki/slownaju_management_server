const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization"); // 요청 헤더에서 토큰 가져오기
    console.log("📌 받은 토큰:", token); // 디버깅 로그 추가

    if (!token) {
        console.log("❌ 토큰이 없습니다.");
        return res.status(401).json({ message: "토큰이 없습니다." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Bearer 제거 후 검증
        console.log("✅ 디코딩된 토큰:", decoded); // 디버깅 로그 추가
        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ JWT 검증 실패:", error.message);
        res.status(401).json({ message: "유효하지 않은 토큰" });
    }
};
