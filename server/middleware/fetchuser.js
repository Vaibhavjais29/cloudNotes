import jwt from 'jsonwebtoken';
import env from 'dotenv'

env.config();

const fetchuser = (req, res, next) => {
    //Get the user from jwt token and id to req object
    const token = req.headers['auth-token'];
    if(!token) {
        res.status(401).send({error: 'Please authenticate using a valid token'});
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;        
        next();
    } catch (error) {
        res.status(401).send({error: 'Please authenticate using a valid token'});
    }
    
}

export default fetchuser;