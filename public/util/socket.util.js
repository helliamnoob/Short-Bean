// util.js

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

function initializeSocket() {
  const jwtToken = getCookieValue('authorization');
  if (!jwtToken) return;
  const socket = io({
    auth: {
      token: jwtToken,
    },
  });
  return socket;
}

export const socket = initializeSocket();
