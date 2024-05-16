const { Router } = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware");
const { Account } = require("../db");
const z = require("zod");
const router = Router();

router.get("/balance", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const account = await Account.findOne({userId});
    return res.json({ balance: account.balance });
})

const transferSchema = z.object({
    to: z.string(),
    amount: z.number()
})

router.post("/transfer", authMiddleware, async (req, res)=>{
    const request = req.body;
    const userId = req.userId;
    const requestValidation = transferSchema.safeParse(request);
    if (!requestValidation.success){
        return res.status(400).json({ message: "Invalid Inputs" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = request;
    const fromAccount = await Account.findOne({userId}).session(session);
    if (!fromAccount || fromAccount.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    const toAccount = await Account.findOne({userId: to}).session(session);
    if (!toAccount){
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid Account" });
    }

    await Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    res.json({
        message: "Transfer Successfull"
    }).status(200);

})
module.exports = router;