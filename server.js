require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const workspaceRoutes = require("./routes/workspace");
app.use("/api/workspaces", workspaceRoutes);

// MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB 연결 성공"))
    .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.get("/", (req, res) => {
    res.send("🚀 백엔드 서버가 정상적으로 실행 중입니다!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
