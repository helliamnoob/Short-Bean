const socket = io();

// receiving a message
socket.on('msg', function (data) {
  var msgLine = document.createElement('div');
  msgLine.className = 'msgLine';

  var msgBox = document.createElement('div');
  msgBox.className = 'msgBox';
  msgBox.textContent = data;
  msgBox.style.display = 'inline-block';

  msgLine.appendChild(msgBox);
  document.getElementById('chatContent').appendChild(msgLine);

  var chatContent = document.getElementById('chatContent');
  chatContent.scrollTop = chatContent.scrollHeight;
});

// Sending a message
document.getElementById('myChat').addEventListener('submit', (event) => {
  console.log('해치웠나?');
  var msgLine = document.createElement('div');
  msgLine.className = 'msgLine';
  msgLine.style.textAlign = 'right';

  var msgBox = document.createElement('div');
  msgBox.className = 'msgBox';
  msgBox.textContent = this.value;
  msgBox.style.display = 'inline-block';

  msgLine.appendChild(msgBox);
  document.getElementById('chatContent').appendChild(msgLine);

  socket.emit('msg', this.value);
  this.value = '';

  var chatContent = document.getElementById('chatContent');
  chatContent.scrollTop = chatContent.scrollHeight;
});
