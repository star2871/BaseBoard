import express from 'express';
import admin from '../firebaseAdmin.js';

const router = express.Router();

// @desc    Register a new user with email and password
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // 간단한 유효성 검사
    if (!email || !password || !displayName) {
      return res.status(400).json({ message: '이메일, 비밀번호, 이름을 모두 입력해주세요.' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // 참고: 여기서 Firebase에 생성된 사용자의 uid(userRecord.uid)를 사용하여
    // 여러분의 MongoDB 데이터베이스에도 사용자 프로필을 생성할 수 있습니다.

    res.status(201).json({
      message: '사용자가 성공적으로 생성되었습니다.',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('신규 사용자 생성 오류:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ message: '이미 사용 중인 이메일 주소입니다.' });
    }
    res.status(500).json({ message: '서버에서 사용자 생성 중 오류가 발생했습니다.' });
  }
});

export default router;