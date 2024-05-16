const { Router } = require("express");
const router = Router();
const z = require("zod");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const authMiddleware = require("./middleware");

const UserSchema = z.object({
    username: z.string()
        .min(1, { message: "Username can not be empty" })
        .email({ message: "Invalid email address" })
        .trim().toLowerCase(),

    name: z.object({
        first: z.string()
            .min(1, { message: "First name can not be empty" })
            .max(50, {message: "First name must be 50 or fewer characters long"})
            .trim(),
        last: z.string()
            .min(1, { message: "Last name can not be empty" })
            .max(50, {message: "Last name must be 50 or fewer characters long"})
            .trim()  
    }),

    password: z.string()
        .min(6, { message: "Password must be 6 or more characters long" })
        .trim()
})

router.post("/signup", async (req, res)=>{
    const request = req.body;

    const requestValidation = UserSchema.safeParse(request);
    if (!requestValidation.success){
        return res.status(404).json({ message: "Invalid inputs.", zodError: requestValidation.error})
    }

    const userAlreadyExists = await User.findOne({ username: request.username });
    if (userAlreadyExists){
        return res.status(411).json({ message: "User already exists / Email already taken." });
    }

    const createdUser = new User(request);

    const hashedPassword = await createdUser.createHash(request.password);
    createdUser.password = hashedPassword;

    try {
        await createdUser.save();
        await Account.create({
            userId: createdUser._id,
            balance: Math.floor(Math.random()*1000)+1   
        })
        const token = jwt.sign({ userId: createdUser._id }, JWT_SECRET);
        res.status(200).json({ token, message: 'User successfully created' });
    } catch (error) {
        res.status(500).json({ message: "Error creating user.", error: error.message });
    }
})

const loginSchema = z.object({
    username: z.string()
        .min(1, { message: "Username can not be empty" })
        .email({ message: "Invalid email address" })
        .trim().toLowerCase(),
    password: z.string()
        .min(6, { message: "Password must be 6 or more characters long" })
        .trim()
})

router.post("/login", async (req, res)=>{
    const request = req.body;
    const requestValidation = loginSchema.safeParse(request);
    if (!requestValidation.success){
        return res.status(404).json({ message: "Invalid inputs.", zodError: requestValidation.error })
    }

    const user = await User.findOne({username: request.username});
    if (!user){
        return res.status(400).json({ message: "User not found. / Wrong Username." });
    }

    const userId = user._id;
    const validatedPassword = await user.validatePassword(request.password);
    if (validatedPassword){
        const token = jwt.sign({ userId }, JWT_SECRET);
        return res.status(200).json({ token, message: "Login Successfull !!!" });
    } else {
        return res.status(500).json({ message: "Wrong password" })
    }
})

const updateSchema = z.object({
    username: z.string()
        .min(1, { message: "Username can not be empty" })
        .email({ message: "Invalid email address" })
        .trim().toLowerCase().optional(),

    name: z.object({
        first: z.string()
            .max(50, {message: "First name must be 50 or fewer characters long"})
            .trim().optional(),
        last: z.string()
            .max(50, {message: "Last name must be 50 or fewer characters long"})
            .trim().optional(),  
    }).optional(),
})

router.put("/", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const request = req.body;
    const requestValidation = updateSchema.safeParse(request);
    if (!requestValidation.success){
        return res.status(400).json({ message: "Invalid inputs recieved.", zodError: requestValidation.error });
    }
    const updateSuccessful = await User.updateOne({ _id: userId }, { request });
    if (updateSuccessful){
        return res.status(200).json({ message: "Update successfull" });
    }
})

const filterSchema = z.string()
    .max(50, { message: "Filter must be 50 or fewer characters long" })
    .trim();

router.get("/bulk", authMiddleware, async(req, res)=>{
    const filter = req.query.filter || "";
    const requestValidation = filterSchema.safeParse(filter);
    if (!requestValidation.success){
        return res.status(400).json({ message: "Invalid inputs recieved.", zodEerror: requestValidation.error });
    }
    const users = await User.find({
        "$or": [
            { "name.first": { "$regex": filter, "$options": "i" } },
            { "name.last": { "$regex": filter, "$options": "i" } },
        ]
    });
    if (users){
        return res.status(200).json({ users: users.map(user=>(
            {
                username: user.username,
                name: {
                    first: user.name.first,
                    last: user.name.last,
                },
                _id: user._id
            }
        )) })
    } else {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get("/details", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    return res.json({user});
})



module.exports = router;