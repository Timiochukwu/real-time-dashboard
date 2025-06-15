import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Authenticate token middleware triggered.');
    console.log('Authorization header:', authHeader);
    console.log('Extracted token:', token);
    if (!token) {
        console.log('No token provided.');
        return res.status(401).json({ message: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Token decoded successfully:', decoded);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
export const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        socket.userId = decoded.userId;
        socket.userEmail = decoded.email;
        next();
    }
    catch (error) {
        next(new Error('Authentication error'));
    }
};
