"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Adarsh Puthane",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Uchit Chakma",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  // console.log(containerMovements.innerHTML);
  //.textContent = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__value">${mov}₨</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}₨`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createUsernames(accounts);

const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(incomes);
  labelSumIn.textContent = `${incomes}₨`;
};

const calDisplayOut = function (acc) {
  const outMoneys = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outMoneys)}₨`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest;
};
const updateUI = function (currentAccount) {
  //Display movements
  displayMovements(currentAccount.movements);
  //Display balance
  calDisplayBalance(currentAccount);
  //Display summary
  calDisplayOut(currentAccount);
  calDisplaySummary(currentAccount);
};
//Event handler
let currentAccount;
btnLogin.addEventListener("click", function (event) {
  //Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //Updating the UI
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = `Wrong User Name OR Password`;
  }
});
//Transfer the amount
btnTransfer.addEventListener("click", function (eve) {
  eve.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // add negative movement to current user
    currentAccount.movements.push(-amount);
    // add positive movement to recipient
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

// close the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const closeUser = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  //clearing the field
  inputCloseUsername.value = inputClosePin.value = "";
  if (
    currentAccount.username === closeUser &&
    currentAccount.pin === closePin
  ) {
    //11.------------------findIndex method----------------------------//
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    ); // Return the index at that true value the first element is returned
    // console.log(index);
    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//-------------------------------Array Method-------------------------//

// let arr = ["a", "b", "c", "d", "e"];

// //1.Slice method

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice()); // to create a shallow copy
// console.log([...arr]);

// //2. Splice method used to  make changes to the original array
// // console.log(arr.splice(2));
// arr.splice(-1);
// arr.splice(1, 2);
// console.log(arr);

// // 3.reverse reverse method will mutate the array
// arr = ["a", "b", "c", "d", "e"];
// const arr2 = ["j", "i", "h", "g", "f"];
// arr2.reverse();
// console.log(arr2);

// //4.concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN return the string
// console.log(letters.join("-"));
// console.log(typeof letters.join("-"));

//5. AT method return the element at specified loc

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// //Getting the last ele
// console.log(arr.at(arr.length - 1));
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// // at method will also work for  string
// console.log("object".at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //for(const movement of movements)
// for (const [i, movement] of movements.entries()) {
//   // the first ele is index and the second ele is movement
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`MOvement ${i + 1}: You withdrew ${Math.abs(movement)}`); //math.abs is used to get the absolute value with removing the sign
//   }
// }
// console.log("--------------------------------------");

// // 6.For each method with easy code for array (continue and break statement do not work here)
// movements.forEach(function (movement, index, array) {
//   // the first ele is movement and fellows by index...
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`); //math.abs is used to get the absolute value with removing the sign
//   }
// });

// //7. ForEach for map and sets

// //Map
// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });

// //Set

// const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);

// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, map) {
//   //Set do not have any key in them to omit that we is _
//   console.log(`${value} : ${value}`);
// });

// //7.--------------------Map method-----------------------------//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const rsToUsd = 0.012;
// const movementsRs = movements.map(function (mov) {
//   return mov * rsToUsd;
// });

// //using the arrow function
// const movementsArrow = movements.map((mov) => mov * rsToUsd);

// console.log(movements);
// console.log(movementsRs);
// console.log(movementsArrow);

// const movementsRSfor = [];

// for (const mov of movements) {
//   movementsRSfor.push(mov * rsToUsd);
// }
// console.log(movementsRSfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

// //---------------------filter method--------------------------------------// filter method return array if the condition is satisfied
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);
// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

// //8.--------------------reduce method-------------------------------------//
// // reduce loops over the array
// console.log(movements);

// // accumulator is like the sum which adds the current element of the array and hold the value.
// const balance = movements.reduce(function (acc, current, currentIndex, arr) {
//   console.log(`Iteration ${currentIndex}:${acc}`);
//   return acc + current;
// }, 0); // 0 is the initial value of the acc
// const balanceArrow = movements.reduce((acc, cur, i) => acc + cur);
// console.log(balance);
// console.log(balanceArrow);

//using the reduce for other methods

//Maximum value

// const maximumBalance = movements.reduce((cur, i) =>
//   cur < i ? (cur = i) : cur
// );

// console.log(maximumBalance);

// //9.--------------------------------chaining the methods---------------------------//
// //chaining the method only works when the return is an array
// const rsToUsd = 0.012;
// //pipeLine
// const totalDepositRs = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * rsToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositRs);

//10.-------------------------find method----------------------------------//
//Also loops over the array and return the first ele which satisfies the condition
// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find((acc) => acc.owner === "Adarsh Puthane");
// console.log(account);

//12.------------------Some and every method-----------------------------------//
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);
//only checks for equality
console.log(movements.includes(-130));

//Some method return when it first finds the ele that satisfies the condition
const anyDeposits = movements.some((mov) => mov > 1500);
console.log(anyDeposits);

//Every method return a boolean value if every array match requirements
console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));

//Separate callback
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//----------------------flat and flatMap----------------------------------//
//flat method return thr array with nested array into one array
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

//flat method goes only 1 level deep when flatting the array to avoid we use the depth operator

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map((acc) => acc.movements);
console.log(accountMovements);
const overallBalance = accountMovements
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
*/
/*
//Flat method combines flat and map method into 1 array flatMap only goes 1 level deep we cant change it

const overallBalance2 = accountMovements
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

//--------------------13.Sort method---------------------------------------// the sort method only works for string
//strings
const owners = ["Adarsh", "Uchit", "Adam", "Martha"];
console.log(owners.sort());

//Number
// console.log(movements.sort());
console.log(movements);
//return < 0 A,B
//return > B,A

//Ascending order
movements.sort((a, b) => a - b);
console.log(movements);

//Descending order
movements.sort((a, b) => b - a);
console.log(movements);
*/

//14.-------------more ways of creating arrays -----------------------------------------//

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7); // BY passing only 1 ele the array creates an empty array with that ele length
// console.log(x);
// console.log(x.map(() => 5));

// // We can only call 1 method on this and its called .fill

// //15.---------------------fill method--------------------------------------------------// mutate the underling array
// x.fill(1, 3);
// console.log(x);
// x.fill(1);
// console.log(x);
// //fill method can be used on regular array
// arr.fill(23, 4, 6);
// console.log(arr);

// //16-----------------------------array.from()-------------------------------------//

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1); //_ used to not to use the variable
// console.log(z);

// const a = Array.from(
//   { length: 100 },
//   (_, i) => Math.trunc(Math.random() * 6) + i + 1
// );
// console.log(a);
