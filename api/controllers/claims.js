const mongoose = require("mongoose");
const Claim = mongoose.model("claims");
const Group = mongoose.model("groups");

/**
 * @summary: Gets all claims associated with a user's group
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function getAllClaims(req, res, next) {
    let { groupID } = req.user;
    try {
        let claims = await Claim.find({ groupID });
        res.status(200).send(claims);
    } catch (e) {
        res.status(500).send({ error: "internal error" });
    }
}

/**
 * @summary: Creates a new claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function createNewClaim(req, res, next) {
    let { summary, documents, period, claimantAddress } = req.body;

    let group = await Group.findOne().elemMatch("subgroups", {
        "members.id": req.user.id,
    });
    if (!group) {
        return res.status(400).send({ error: "No group found" });
    }

    let group_name = group.groupName;
    let subgroup_name = "";
    for (let index = 0; index < group.subgroups.length; index++) {
        const element = group.subgroups[index];
        for (
            let innerindex = 0;
            innerindex < element.members.length;
            innerindex++
        ) {
            const member = element.members[innerindex];
            if (member.id == req.user.id) {
                subgroup_name = element.name;
            }
        }

        if (subgroup_name != "") {
            break;
        }
    }

    if (subgroup_name == "") {
        return res
            .status(400)
            .send({ error: "You have not join any subgroup" });
    }

    if (summary.length < 0) {
        return res.status(400).send({ error: "summary too short" });
    }

    if (documents.length < 1) {
        return res.status(400).send({ error: "document(s) required" });
    }

    let claim = new Claim({
        groupID: req.user.groupID,
        claimantID: req.user.id,
        claimantName: req.user.name,
        status: "pending",
        subgroupName: subgroup_name,
        groupName: group_name,
        summary,
        documents,
        period,
        claimantAddress,
    });
    await claim.save();

    res.status(200).send(claim);
}

/**
 * @summary: Retrieves the claim doc via the request's params
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function getClaimByID(req, res, next) {
    let { claimID } = req.params;
    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim;
    try {
        claim = await Claim.findById(claimID);
    } catch (e) {}

    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

    if (claim.groupID.toString() != req.user.groupID) {
        return res.status(403).send({ error: "this is not your groups claim" });
    }

    res.status(200).send(claim);
}

/**
 * @summary: Updates a claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function updateClaimByID(req, res, next) {
    let { claimID } = req.params;

    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim;
    try {
        claim = await Claim.findById(claimID);
    } catch (e) {}

    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

    if (req.user._id.toString() != claim.claimantID) {
        return res.status(403).send({ error: "you do not have permission" });
    }

    if (claim.status != "pending") {
        return res.status(403).send({ error: "this claim is not pending" });
    }

    let { summary, documents, amount } = req.body;

    if (summary) {
        if (summary.length < 10) {
            return res.status(400).send({ error: "summary too short" });
        }

        claim.summary = summary;
    }

    if (documents) {
        if (documents.length < 1) {
            return res.status(400).send({ error: "too few documents" });
        }

        claim.documents = documents;
    }

    if (amount !== undefined) {
        if (amount <= 0) {
            return res.status(400).send({ error: "amount too low" });
        }

        claim.amount = amount;
    }

    try {
        await claim.save();
    } catch (e) {
        res.status(500).send({ error: "internal error" });
    }

    res.status(200).send({ status: "ok" });
}

/**
 * @summary: Approves a claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function approveClaimByID(req, res, next) {
    let { claimID } = req.params;
    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim;
    try {
        claim = await Claim.findById(claimID);
    } catch (e) {}

    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

    if (
        claim.groupID != req.user.groupID.toString() ||
        req.user.role != "secretary"
    ) {
        return res.status(403).send({ error: "you do not have permission" });
    }

    claim.status = "approved";
    await claim.save();
    res.status(200).send({ status: "ok" });
}

/**
 * @summary: Denies a claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function denyClaimByID(req, res, next) {
    let { claimID } = req.params;
    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim;
    try {
        claim = await Claim.findById(claimID);
    } catch (e) {}

    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

    if (
        claim.groupID != req.user.groupID.toString() ||
        req.user.role != "secretary"
    ) {
        return res.status(403).send({ error: "you do not have permission" });
    }

    claim.status = "denied";
    await claim.save();
    res.status(200).send({ status: "ok" });
}

module.exports = {
    getAllClaims,
    createNewClaim,
    getClaimByID,
    updateClaimByID,
    approveClaimByID,
    denyClaimByID,
};
