#!/usr/bin/env node

const { program } = require('commander');
// definisi dlu
const { register, login, checkBalance, deposit, withdraw, transfer, checkAccount, currentUser, logout} = require('./handlers/handlers');

program
  .command('register')
  .description('Register new account')
  .action(register);

program
  .command('login')
  .description('Login to account')
  .action(login);

program
  .command('check-balance')
  .description('Check account balance')
  .action(checkBalance);

program
  .command('deposit')
  .description('Deposit money')
  .action(deposit);

program
  .command('withdraw')
  .description('Withdraw money')
  .action(withdraw);

program
  .command('transfer')
  .description('Transfer money')
  .action(transfer);

program
  .command('check-account')
  .description('Check Detail Account')
  .action(checkAccount);

program
  .command('currentUser')
  .description('User barusan')
  .action(currentUser);

program
  .command('logout')
  .description('Logout currentUser')
  .action(logout);


program.parse();
