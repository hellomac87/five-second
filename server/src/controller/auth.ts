import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth';

const bcryptSaltRounds = 12;
const jwtSecretKey = 'dobbysBumblebeeproJect';
const jwtExpiresInDays = '2d';

export async function signup(req: Request, res: Response, next: NextFunction) {
    const { username, password, name, email, url } = req.body as Omit<userRepository.User, 'id'>;

    const found = await userRepository.findByUsername(username);

    // valid exist user
    if (found) {
        return res.status(409).json({ message: `${username}: already exist` });
    }

    // password 암호화
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);

    // create User
    const userId = await userRepository.createUser({
        username,
        password: hashed,
        name,
        email,
        url,
    });

    // crete token
    const token = createJwtToken(userId);

    res.status(201).json({
        token,
        username,
    });
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body as Pick<userRepository.User, 'username' | 'password'>;
    const user = await userRepository.findByUsername(username);

    // validation user
    if (!user) {
        return res.status(401).json({ message: 'Invalid user or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    // validation password
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid user or password' });
    }

    // crete token
    const token = createJwtToken(user.id);

    res.status(200).json({
        token,
        username,
    });
}

function createJwtToken(id: string) {
    return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}
