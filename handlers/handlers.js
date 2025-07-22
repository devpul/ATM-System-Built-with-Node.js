const prompt = require('prompt-sync')();
const db = require('../db');


// ================= REGISTER =================
exports.register = async() => {
  const name = prompt("Masukan Nama : ");
  const pin = prompt("Masukan PIN : ");

  // kalau pin kurang dari 6 digit ATAU lebih dari 6 digit
  if(pin.length < 6 || pin.length > 6){
    console.log("PIN Minimal 6 digit 🙏");
    // return
    return;
  }

  const [result] = await db.query(
    'INSERT INTO accounts (name, pin) VALUES (?, ?)',
    [name, pin]
  );

  console.log(`Yeay kamu berhasil mendaftar 😀 `);
  console.log(`ID Kamu : ${result.insertId}`);
}


// pake file system
const fs = require('fs');

// ================= LOGIN =================
exports.login = async() => {
  // inputan
  const id = prompt("Masukan ID Akun : ");
  const pin = prompt("Masukan PIN : ");

  // query ny
  const [rows] = await db.query(
    'SELECT * FROM accounts WHERE id = ? AND pin = ?',
    [id, pin]
  );

  if (rows.length === 0) {
    console.log("Akun belum terdaftar !");
    return;
  }
  // assign 
  let currentUser = null;
  // data rows
  currentUser = rows[0];
  // simpan
  fs.writeFileSync('session.json', JSON.stringify(currentUser, null, 2));
  
  console.log(`Halo ${currentUser.name} 👋 Selamat Datang  di aplikasi myATM.`);
}


// ================= CHECK BALANCE =================
exports.checkBalance = async() => {
  // cek file ada atau gak
  const fileExist = fs.existsSync('session.json');
  if(!fileExist) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // cek isi file ada atau ga
  const fileData = fs.readFileSync('session.json', 'utf-8');
  if(!fileData) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // parsing, convert string ke object
  const user = JSON.parse(fs.readFileSync('session.json'));

  console.log(`Saldo kamu sekarang Rp ${Number(user.balance).toLocaleString('id-ID')}`);

  if(user.balance > 100000000){
    console.log("Anjay ! Beli Lamborghini 🏎");
  }else if(user.balance == 0){
    console.log("Yah Saldo Kamu Kosong Nih 😢, Deposit Yuk !")
  }else{
    console.log("Semangat Nabungnya 😄");
  }
}

// ================= DEPOSIT =================
exports.deposit = async() => {
  // cek file ada atau gak
  const fileExist = fs.existsSync('session.json');
  if(!fileExist) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // cek isi file ada atau ga
  const fileData = fs.readFileSync('session.json', 'utf-8');
  if(!fileData) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // baca user dan tampilkan
  const user = JSON.parse(fs.readFileSync('session.json'));
  // console.log(user);
  console.log(`Saldo kamu sekarang sebesar Rp ${Number(user.balance).toLocaleString('id-ID')}`);


  // parseFloat kalau uang atau nilai desimal
  const depoInput = parseFloat(prompt("Masukan Jumlah Deposit : Rp "));

  // jika iput deposit kurang dari 1000 muncul 'respon' lalu stop 
  if(depoInput < 1000){
    console.log("Minimal Deposit 1000 Rupiah 😁🙏");
    return;
  }

  // simpan ke database TABLE ACCOUNTS
  const [toAccounts] = await db.query(
    'UPDATE accounts SET balance = balance + ? WHERE id = ?',
    [depoInput, user.id]
  );
  
  // type enum deposit
  const type = 'deposit';

  // simpan ke database TABLE TRANSACTIONS
  const [toTransactions] = await db.query (
    'INSERT INTO transactions (account_id, amount, type) VALUES (?, ?, ?)',
    [user.id, depoInput, type]
  )

  if(!toAccounts){
    console.log("Gagal DEPO");
    return;
  }
  
  // simpen ke file system
  user.balance = Number(user.balance) + Number(depoInput);
  fs.writeFileSync('session.json', JSON.stringify(user));

  console.log(`✅ Mantap! Kamu berhasil deposit Rp${Number(depoInput).toLocaleString('id-ID')},00 😎`);
}


// ================= WITHDRAW =================
exports.withdraw = async() => {
  // cek file ada atau gak
  const fileExist = fs.existsSync('session.json');
  if(!fileExist) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // cek isi file ada atau ga
  const fileData = fs.readFileSync('session.json', 'utf-8');
  if(!fileData) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }
  // tampilkan user dari session.json
  const user = JSON.parse(fs.readFileSync('session.json'));
  // console.log(user);

  // menampilkan saldo km skrng
  console.log(`Saldo kamu sekarang : Rp ${Number(user.balance).toLocaleString('id-ID')}`);

  // jika saldo user kurang dari 1000
  if(user.balance < 1000) {
    console.log("Maaf, Saldo Kamu Gak Cukup Nih Buat Withdraw 🙏");
    return;
  }

  // input nominal withdraw
  const withdrawInput = parseFloat(prompt("Masukan Nominal Withdraw : Rp "));

  // validasi jika kurang dari 1000 dan stop
  if(withdrawInput < 1000){
    console.log("Minimal Withdraw 1000 Rupiah 😁🙏");
    return;
  }

  // jika withdraw kurang dari saldo yang dia punya
  if(withdrawInput > user.balance){
    console.log(`Yah kurang nih, saldo kamu cuman Rp ${Number(user.balance).toLocaleString('id-ID')} 😢`);
    return;
  }
  
  // perhitungan saldo user
  user.balance = Number(user.balance) - Number(withdrawInput);


  // simpan ke TABLE ACCOUNTS
  const [toAccounts] = await db.query(
    'UPDATE accounts SET balance = balance - ? WHERE id = ?',
    [withdrawInput, user.id]
  );

  // simpan ke session
  fs.writeFileSync('session.json', JSON.stringify(user, null, 2));

  // simpan ke TABLE TRANSACTIONS
  const type = 'withdraw';
  const [toTransactions] = await db.query (
    'INSERT INTO transactions (account_id, amount, type) VALUES (?, ?, ?)',
    [user.id, withdrawInput, type]
  )

  // ambil semua data di table transactions berdasarkan ACCOUNT_ID
  const [fromTransactions] = await db.query (
    'SELECT * FROM transactions WHERE account_id = ?',
    [user.id]
  )

  // inisialisi logs berupa array
  let logs = [];
  try{
    const isiFile = fs.readFileSync('riwayat_transaksi.json');
    // ubah string jadi objek
    logs = JSON.parse(isiFile);
  }catch(err){
    logs = [];
  }

  // push transaksi baru
  logs.push(fromTransactions);

  // catat
  fs.writeFileSync('riwayat_transaksi.json', JSON.stringify(logs, null, 2));

  // jika berhasil
  // console.log('✅ Log berhasil disimpan!')

  console.log(`✅ Sip! Kamu berhasil menarik saldo sebesar Rp${Number(withdrawInput).toLocaleString('id-ID')},00 🎉`);
}

// ================= CHECK ACCOUNT DETAILS =================
exports.checkAccount = async() => {

  // cek file ada atau gak
  const fileExist = fs.existsSync('session.json');
  if(!fileExist) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // cek isi file ada atau ga
  const fileData = fs.readFileSync('session.json', 'utf-8');
  if(!fileData) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  const [rows] = await db.query(
    "SELECT * FROM accounts"
  );

  const checkUser = JSON.parse(fs.readFileSync('session.json'));
  console.log(`--- Detail Akun 🧾 ---`);
  console.log(`ID Akun : ${checkUser.id}\nNama Akun : ${checkUser.name}\nPIN Akun  : ${checkUser.pin}\nSaldo kamu : Rp ${Number(checkUser.balance).toLocaleString('id-ID')},00`);
}


// ================= TRANSFER =================
exports.transfer = async() => {
  // cek file ada atau gak
  const fileExist = fs.existsSync('session.json');
  if(!fileExist) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // cek isi file ada atau ga
  const fileData = fs.readFileSync('session.json', 'utf-8');
  if(!fileData) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // inisialisasi user
  const user = JSON.parse(fs.readFileSync('session.json'));

  // 1. Input id penerima
  const idPenerima = parseInt(prompt("Masukan ID Penerima : "));

  // validasi
  if(idPenerima < 1){
    console.log("Tolong masukan ID Pererima dengan benar ya 🙏😊");
    return;
  }

  // query check di database apakah ada idPenerimanya
  const [rows] = await db.query(
    'SELECT * FROM accounts WHERE id = ?',
    [idPenerima]
  );

  // jika id nya ada
  if(rows.length > 0){
    // maka boleh lakukan transfer out
    if(user.balance < 1000){
      console.log("Mohon maaf, saldo anda tidak mencukupi 🙏");
      return;
    }

    // input oleh user
    const transferOut = parseFloat(prompt("Masukan Jumlah Transfer : Rp "));
    
    // validasi ketika kurang dari 1000 'rupiah'
    if(transferOut < 1000){
      console.log("Minimal Transfer 1000 Rupiah 😁🙏");
      return;
    }

    // jika withdraw kurang dari saldo yang dia punya
    if(transferOut > user.balance){
      console.log(`Yah kurang nih, saldo kamu cuman Rp ${Number(user.balance).toLocaleString('id-ID')} 😢`);
    return;
  }

    // variable pengirim
    const idPengirim = user.id;

    // simpan ke TABLE ACCOUNTS penerima
    const [toAccounts_Penerima] = await db.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [transferOut, idPenerima]
    );

    // simpan ke TABLE ACCOUNTS pengirim
    const [toAccounts_Pengirim] = await db.query (
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [transferOut, idPengirim]
    )

    // simpan ke session.json
    user.balance = Number(user.balance) - Number(transferOut);
    fs.writeFileSync('session.json', JSON.stringify(user));


    // PENGIRIM TRANSFER OUT KE PENERIMA
    // simpan ke TABLE TRANSACTIONS TYPE TRANSFER OUT
    const type_transferOut = 'transfer_out';
    const [toTransactions_transferOut] = await db.query (
      'INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, ?, ?, ?)',
      [user.id, type_transferOut, transferOut, idPenerima]
    )

    // PENERIMA TRANSFER IN DARI PENGIRIM
    // simpan ke TABLE TRANSACTIONS TYPE TRANSFER IN
    const type_transferIn = 'transfer_in';
    const [toTransactions_transferIn] = await db.query (
      'INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, ?, ?, ?)',
      [idPenerima, type_transferIn, transferOut, user.id]
    )

    // ambil semua data di table transactions berdasarkan id
    const [fromTransactions] = await db.query (
      'SELECT * FROM transactions WHERE account_id = ?',
      [user.id]
    )

    // simpan ke riwayat_transaksi.json
    // inisialisi logs berupa array
    let logs = [];
    try{
      const isiFile = fs.readFileSync('riwayat_transaksi.json');
      // ubah string jadi objek
      logs = JSON.parse(isiFile);
    }catch(err){
      logs = [];
    }

    // push transaksi baru
    logs.push(fromTransactions);

    // catat
    fs.writeFileSync('riwayat_transaksi.json', JSON.stringify(logs, null, 2));

    // objek nama
    const namaPenerima = rows[0].name;
    // pesan berhasil
    console.log(`Berhasil Melakukan Transfer ✅\n`);
    console.log(`--- Bukti Transfer oleh ${user.name} ---`);
    console.log(`ID Penerima : ${idPenerima}`);
    console.log(`Nama Penerima : ${namaPenerima}`);
    console.log(`Nominal Transfer : Rp${Number(transferOut).toLocaleString('id-ID')},00`);

  }else{
    console.log("ID Penerima tidak ditemukan 🙏");
  }
}

exports.logout = async() => {
  // cek file ada atau gak
  const fileExist = fs.existsSync('session.json');
  if(!fileExist) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // cek isi file ada atau ga
  const fileData = fs.readFileSync('session.json', 'utf-8');
  if(!fileData) {
    console.log("Yah kamu belom login nih 😢");
    return;
  }

  // hapus file
  fs.unlinkSync('session.json');

  console.log("Kamu berhasil logout!");
}