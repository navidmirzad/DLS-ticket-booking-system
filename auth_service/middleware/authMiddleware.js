import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains id and role if your token includes them
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default protect;
