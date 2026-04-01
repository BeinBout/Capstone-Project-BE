import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_123';

export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({
            status: 'error',
            message: 'Email already exists'
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { 
                email, 
                username, 
                password: hashedPassword,
                last_login_at: new Date()
            }
        });

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        const initialQuiz = await prisma.quiz.findFirst({
            where: {
                user_id: newUser.id,
                type: 'initial_persona'
            }
        });

        const has_completed_quiz = initialQuiz ? true : false;

        res.status(201).json({
            status: 'success',
            message: 'Register successful!', 
            data: {
                newUser,
                has_completed_quiz,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'A server error occurred',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({
            status: 'error',
            message: 'Invalid email or password'
        });

        if (!user.password) return res.status(400).json({
            status: 'error',
            message: 'Please login using Google.'
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
        });

        const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        }, 
        JWT_SECRET, 
        {
            expiresIn: '7d'
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { last_login_at: new Date() }
        });

        const initialQuiz = await prisma.quiz.findFirst({
            where: {
                user_id: user.id,
                type: 'initial_persona'
            }
        });

        const profileUser = await prisma.user.findFirst({
            where: {
                id: user.id,
                berat_badan: { not: null },
                tinggi_badan: { not: null },
                umur: { not: null },
            }
        });

        const has_completed_profile = profileUser ? true : false;
        const has_completed_quiz = initialQuiz ? true : false;

        res.status(200).json({
            status: 'success',
            message: 'Login successful!',
            data: {
                user,
                has_completed_quiz,
                has_completed_profile,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'A server error occurred',
            error: error.message
        });
    }
};

export const googleOAuth = async (req, res) => {
    try {
        const { email, nama_lengkap, avatar_url, google_id } = req.body;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const baseUsername = email.split('@')[0];
            const randomNumber  = Math.floor(Math.random() * 1000);

            user = await prisma.user.create({
                data: {
                    email,
                    nama_lengkap,
                    avatar_url,
                    google_id,
                    username: `${baseUsername}${randomNumber}`,
                    last_login_at: new Date()
                }
            });
        } else {
            user = await prisma.user.update({
                where: { email },
                data: {
                    last_login_at: new Date(),
                    avatar_url,
                    google_id
                }
            });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
        }, JWT_SECRET, {
            expiresIn: '7d'
        });

        const initialQuiz = await prisma.quiz.findFirst({
            where: {
                user_id: user.id,
                type: 'initial_persona'
            }
        });

        const userProfile = await prisma.user.findFirst({
            where: {
                id: user.id,
                berat_badan: { not: null },
                tinggi_badan: { not: null },
                umur: { not: null },
            }
        });

        const has_completed_profile = userProfile ? true : false;
        const has_completed_quiz = initialQuiz ? true : false;

        res.status(200).json({
            status: 'success',
            message: 'Successfully logged in using Google',
            data: {
                user,
                has_completed_quiz,
                has_completed_profile,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'A server error occurred',
            error: error.message
        });
    }
};

export const verifyMe = async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. Token not found.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'BeinB0ut123()!!');

        if (!decoded) {
            return res.status(403).json({
                status: 'error',
                message: 'Token is invalid or expired.'
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                email_verified_at: true,
                google_id: true,
                avatar_url: true,
                nama_lengkap: true,
                berat_badan: true,
                tinggi_badan: true,
                umur: true,
                tanggal_lahir: true,
                last_login_at: true,
                created_at: true,
                updated_at: true
            }
        });
        console.log(user);

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'A server error occurred',
            error: error.message
        });
    }
};

// Penjelasan: Dalam sistem JWT, logout sebenarnya dilakukan oleh Frontend (dengan menghapus token di LocalStorage).
// Backend hanya perlu merespon sukses.
export const logout = async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Logout successful!'
    });
};