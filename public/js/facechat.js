const jwtToken = getCookieValue('authorization');
function getCookieValue(cookieName) {
  const cookieParts = document.cookie.split('; ');

  for (const part of cookieParts) {
    const [name, value] = part.split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}
const socket = io({
  auth: {
    token: jwtToken,
  },
});

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');
const call = document.getElementById('call');

let myStream;
let muted = false;
let cameraOff = false;
let myPeerConnection;
let myDataChannel;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.error('Error getting media:', e);
  }
}

async function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  const muteIcon = document.getElementById('muteIcon');

  if (!muted) {
    muteIcon.style.color = 'red'; 
    muted = true;
  } else {
    muteIcon.style.color = 'black';
    muted = false;
  }
}

async function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  const cameraIcon = document.getElementById('cameraIcon');

  if (cameraOff) {
    cameraIcon.style.color = 'black';
    cameraOff = false;
  } else {
    cameraIcon.style.color = 'red'; 
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === 'video');
    videoSender.replaceTrack(videoTrack);
  }
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');
if (roomId) {
  initCall().then(() => {
    socket.emit("join_room", roomId);
  });
}

async function initCall() {
  await getMedia();
  
  if (myStream) {
    // PeerConnection 초기화
    const configuration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };
    myPeerConnection = new RTCPeerConnection(configuration);
  
    makeConnection();
  } else {
    console.error("Failed to get media stream");
    return;
  }
}

let isConnectionMade = false; // 플래그 추가

socket.on("user_joined", async (data) => {
  console.log(`User ${data.userId} has joined the room ${data.roomId}`);
  if (socket.id !== data.userId) {
      await makeConnection();
      initDataChannelAndSendOffer();
  }
});

async function initDataChannelAndSendOffer() {
  if (!myPeerConnection) {
    console.error("myPeerConnection is not initialized yet!");
    return;
  }
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => console.log(event.data));
  console.log("Made data channel");

  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("Sent the offer");
  socket.emit("offer", offer, roomId);
}

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  });
  console.log("received the offer");
 try {
  await myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  await myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomId);
  console.log("sent the answer");
} catch (error) {
  console.error("Error handling the offer:", error);
}
});

socket.on("answer", async (answer) => {
  try {
      await myPeerConnection.setRemoteDescription(answer);
      console.log("received the answer");
  } catch (error) {
      console.error("Error handling the answer:", error);
  }
});

const iceCandidatesQueue = [];

socket.on("ice", (ice) => {
  if (myPeerConnection && myPeerConnection.remoteDescription && myPeerConnection.remoteDescription.type) {
    myPeerConnection.addIceCandidate(ice);
  } else {
    iceCandidatesQueue.push(ice);
  }
});

for (let ice of iceCandidatesQueue) {
  myPeerConnection.addIceCandidate(ice);
}

let facechat_id;

// Fetch the facechat_id when the page loads
window.addEventListener("load", fetchFacechatId);

async function fetchFacechatId() {
  try {
    const response = await fetch('/api/facechat'); // Assuming the API endpoint returns facechat_id in a JSON object
    const data = await response.json();

    if (response.ok) {
      facechat_id = data.facechat_id;
      console.log(`Successfully fetched facechat_id: ${facechat_id}`);
    } else {
      console.log(`Failed to fetch facechat_id: ${data.message}`);
    }
  } catch (error) {
    console.error(`An error occurred while fetching facechat_id: ${error}`);
  }
}

let theirStream = null;

function handleTrack(data) {
  console.log("handle track");
  const peerFace = document.querySelector("#peerFace");

  // 상대방의 미디어 스트림을 저장
  theirStream = data.streams[0];

  peerFace.srcObject = theirStream;
}



document.getElementById("leaveButton").addEventListener("click", function() {
  // Confirm with the user
  const userConfirmed = confirm('채팅방을 나가시겠습니까?');

  if (!userConfirmed) {
    return;
  }

  // Do the resource cleanup here
  if (myStream) {
    let tracks = myStream.getTracks();
    tracks.forEach(track => track.stop());
  }

  if (myPeerConnection) {
    myPeerConnection.close();
  }

  // Notify other users via socket event that you have left
  socket.emit('leave_room', roomId);

  console.log('Successfully left the chat room');
  alert('채팅방을 성공적으로 나갔습니다.');

  if (window.location.pathname === '/facechat' && window.location.search === `?room=${roomId}`) {
    window.close(); 
  }
});

// 상대방이 채팅방을 나갔을 때의 이벤트 핸들러
socket.on('user_left', (message) => {
  alert(message);

  // 상대방의 미디어 스트림을 중지
  if (theirStream) {
    let tracks = theirStream.getTracks();
    tracks.forEach(track => track.stop());
  }

  // 상대방의 비디오를 화면에서 제거
  const peerFace = document.querySelector("#peerFace");
  peerFace.srcObject = null;
});

// RTC Code

async function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("track", handleTrack)
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

async function handleIce(data) {
  if (data.candidate) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomId);
  }
}

async function handleIce(data) {
  if (data.candidate) {
      console.log("sent candidate");
      socket.emit("ice", data.candidate, roomId);
  }
}

function handleTrack(data) {
  console.log("handle track")
  const peerFace = document.querySelector("#peerFace")
  peerFace.srcObject = data.streams[0]
  }