const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
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
    video: { facingMode: "user" },
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
    console.error("Error getting media:", e);
  }
  }


  async function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
async function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);


const urlParams = new URLSearchParams(window.location.search);

const roomFromUrl = urlParams.get('room');
if (roomFromUrl) {
    initCall();
    socket.emit("join_room", roomFromUrl);
}

async function initCall() {
  await getMedia();
  if (myStream) {
    makeConnection();
  } else {
    console.error("Failed to get media stream");
    return;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired!"); // 페이지가 로드되었는지 확인하기 위한 로그

  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room');
  
  console.log("roomFromUrl value:", roomFromUrl); // roomFromUrl 값 로깅

  if (roomFromUrl) {
      initCall();
      socket.emit("join_room", roomFromUrl);
      roomName = roomFromUrl; 
      console.log("Joined room:", roomName); // 방에 참가했는지 확인하기 위한 로그
  }
});

let isConnectionMade = false; // 플래그 추가

socket.on("user_joined", async (data) => {
    console.log(`User ${data.userId} has joined the room ${data.roomName}`);

    if (socket.id === data.userId) {
        // 플래그로 중복 호출 방지
        if (!isConnectionMade) {
            await makeConnection(); // 함수가 완전히 완료될 때까지 기다림
            isConnectionMade = true;
        }

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
  socket.emit("offer", offer, roomName);
}

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  });

  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
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
  myPeerConnection.addEventListener("track", handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

async function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

async function handleAddStream(event) {
  console.log("handleAddStream event triggered"); // 이 로그가 출력되는지 확인
  const peerFace = document.getElementById("peerFace");
  if (peerFace.srcObject) return;  
  peerFace.srcObject = event.streams[0];
}

