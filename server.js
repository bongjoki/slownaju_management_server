require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth"); // ✅ 올바르게 불러왔는지 확인
const workspaceRoutes = require("./routes/workspace"); // ✅ 올바르게 불러왔는지 확인

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB 연결 성공"))
    .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes); // ✅ 올바르게 설정했는지 확인

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
