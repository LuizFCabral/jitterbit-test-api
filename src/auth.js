import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const USER = [{id: 1, username: "admin", password: "password"}]; // Usado para testes

function login(req, res) {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Usuário e Senha para Login',
            schema: {
                "username": "admin",
                "password": "password"
            }
    } */

    const {username, password} = req.body;
    const user = USER.find(u => u.username === username && u.password === password ) //Em um ambiente real usaria uma consulta no banco

    if (!user) {
        return res.status(401).json({message: "Invalid User or Password!"})
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_KEY, {expiresIn: '1h'})
    res.json({ token })

}

function authtoken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        console.log(token);
        return res.status(401).json({ message: 'Unauthorized! '})
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            return res.status(401)
        }
        req.user = user
        next()
    })
}

export default {
    login,
    authtoken
}