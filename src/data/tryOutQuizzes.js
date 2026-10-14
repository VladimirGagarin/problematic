export const tryOutQuizzes = {
  'sequence-puzzle': [
    { qn: '1, 4, 9, 16, 25, ?', answer: '36' },
    { qn: '2, 3, 5, 7, 11, ?', answer: '13' },
    { qn: '1, 1, 2, 3, 5, 8, ?', answer: '13' },
    { qn: '3, 6, 12, 24, ?', answer: '48' },
    { qn: '1, 8, 27, 64, ?', answer: '125' },
    { qn: '2, 6, 12, 20, 30, ?', answer: '42' }
  ],
  'number-puzzle': [
    { qn: 'What is the only even prime number?', answer: '2' },
    { qn: 'How many seconds are in one hour?', answer: '3600' },
    { qn: 'What is the smallest number divisible by 1, 2, 3, 4, 5 and 6?', answer: '60' },
    { qn: 'Find two whole numbers that add to 10 and multiply to 21.', answer: '3, 7 | 7, 3' },
    { qn: 'How many positive divisors does 36 have?', answer: '9' },
    { qn: 'Using exactly four 4s, what does 4 + 4 + 4/4 equal?', answer: '9' }
  ],
  'logic-puzzle': [
    { qn: 'Knights tell the truth, knaves lie. A says "I am a knave." Could A be a knight? (yes/no)', answer: 'no' },
    { qn: 'A says "Both of us are knaves." If A is a knave, is B a knight or a knave?', answer: 'knight' },
    { qn: 'A says "We are the same type." What type is B, knight or knave?', answer: 'knight' },
    { qn: 'A says "My friend is a knight." If A is a knave, what type is the friend?', answer: 'knave' }
  ],
  'open-problem': [
    { qn: 'Is the Collatz conjecture proved? (yes/no)', answer: 'no' },
    { qn: 'Has an odd perfect number ever been found? (yes/no)', answer: 'no' },
    { qn: 'Is Goldbach\u2019s conjecture proved? (yes/no)', answer: 'no' },
    { qn: 'Was Fermat\u2019s Last Theorem proved? (yes/no)', answer: 'yes' },
    { qn: 'Is the twin prime conjecture proved? (yes/no)', answer: 'no' }
  ],
  'algebra-problem': [
    { qn: 'Solve for x: 2x + 5 = 13.', answer: '4' },
    { qn: 'If x + 1/x = 3, what is x^2 + 1/x^2?', answer: '7' },
    { qn: 'If 3^x = 81, what is x?', answer: '4' },
    { qn: 'What is the sum of the roots of x^2 - 5x + 6 = 0?', answer: '5' },
    { qn: 'Factor x^2 - 9. Give the positive root.', answer: '3' }
  ],
  'probability-problem': [
    { qn: 'A fair coin is flipped twice. What is the probability of two heads? (fraction)', answer: '1/4' },
    { qn: 'A fair die is rolled. What is the probability of an even number? (fraction)', answer: '1/2' },
    { qn: 'Two fair dice are rolled. What is the probability the sum is 7? (fraction)', answer: '1/6' },
    { qn: 'What is the probability of drawing an ace from a standard deck? (fraction)', answer: '1/13' },
    { qn: 'A bag has 3 red and 2 blue balls. What is the probability of drawing red? (fraction)', answer: '3/5' }
  ],
  'game-theory-problem': [
    { qn: 'In the two-thirds-of-the-average game with perfectly rational players, what is the winning number?', answer: '0' },
    { qn: 'In a one-off Prisoner\u2019s Dilemma, what is the dominant strategy: cooperate or defect?', answer: 'defect' },
    { qn: 'How many pure-strategy Nash equilibria does one round of Rock-Paper-Scissors have?', answer: '0' },
    { qn: 'In the game of chicken, does swerving or driving straight risk the worst outcome?', answer: 'driving straight | straight' }
  ],
  'cryptography-problem': [
    { qn: 'In RSA, which key is shared publicly: public or private?', answer: 'public' },
    { qn: 'Public-key cryptography uses how many keys per person?', answer: '2 | two' },
    { qn: 'Which is hard in RSA: multiplying or factoring?', answer: 'factoring' },
    { qn: 'Does Diffie\u2013Hellman let two parties agree on a secret over a public channel? (yes/no)', answer: 'yes' },
    { qn: 'In RSA, is the modulus public or secret?', answer: 'public' }
  ],
  'challenge': [
    { qn: 'What is 1 + 2 + 3 + ... + 100?', answer: '5050' },
    { qn: 'How many trailing zeros are in 100! ?', answer: '24' },
    { qn: 'What is the smallest number divisible by all of 1 through 10?', answer: '2520' },
    { qn: 'What is the next perfect number after 6 and 28?', answer: '496' },
    { qn: 'Using exactly four 4s, what does 4 \u00d7 4 - 4 - 4 equal?', answer: '8' }
  ],
  'mathematical-model': [
    { qn: 'In the SIR model, what does the R stand for?', answer: 'recovered | removed' },
    { qn: 'In the SIR model, does a larger R0 make a disease spread faster or slower?', answer: 'faster' },
    { qn: 'In the logistic growth model, growth slows as a population nears what?', answer: 'carrying capacity' },
    { qn: 'If R0 is less than 1, does an outbreak grow or die out?', answer: 'die out' },
    { qn: 'A quantity that doubles every fixed time step grows in which way, linear or exponential?', answer: 'exponential' }
  ]
}

export function getQuizPool(type) {
  return tryOutQuizzes[type] || null
}
