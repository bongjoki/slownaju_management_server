const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isMaster: { type: Boolean, default: false }, // 마스터 유저 여부
        workspaces: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
        ], // 접근 가능한 워크스페이스 목록
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
