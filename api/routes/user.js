const express = require("express");
const User = require("../models/User");
const {
    checkSetupSettings,
    saveUpdates,
    generateUpdatedToken,
    sendProfile,
    updateWallet,
    userById,
    updateUserSmartContractStatusController,
    transferController,
    transfersController,
    userByEmail,
} = require("../controllers/user");
const {
    authenticated,
    checkSignature,
} = require("../middleware/authenticated");
let router = express.Router();

/**
 * MOVE ENTIRE ROUTE TO API FOLDER
 */
router.get("/settings", authenticated, (req, res) => {
    res.status(200).send(req.user.settings);
});

router.post(
    "/user-added-to-smart-contract",
    authenticated,
    updateUserSmartContractStatusController
);

router.post("/transfer", authenticated, transferController);
router.get("/transfers", authenticated, transfersController);
router.get("/:userID", userById);
router.get("/email/:email", userByEmail);
/**
 * @summary retrieves the full information about the user and sends it back as a response
 * @param token identifier to determine which user to retrieve
 * @todo move to the API folder when appropriate
 */
router.get("/profile", checkSignature, authenticated, sendProfile);
/**
 * @summary Adds the role, groupID/accessCode, walletProvider and ethAddress to the user
 * and sends back a new auth token that says their account is complete.
 */
router.patch(
    "/complete",
    checkSetupSettings,
    authenticated,
    saveUpdates,
    generateUpdatedToken,
    async (req, res) => {
        const token = req.token;
        res.cookie("x-auth", token, {
            maxAge: 9000000000,
            httpOnly: false,
            secure: false,
        });

        if (req.user) {
            const { email, name, status, accountCompleted } = req.user;
            return res.send({ token, email, name, status, accountCompleted });
        } else {
            return res.send();
        }
    }
);

/**
 * @todo Add :id to route
 */
router.delete("/delete", authenticated, async (req, res) => {
    const user = req.user;
    try {
        await User.findByIdAndDelete(user._id);
        res.cookie("x-auth", "", { maxAge: Date.now() });
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 *
 */
router.patch(
    "/wallet",
    authenticated,
    updateWallet,
    generateUpdatedToken,
    (req, res) => {
        const token = req.token;
        res.cookie("x-auth", token, {
            maxAge: 9000000000,
            secure: false,
            httpOnly: false,
        });
        res.status(200).send(req.user);
    }
);

router.patch("/profile", (req, res) => {
    res.status(400).send({ error: "Route incomplete" });
});

router.put("/settings", authenticated, async (req, res) => {
    try {
        req.user.settings = req.body;
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
