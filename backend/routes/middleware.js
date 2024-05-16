const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config");
const z = require("zod")

const AuthSchema = z.string().regex(/^Bearer .+$/, { message: "Invalid authorization key." });

const authMiddleware = (req, res, next)=>{
    const auth = req.headers.authorization;
    if (!auth){
        return res.status(400).json({ error: "Authorization header is missing." })
    }

    const validAuth = AuthSchema.safeParse(auth);
    if (!validAuth.success){
        return res.json({ error: validAuth.error }).status(400);
    }
    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId){
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized access"}) 
        }
    } catch(error) {
        return res.json({ error: "Internal server error" }).status(500);
    }
}

module.exports = authMiddleware

