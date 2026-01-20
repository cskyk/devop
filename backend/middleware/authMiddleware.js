const jwt = require("jsonwebtoken")
// module.exports = (req,res,next) => {
//     const authHeader = req.header['authorization']
//     const token = authHeader && authHeader.split("")[1]
//     console.log("Auth Middleware - Token:",token)
//     if (!token){
//         return res.status(401).json({ message: "No token provided"})
//     }

//     jwt.verify(token, process.env.JWT_SECRET || 'testing123', (err,user) => {
//         if(err){
//             return res.status(403).json({ message:"Invalid token"})
//         }
//         console.log("Auth Middleware - Decoded User:", user)
//         req.user = user;
//         next();
//     })
// }

module.exports = (...roles) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS'){
        return res.sendStatus(204);
    } 
    
    const authHeader = req.headers?.authorization || '';
    console.log('Auth Middleware - Auth Header:', authHeader);
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    console.log('Auth Middleware - Token:', token);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'testing123', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      console.log('Auth Middleware - Decoded User:', user);
      req.user = user;
      console.log('Auth Middleware - Required Roles:', roles);
      console.log('Auth Middleware - User Role:', user.role);
      console.log('Auth Middleware - Role Check Result:', roles.length && !roles.includes(user.role));
      console.log('Auth Middleware - Access Granted:', !(roles.length && !roles.includes(user.role)));
      

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }
      next();
    });
  };
};