const express = require('express');
const session = require('express-session');
const memory_session = require('memorystore')(session);
const Op = require("sequelize");
const router = express.Router();
const { Admins } = require('../models');
const env = process.env;
require('dotenv').config();



  router.post('/admin/session/login', async(req, res,next) => {
    const {email,password} = req.body;
    try{
        const admins_find = await Admins.findOne({ where: { email} });
        console.log(admins_find.password,password);
        if(password!=admins_find.password)
        {
          res.status(400).json({ message: '일치하는 관리자가 없습니다.' });
          return;
        }
        if(!admins_find){
          res.status(400).json({ message: '일치하는 관리자가 없습니다.' });
          return;
        }
        req.session.admin = admins_find;
        res.status(200).json({ message: '관리자 로그인' });
        next();
        return;
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({ message: 'server error.' });
        return;
    }
   });
   router.get('/admin/session/', async(req, res) => {
    const login_admin = req.session.admin;
    try{
        if(!login_admin){
          console.log(login_admin);
          res.status(400).json({ message: '일치하는 관리자가 없습니다.' });
          return;
        }
        res.status(200).json({ message: login_admin});
        return;
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({ message: 'server error.' });
        return;
    }
   });
   
   router.get('/admin/session/logout', async(req, res) => {
    const login_admin = req.session.admin;
    try{
        if(!login_admin){
          res.status(400).json({ message: `로그인 된 관리자가 없습니다.`});
          return;
        }
        req.session.destroy(()=>{
          req.session
        }); 
        res.status(200).json({ message: `${login_admin.admin_name}로그아웃.`});
        return;
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({ message: 'server error.' });
        return;
    }
   });

   module.exports = router;