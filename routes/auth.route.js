const express = require('express');
const { Users } = require('../models');
const { Admins } = require('../models');
const { TutorInfos } = require('../models');
const jwt = require('jsonwebtoken');
const middleware = require('../middlewares/auth_middleware');
const router = express.Router();
const { Op } = require('sequelize');
const node_cache = require('node-cache');
const my_cache = new node_cache({ stdTTL: 500, checkperiod: 600 });
const axios = require('axios');
const crypto = require('crypto-js');
require('dotenv').config();
const env = process.env;
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
    await Users.create({ nickname, email, password, user_name, phone_number, birth_date });
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
    const token = await jwt.sign({ user_id: user.user_id }, process.env.SECRET_KEY);
    res.cookie('authorization', `Bearer ${token}`);
    console.log(token);
    // my_cache.set(user.user_id, user, 10000);
    return res.status(200).json({ message: `로그인 성공 ${user.user_name}님 환영합니다.` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'login server error.' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  res.clearCookie('authorization');
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
      { email, password, nickname, phone_number },
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
  try {
    const user_find = await Users.findOne({ where: user_id });
    if (!user_find) {
      res.status(400).json({ message: '회원이 조회되지 않습니다.' });
    }
    await Users.destroy({
      where: {
        [Op.and]: [{ user_id: user_id }],
      },
    });
    res.status(200).json({ message: `${user_find.user_name}님 삭제가 완료되었습니다.` });
  } catch (e) {
    console.log(e);
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
router.get('/usertest', middleware, async (req, res) => {
  const { user_id } = res.locals.user;
  try {
    const user = my_cache.get(user_id);
    return res.status(200).json({ user });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});

// 문자 발송
router.post('/smsauth', async (req, res) => {
  const { name, phone } = req.body;
  try {
    send_message(name, phone);
    return res.status(200).json({ message: 'sucess' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'server error.' });
  }
});
// 문자 확인
router.post('/smscheck', async (req, res) => {
  const { phone } = req.body;
  try {
    const data = my_cache.get(phone);
    return res.status(200).json({ data: data });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'server error.' });
  }
});

function send_message(name, phone) {
  var space = ' '; // one space
  var newLine = '\n'; // new line
  const method = 'POST';
  const service_id = process.env.SENS_SERVICE_ID;
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${service_id}/messages`;
  const url2 = `/sms/v2/services/${service_id}/messages`;
  var timestamp = Date.now(); // current timestamp (epoch)
  const access_key = process.env.SENS_ACCESS_KEY;
  const secret_key = process.env.SENS_SECRET_KEY;

  const signature = makeSignature();
  const randomnum = Math.random() * 1000000;
  const verfiy_code = Math.round(randomnum);
  my_cache.set(phone, verfiy_code);
  axios({
    method: method,
    // request는 uri였지만 axios는 url이다
    url: url,
    headers: {
      'Contenc-type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': access_key,
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-apigw-signature-v2': signature,
    },
    // request는 body였지만 axios는 data다
    data: {
      type: 'SMS',
      countryCode: '82',
      //sens api 에 저장된 번호로 부터 발송됩니다.
      from: '01051257345',
      // 원하는 메세지 내용
      content: `${name}님 ${verfiy_code} `,
      messages: [
        // 신청자의 전화번호
        { to: `${phone}` },
      ],
    },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  return;
}

function makeSignature() {
  var space = ' '; // one space
  var newLine = '\n'; // new line
  const method = 'POST';
  const service_id = process.env.SENS_SERVICE_ID;
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${service_id}/messages`;
  const url2 = `/sms/v2/services/${service_id}/messages`;
  var timestamp = Date.now(); // current timestamp (epoch)
  const access_key = process.env.SENS_ACCESS_KEY;
  const secret_key = process.env.SENS_SECRET_KEY;

  var hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secret_key);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(timestamp.toString());
  hmac.update(newLine);
  hmac.update(access_key);

  var hash = hmac.finalize();

  return hash.toString(crypto.enc.Base64);
}
// admin 회원가입
router.post('/admin', async (req, res) => {
  const { admin_name, password, email } = req.body;

  try {
    const isExitstEmail = await Admins.findOne({ where: { email } });
    //이미 db에 이메일이 있다면
    if (isExitstEmail) {
      res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }

  try {
    // 사용자 테이블에 데이터 삽입
    await Admins.create({ admin_name, password, email });
    // 사용자 정보 테이블에 데이터를 삽입
    res.status(201).json({ message: '회원가입이 완료되었습니다' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});
//admin 열람
router.get('/admin', middleware, async (req, res) => {
  const { admin_id } = res.locals.admin;
  try {
    const admins = await Admins.findOne({ where: { admin_id } });
    if (!admins) {
      return res.status(400).json({
        message: '해당 유저가 존재하지 않습니다.',
      });
    }
    return res.status(200).json({ Name: admins.admin_name });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});
// admin 로그인
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({
        message: 'input value check email or password',
      });
    }

    const admin = await Admins.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({
        message: 'check email or password',
      });
    }
    if (!admin.password == password) {
      return res.status(400).json({
        message: 'check email or password',
      });
    }
    const token = jwt.sign({ admin_id: admin.admin_id }, process.env.SECRET_KEY);
    res.cookie('authorization', `Bearer ${token}`);
    my_cache.set(admin.admin_id, admin, 10000);
    return res.status(200).json({ message: `로그인 성공 ${admin.admin_name}님 환영합니다.` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'login server error.' });
  }
});
// admin 삭제
router.delete('/admin/signout', middleware, async (req, res) => {
  const { admin_id } = res.locals.admin;
  try {
    const admin_find = await Admins.findOne({ where: admin_id });
    if (!admin_find) {
      res.status(400).json({ message: '회원이 조회되지 않습니다.' });
    }
    await Admins.destroy({
      where: {
        [Op.and]: [{ admin_id: admin_id }],
      },
    });
    res.status(200).json({ message: `${admin_find.admin_name}님 삭제가 완료되었습니다.` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'server error.' });
  }
});
//cookie 구별
router.get('/usercheck', middleware, async (req, res) => {
  if (!res.locals.user) {
    return res.status(200).json({ data: false });
  }
  if (!res.locals.admin) {
    return res.status(200).json({ data: false });
  }
  const { admin_id } = res.locals.admin;
  try {
    if (!admin_id) {
      return res.status(200).json({
        data: true,
      });
    }
    return res.status(200).json({ data: false });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});
//tutor 연결
router.get('/usercheck/tutor', middleware, async (req, res) => {
  const { user_id } = res.locals.user;
  try {
    const find_tutor = await TutorInfos.findOne({ where: { user_id } });
    if (!find_tutor) {
      return res.status(400).json({ data: false });
    }
    return res.status(200).json({ data: find_tutor });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});

//tutor 연결
router.get('/usercheck/admin', async (req, res) => {
  const admin = req.session.admin;
  console.log(admin);
  try {
    return res.status(200).json({ data: admin });
  } catch {
    res.status(500).json({ message: 'server error.' });
  }
});

// 유저 이름 불러오기: 프론트에 필요한 거에요 지우지 말아주세요
router.get('/user', middleware, async (req, res) => {
  const { user_id } = res.locals.user;

  try {
    const user = await Users.findOne({
      where: { user_id },
      include: [
        {
          model: TutorInfos,
        },
      ],
    });
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

module.exports = router;
