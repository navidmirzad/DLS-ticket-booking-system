import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  try {
    console.log('Auth middleware - headers:', req.headers);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ error: 'No Authorization header found' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid Authorization format, expected Bearer token');
      return res.status(401).json({ error: 'Invalid Authorization format, expected Bearer token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token ? 'Present' : 'Missing');

    try {
      // Verify token
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not configured');
        return res.status(500).json({ error: 'Server configuration error' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
      
      // Add user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 