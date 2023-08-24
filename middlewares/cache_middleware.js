const cache = require('node-cache');
const {Users} = require('../models');
const myCache = new cache();
module.exports = async (req, res, next) => {
  try{
    // 로그인 여부 확인
    const is_exit_cache = res.locals.user;
    // 로그인이 안되어있으면 캐쉬에 값 저장
    if(!is_exit_cache)
    {
      const create_cache = req.body;
      const cache_email = create_cache.email;
      const cache_user = await Users.findOne({ where: { email : cache_email } });
      myCache.set(cache_user.user_id, cache_user);
      next();
    }
    //저장 안되어있다면 캐쉬값 탐색후 반환
    else 
    {
      const cached_body = myCache.get(is_exit_cache.user_id);
      if(cached_body) {
        res.status(200).json({ cached_body });
        return;
      }
    }
  }
  catch(e)
  {
    console.log(e);
    res.status(401).json({ message: 'cache 에 저장되었습니다.' });
    return;
  }
  };