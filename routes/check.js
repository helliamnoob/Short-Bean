// checkLogin.js
function checkLogin(req, res, next) {
  if (req.session.isLoggedIn) {
    // 세션이 로그인된 상태라면 다음 미들웨어로 진행
    next();
  } else {
    // 로그인되지 않았다면 로그인 페이지로 리다이렉트 또는 다른 작업을 수행
    res.redirect('/admin/login'); // 로그인 페이지로 리다이렉트하는 예제
  }
}

// checkLogin 함수를 expor
module.exports = checkLogin;
