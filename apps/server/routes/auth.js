import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// JWT 생성 헬퍼
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }

    const user = await User.create({
      displayName,
      email,
      password,
    });

    if (user) {
      // 회원가입 성공 시 바로 토큰을 반환하지 않고, 로그인 페이지로 유도합니다.
      res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
    } else {
      res.status(400).json({ message: '유효하지 않은 사용자 정보입니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

export default router;