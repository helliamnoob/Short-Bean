const express = require('express');
const session = require('express-session');
const memory_session = require('memorystore')(session);
const Op = require('sequelize');
const router = express.Router();
const { Admins } = require('../models');
const env = process.env;
require('dotenv').config();

// const options = {
//   host: env.MYSQL_HOST,
//   port: env.MYSQL_PORT,
//   user: env.MYSQL_USERNAME,
//   password: env.MYSQL_PASSWORD,
//   database: env.MYSQL_DATABASE,
// };
// router.use(
//   session({
//     secret: env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: true,
//     store: new memory_session(options),
//   })
// );

router.post('/admin/session/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admins_find = await Admins.findOne({ where: { email } });
    console.log(admins_find.password, password);
    if (password != admins_find.password) {
      return res.status(400).json({ message: '일치하는 관리자가 없습니다.' });
    }
    if (!admins_find) {
      return res.status(400).json({ message: '일치하는 관리자가 없습니다.' });
    }
    req.session.admin = admins_find;
    console.log('이거로 로그인함: ', req.session.admin);
    req.session.isLoggedIn = true;
    return res.status(200).json({ message: '관리자 로그인' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
});
//만료시간, 지금은 한번에 한명만 로그인되어지고 다음사람이 로그인하면 이전 로그인자가 쓸 수 없음
//특별한 활동이 없으면 세션날리기, 10분이내로 활동이있으면 세션 시간을 초기화

router.get('/admin/session/', async (req, res) => {
  const login_admin = req.session.admin;
  try {
    if (!login_admin) {
      console.log(login_admin);
      return res.status(400).json({ message: '일치하는 관리자가 없습니다.' });
    }
    return res.status(200).json({ message: login_admin });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
    return;
  }
});

router.get('/admin/session/logout', async (req, res) => {
  const login_admin = req.session.admin;
  try {
    if (!login_admin) {
      res.status(400).json({ message: `로그인 된 관리자가 없습니다.` });
      return;
    }
    req.session.destroy(() => {
      req.session;
    });

    return res.status(200).json({ message: `${login_admin.admin_name}로그아웃.` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'server error.' });
    return;
  }
});

module.exports = router;
