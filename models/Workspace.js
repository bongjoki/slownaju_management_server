const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
