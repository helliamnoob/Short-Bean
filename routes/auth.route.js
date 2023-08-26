const express = require('express');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const middleware = require('../middlewares/auth_middleware');
const router = express.Router();
const { Op } = require('sequelize');
const cache = require('node-cache');
const cache_middleware = require('../middlewares/cache_middleware');
require('dotenv').config();

// 회원가입
router.post('/signup', async (req, res) => {
  const { nickname, email, password, user_name, phone_number, birth_date } = req.body;

  try {
    const isExitstUser = await Users.findOne({ where: { email } });
    //이미 db에 이메일이 있다면
    if (isExitstUser) {
      res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }

  // 유저 & 유저정보 생성
  try {
    // 사용자 테이블에 데이터 삽입
    await Users.create({
      nickname,
      email,
      password,
      user_name,
      phone_number,
      birth_date,
    });
    // 사용자 정보 테이블에 데이터를 삽입
    res.status(201).json({ message: '회원가입이 완료되었습니다' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({
        message: 'check email or password',
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: 'check email or password',
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        message: 'check email or password',
      });
    }
    const token = jwt.sign({ userId: user.user_id }, process.env.SECRET_KEY);
    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: `로그인 성공 ${user.user_name}님 환영합니다.` });
  } catch {
    res.status(500).json({ message: 'login server error.' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  res.cookie('authorization', '');
  return res.status(200).json({ message: '로그아웃 완료' });
});

//회원 정보 수정
router.put('/userInfo', middleware, async (req, res) => {
  const { user_id } = res.locals.user;
  try {
    const { email, password, nickname, phone_number } = req.body;

    const userUpdateFind = await Users.findOne({ where: { user_id } });
    const userEmailCheck = await Users.findOne({ where: { email } });
    if (!userUpdateFind) {
      return res.status(400).json({ message: '유저가 존재하지 않습니다.' });
    } else if (userUpdateFind.user_id !== user_id) {
      return res.status(400).json({ message: '권한이 없습니다.' });
    }
    if (userEmailCheck) {
      return res.status(400).json({ message: '해당 이메일은 중복입니다.' });
    }

    await Users.update(
      { email, nickname, password, phone_number },
      {
        where: {
          [Op.and]: [{ user_id: user_id }],
        },
      }
    );
    res.status(200).json({ message: '유저 정보를 수정합니다.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error.' });
  }
});

//삭제
router.delete('/signout', middleware, async (req, res) => {
  const { user_id } = res.locals.user;
  res.locals.user_id = user_id;
  try {
    const userFind = await Users.findOne({ where: user_id });
    if (!userFind) {
      res.status(400).json({ message: '회원이 조회되지 않습니다.' });
    }
    await Users.destroy({
      where: {
        [Op.and]: [{ user_id: user_id }],
      },
    });
    res.status(200).json({ message: `${userFind.name}님 삭제가 완료되었습니다.` });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});

//나의정보 조회
router.get('/userInfo', middleware, async (req, res) => {
  const { user_id } = res.locals.user;
  try {
    const user = await Users.findOne({ where: { user_id } });
    if (!user) {
      return res.status(400).json({
        message: '해당 유저가 존재하지 않습니다.',
      });
    }
    return res.status(200).json({ user });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});

//개인정보 가져오기(node-cache사용)
router.get('/usertest', middleware, cache_middleware, async (req, res) => {
  const { user_id } = res.locals.user;
  try {
    const user = cache.get(user_id);
    return res.status(200).json({ user });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});

module.exports = router;
