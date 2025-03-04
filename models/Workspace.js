const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // 워크스페이스 이름
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // 워크스페이스 생성자
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 접근 가능한 유저 목록
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
