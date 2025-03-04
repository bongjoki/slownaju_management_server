const express = require("express");
const authMiddleware = require("../middleware/auth");
const Workspace = require("../models/Workspace");

const router = express.Router();

// 워크스페이스 생성
router.post("/create", authMiddleware, async (req, res) => {
    const { name } = req.body;
    const newWorkspace = new Workspace({ name, owner: req.user.userId });
    await newWorkspace.save();
    res.status(201).json(newWorkspace);
});

// 내 워크스페이스 목록 조회
router.get("/my-workspaces", authMiddleware, async (req, res) => {
    const workspaces = await Workspace.find({ owner: req.user.userId });
    res.json(workspaces);
});

module.exports = router;
