export function getRandomNumber(): number {
  return Math.floor(Math.random() * 10) + 1;
}

const trainers = [
  'Ash',
  'Misty',
  'Brock',
  'Tracey',
  'May',
  'Dawn',
  'Iris',
  'Cilan',
  'Serena',
  'Clemont',
  'Bonnie',
  'Lillie',
  'Kiawe',
  'Mallow',
  'Lana',
  'Sophocles',
  'Gladion',
  'Goh',
];

export function getRandomTrainer(): string {
  const randomIndex = Math.floor(Math.random() * trainers.length);
  return trainers[randomIndex];
}
