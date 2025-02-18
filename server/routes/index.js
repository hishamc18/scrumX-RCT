const express = require("express");

const authRoutes = require("./authRoutes");
const notesRoutes = require("./notesRoutes");
const projectRoutes = require("./projectRoutes");
const aiRoutes = require("./aiRoutes");
const personalTrelloRoutes = require("./personalTrello");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/", notesRoutes);
router.use("/", aiRoutes);
router.use("/projects", projectRoutes);
router.use("/", personalTrelloRoutes);

module.exports = router;
