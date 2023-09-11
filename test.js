const originTime = '2023-09-07T08:32:36.686Z';

function formatTimeToKorean(dateString) {
  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours());

  const hours = date.getHours().toString().padStart(2, '0'); // 시
  const minutes = date.getMinutes().toString().padStart(2, '0'); // 분

  // 형식화된 시간을 "시:분" 형식으로 반환
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

const cur = formatTimeToKorean(originTime);
console.log(cur);
