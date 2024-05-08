'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//Project lesson #1
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__value">${mov}</div>
   </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Project lesson #2

const eurToUSD = 1.1;

const movementsUSD = movements.map(mov => mov * eurToUSD);

const movementsDescriptions = movements.map((mov, i, arr) => {
  `Movements ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
    mov
  )}`;
});

const calcDIsplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Project Lesson #3
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUi = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //DIsplay summary
  calcDIsplaySummary(acc);
};
// Project Lesson #4
const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);
// Projects lesson #4
const balance = movements.reduce((acc, cur) => acc + cur, 0);
// Project lesson #5
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting

  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.valuue);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    console.log('hi');
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//-------------------------------------------
// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUSD);
// }
// // Coding Challenge #1
//Test Data №1 Julia : [3,5,2,12,7], Kate's [4,1,15,8,3]
//Test Data №2 Julia : [9,16,6,8,3], Kate's [10,5,6,1,4]
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice(1, -1);
//   const allData = dogsJuliaCorrected.concat(dogsKate);
//   allData.forEach(function (age, i) {
//     age >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//   });
// };
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
// // LESSON 1
// let arr = ['a', 'b', 'c', 'd', 'e'];
// //SLICE
// arr.slice(2);
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));

// // SPLICE
// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse);
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// // LESSON 2
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at[0]);

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('jonas'.at(0));
// console.log('jonas'.at(-1));

// // LESSON 3
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('---- FOREACH -----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: withdrew ${Math.abs(mov)}`);
//   }
// });
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ....

// LESSON $
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (val, key, map) {
//   console.log(`${key}: ${val}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (val, _, map) {
//   console.log(`${val}: ${val}`);
// });

// Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// //Conding Challange #2
// const calcAvarageAge = function (dogsAges) {
//   const humanDogAges = dogsAges.map(dogAge => {
//     if (dogAge >= 2) return dogAge * 4 + 16;
//     else return dogAge * 2;
//   });
//   const adultDogs = humanDogAges.filter(dogAge => dogAge >= 18);
//   return adultDogs.reduce((acc, cur) => acc + cur, 0) / adultDogs.length;
// };
// console.log(calcAvarageAge([16, 6, 10, 5, 6, 1, 4]));
/*
Test data 1
[5,2,4,1,15,8,3]
Test data 2
[16,6,10,5,6,1,4]


*/
// const totalDepositsUSD = Math.trunc(
//   movements
//     .filter(mov => mov > 0)
//     .map((mov, i, arr) => mov * eurToUSD)
//     .reduce((acc, mov) => acc + mov, 0)
// );
// console.log(totalDepositsUSD);
// //Conding Challange #3
// const calcAvarageAge = dogsAges => {
//   let reducedArrLength = 0;
//   const humanDogAges =
//     dogsAges
//       .map(dogAge => (dogAge >= 2 ? dogAge * 4 + 16 : dogAge * 2))
//       .filter(dogAge => dogAge >= 18)
//       .reduce((acc, cur, i, arr) => {
//         reducedArrLength = arr.length;
//         return acc + cur;
//       }, 0) / reducedArrLength;

//   return humanDogAges;
// };
// console.log(calcAvarageAge([16, 6, 10, 5, 6, 1, 4]));

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// for (const account of accounts) {
// }

// Every
// const arr = [1, 2, 3, 4, 'hi'];
// console.log(arr.every(n1 => n1 != 0));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const allMovements = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, cur) => acc + cur, 0);

// const overalBalacnce = accounts.flatMap(acc => acc.movements);

// let i = 5;
// let j = 5;
// let n = 10;

// i = ++i + ++i;
// n += j++ + ++j;
// console.log(i, j, n);

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// movements.sort((a, b) => a - b);
