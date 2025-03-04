const express = require("express");
const authMiddleware = require("../middleware/auth");
const Workspace = require("../models/Workspace");
const User = require("../models/User");

const router = express.Router();

// 📌 1. 워크스페이스 생성
router.post("/create", authMiddleware, async (req, res) => {
    const { name } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user)
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });

        const newWorkspace = new Workspace({
            name,
            owner: user._id,
            members: user.isMaster ? [] : [user._id], // 마스터 유저가 아니면 자신을 멤버로 추가
        });

        await newWorkspace.save();

        // 마스터가 아니라면 유저의 workspaces 배열에 추가
        if (!user.isMaster) {
            user.workspaces.push(newWorkspace._id);
            await user.save();
        }

        res.status(201).json(newWorkspace);
    } catch (error) {
        res.status(500).json({ message: "워크스페이스 생성 실패" });
    }
});
// 📌 2. 특정 유저를 워크스페이스에 추가
router.post("/:workspaceId/add-user", authMiddleware, async (req, res) => {
    const { userId } = req.body; // 추가할 유저 ID
    const { workspaceId } = req.params;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace)
            return res
                .status(404)
                .json({ message: "워크스페이스를 찾을 수 없습니다." });

        const user = await User.findById(userId);
        if (!user)
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });

        // 중복 추가 방지
        if (!workspace.members.includes(userId)) {
            workspace.members.push(userId);
            await workspace.save();
        }

        if (!user.workspaces.includes(workspaceId)) {
            user.workspaces.push(workspaceId);
            await user.save();
        }

        res.json({ message: "유저가 워크스페이스에 추가되었습니다." });
    } catch (error) {
        res.status(500).json({ message: "유저 추가 실패" });
    }
});

// 📌 3. 특정 워크스페이스 입장 가능 여부 확인
router.get("/:workspaceId/can-access", authMiddleware, async (req, res) => {
    const { workspaceId } = req.params;

    try {
        const user = await User.findById(req.user.userId);
        if (!user)
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });

        // 마스터 유저는 모든 워크스페이스에 입장 가능
        if (user.isMaster) {
            return res.json({ canAccess: true });
        }

        // 일반 유저는 workspaces 목록에 포함된 경우만 입장 가능
        const canAccess = user.workspaces.includes(workspaceId);
        res.json({ canAccess });
    } catch (error) {
        res.status(500).json({ message: "워크스페이스 접근 확인 실패" });
    }
});

router.get("/my-workspaces", authMiddleware, async (req, res) => {
    try {
        const workspaces = await Workspace.find({ owner: req.user.userId });
        res.json(workspaces);
    } catch (error) {
        res.status(500).json({ message: "워크스페이스 조회 실패" });
    }
});
module.exports = router; // ✅ 반드시 추가해야 함!
