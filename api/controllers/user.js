let Group = require("../models/Group");
let User = require("../models/User");

let checkSetupSettings = async (req, res, next) => {
    const { role, accessCode, walletProvider, ethAddress } = req.body;

    if (role === "policyholder" && accessCode === "") {
        return res.status(400).send("Policyholder must provide access code");
    }

    if (role !== "policyholder" && role !== "secretary") {
        return res.status(400).send("Invalid role for user");
    }

    if (walletProvider !== "metamask" && walletProvider !== "fortmatic") {
        return res.status(400).send("Invalid Wallet Provider");
    }
    //check if the eth address is a valid address
    if (!ethAddress) {
        return res.status(400).send("Invalid Ethereum account");
    }

    next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let saveUpdates = async (req, res, next) => {
    const { role, accessCode, walletProvider, ethAddress } = req.body;
    const user = req.user;

    if (user.accountCompleted) {
        return res.status(400).send("User already completed");
    }

    if (accessCode == "__admin__") {
        role = "admin";
    } else if (role === "policyholder") {
        let group = await Group.findByAccessCode(accessCode);

        if (!group) {
            return res.status(400).send("Invalid access code");
        }

        user.groupID = group._id;
    }

    user.role = role;
    user.walletProvider = walletProvider;
    user.ethereumAddress = ethAddress;
    user.accountCompleted = true;
    user.settings = [
        { code: "premium_paid", domain: "email", value: false },
        { code: "premium_paid", domain: "sms", value: false },
        { code: "claim_created", domain: "email", value: true },
        { code: "claim_created", domain: "sms", value: false },
        { code: "claim_updated", domain: "email", value: true },
        { code: "claim_updated", domain: "sms", value: false },
        { code: "claim_approved", domain: "email", value: true },
        { code: "claim_approved", domain: "sms", value: true },
    ];
    await user.save();
    req.user = user;
    next();
};

let generateUpdatedToken = async (req, res, next) => {
    const user = req.user;
    try {
        const token = await user.generateAuthToken();
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(400).send(e);
    }
};

const updateWallet = async (req, res, next) => {
    try {
        const user = req.user;
        const { provider, ethAddress } = req.body;
        user.walletProvider = provider;
        user.ethereumAddress = ethAddress;
        const newUser = await user.save();
        req.user = newUser;
        next();
    } catch (e) {
        res.status(500).send(e);
    }
};

async function userById(req, res) {
    try {
        const result = await User.findOne({ _id: req.params.userID })
            .select("-settings")
            .select("-password")
            .select("-tokens");

        console.log(result, "loging user");

        return res.send({ OtherUser: result });
    } catch (e) {
        res.status(500).send(e);
    }
}

const sendProfile = (req, res) => {
    const token = req.token;
    const user = req.user;
    const {
        email,
        name,
        status,
        accountCompleted,
        role,
        walletProvider,
        picture,
        phone,
        ethereumAddress,
        settings,
    } = user;
    return res.send({
        token,
        email,
        name,
        status,
        accountCompleted,
        role,
        walletProvider,
        picture,
        phone,
        ethereumAddress,
        settings,
    });
};
module.exports = {
    checkSetupSettings,
    saveUpdates,
    generateUpdatedToken,
    updateWallet,
    sendProfile,
    userById,
};
