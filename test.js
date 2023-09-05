const a = [
  { id: 1, name: 'aaaa' },
  { id: 2, name: 'bbbb' },
  { id: 3, name: 'cccc' },
];
const b = [
  { id: 1, password: '1212', name: 'aaaa' },
  { id: 2, password: '1212', name: 'bbbb' },
  { id: 3, password: '1212', name: 'cccc' },
  { id: 4, password: '1212', name: 'dddd' },
  { id: 5, password: '1212', name: 'eeee' },
];

// a 배열의 id와 b 배열의 id가 일치하지 않는 항목만 추출하여 새로운 배열 c를 생성
const c = b.filter((itemB) => !a.some((itemA) => itemA.id === itemB.id));

console.log(c);
