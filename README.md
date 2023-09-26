## 짧게 공부하자 짧공!

"**짧공"은 실시간 화상 통화와 드로잉 기능을 결합한 온라인 과외 플랫폼입니다.**

![image](https://github.com/helliamnoob/Short-Bean/assets/122019196/59eb254c-e305-4e89-95d5-6eba1cd436bc)

## 기술적 의사결정

### 백엔드

**node.js**

**express**

**javascript**

**Database**

- MongoDB, MySQL

**Authentication**: 로그인을 위한 라이브러리입니다.

- jsonwebtoken

**Image Upload**

- multer, multer-s3, aws-sdk

### 화상채팅

**WebRTC**: 실시간 화상 통신을 위한 기술입니다.

**Socket.io**: 실시간 통신을 위해 사용할 수 있습니다.

### 드로우

**HTML5 Canvas**: 웹 상에서 그래픽을 그리는 데 사용됩니다. 이를 위한 JavaScript API도 존재합니다.

### 배포

- AWS EC2와 nginx로 http, https연결 certbot으로 let's encrypt 인증서 발급

---

## 🔧트러블슈팅

### Q1. 로그인 한 회원의 정보로 소켓에 연결하기

1. 프론트엔드에서 jwt 복호화 한 후 소켓연결할 때 정보실어주기
2. 쿠키만 서버에서 보내고 서버에서 복호화하기

프론트엔드에서 하면 뭔가보안상 문제도 있을 것 같고, 실질적으로 쓰는 곳이 소켓서버여서 2번방법을 택했습니다.

### Q2. 메시지를 주고받을 때 온라인과 오프라인을 구별하는 법에 대한 고민

1. User테이블에 로그인/로그아웃 컬럼을 넣고 검증하기
-> 보내는 쪽의 부담이 너무 크고 비효율적이다
2. SQS 구조이용하기
3. 검증하지 않고 소켓으로 다 처리하기

소켓은 실시간 통신이라고만 생각했는데 이벤트처리의 역할도 할 수 있어서 온/오프라인과 관계없이 이벤트 시 메시지를 저장하는 로직을 구현했습니다.

```
socket.on('new_message', async (msg, room, done) => {
  // 새로운 채팅데이터 생성
  const newChat = new Chat({
    room_id: room,
    is_send: socket.roomOwner,
    message_content: msg,
  });
  await newChat.save();
  socket.to(room).emit('new_message', `${userName}: ${msg}`);
  done();
});
```

### Q3. 메시지를 보낼때마다 DB에 저장하기 VS 캐시메모리를 이용하여 disconnect시 한번에 저장하기

일단 전자로 구현했지만 후자가 더욱 부하가 없어 효율적이라고 생각했습니다.
하지만 보낼 때마다 저장하는 것이 특이점에서 오류가 날 확률이 좀 더 적고,
캐시메모리로 저장하는 방식은 데이터의 크기가 커지면 오히려 부하가 더 생길 수 있다는 피드백을 받았습니다.
해서 오류를 최대한 줄이기 위해 보낼 때 마다 db에 저장하는 방식을 택했습니다.

### Q4. 마우스를 누르지도 않았는데 상대방의 캔버스에 그림이 그려지는 오류

드로우 기능을 공유하려고 소켓에 연결했다. emit 해서 드로우 부분을 공유하는데
분명 선이 공유가 되는데 상대방의 마우스에 계속 영향을 받는 것이다. 게다가 마우스를
누르지 않았는데도 상대방 마우스가 있는 자리를 중심으로 계속 선이 그어졌다.

해결방법
처음에는 그림을 그리는 부분만 emit 해서 드로우를 공유했는데 마우스를 누르고
마우스를 때는 부분까지 같이 공유해야 한다는 것을 알아차렸다. 마우스를 누르지
않고 있어도 상대방의 캔버스에 자꾸 선이 그려지는 것을 보고 알아 차렸다.

```jsx
function startDrawing(e) {
isDrawing = true;
const x = e.offsetX;
const y = e.offsetY;
ctx.beginPath();
ctx.moveTo(x, y);
socket.emit('mousedown', {x, y, color: ctx.strokeStyle});
}

function stopDrawing() {
isDrawing = false;
ctx.closePath();
socket.emit('mouseup');
}
```

두 로직에 emit 을 추가하여 다시 드로잉을 해본 결과 마우스를 눌렀을 때만 그림이 공유가 되어서 상대방의 마우스에 영향을 받는 일이 사라졌다.

### Q5 왜 내가 바꾼 색깔이 상대방의 캔버스에도 적용이 되는 거지?

위와는 반대가 되는 사항이다.  나의 데이터를 보내는 것의 중요성을 깨달아서 모든 로직에 emit 을 추가하여 테스트를 해봤다. 

그러자 내가 색깔을 바꿔 드로우를 했는데 상대방이 드로우하는 색이 바뀌었다. 뿐만아니라 상대방이 셀렉한 색인데도 내가 드로우 할때 영향을 받는 것이였다.

해결방법

모든것을 emit 을 할 필요가 없다는 것을 깨닫고 색깔 체인지 부분을 원래의 로직으로 되돌렸다

```jsx
function changeColor(e) {
  isErasing = false;
  const newColor = e.currentTarget.dataset.color;
  ctx.strokeStyle = newColor;

  colorBtns.forEach((button) => {
    if (button === e.currentTarget) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  }); eraserBtn.classList.remove("selected");

}
```

---

## 💎주요기능

### 최종 MVP 스펙:

### **1. 로그인 / 회원가입**

- **공통 유저 회원가입:** JWT 발급 및 휴대폰 인증
- **공통 유저 로그인:** 나중에 선생님 권한을 위한 추가 인증
- **AWS 클라우드 프론트**를 통한 웹 서비스 호스팅

### **2. 질문 페이지**

- **게시글(질문) 관리:** 생성, 조회, 수정, 삭제 (CRUD) 및 이미지 저장을 위한 AWS S3 활용
- **질문 좋아요 기능**
- **댓글 관리:** 생성, 조회, 수정, 삭제 (CRUD)
- **신고하기 기능** 추가

### **3. 매칭 페이지**

- **이미지 업로드:** AWS S3를 사용하여 이미지 업로드 및 관리
- **선생님 즐겨찾기 기능** 추가

### **4. 마이 페이지**

- **답변 스크랩:** MongoDB를 활용한 저장 및 불러오기 기능
- **회원 정보 수정** 기능 구현

### **5. 실시간 화상 티칭**

- **드로우 기능** 추가
- **Socket.io**를 활용한 실시간 화상 티칭 구현

### **6. 실시간, 오프라인 채팅**

- **MySQL 및 MongoDB**를 활용한 오프라인 채팅 저장
- **Socket.IO**를 이용한 현재 접속자와 온라인 채팅 구현
- **채팅 알림** 기능 추가

---

## 😊팀원 소개
| 팀원 이름 | 역할 | 분담 |
| --- | --- | --- |
| 박예림 | 리더 | 화상채팅, 댓글 CRUD수정, 드로우 화면공유 기능, 기본 프론트  |
| 윤예진 | 부리더 | 게시글 CRUD, 댓글 CRUD, S3 이미지 업로드 |
| 김창범 | 팀원 | 로그인CRUD(cookie), 관리자 CRD(session),문자인증(sens api) |
| 신나라 | 팀원 | 튜터 권한 및 등록, 부가기능(좋아요, 튜터 즐겨찾기, 신고), 관리자페이지, 드로우 기본 기능 등 |
| 이승준 | 팀원 | 온,오프라인 채팅 기능, mongoDB 연결, ec2배포, https 접속 |
