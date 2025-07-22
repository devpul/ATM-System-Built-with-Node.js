# ATM-System-Built-with-Node.js and MySQL

This is a simple **Banking System** built with **Node.js** and **MySQL Workbench**.  
It supports **register**, **login**, **check account**, **deposit**, **withdraw**, **transfer**, **check balance** and **logout** functionalities.

---

## ✨ Features

- ✅ Register new account
- ✅ Login with ID and PIN
- ✅ Deposit & withdraw balance
- ✅ Transfer balance to another user
- ✅ Store transactions in MySQL database
- ✅ Save session in `session.json`
- ✅ Save transfer histories in `riwayat_transaksi.json`

---

## 🛠️ Installation

To install the necessary dependencies for this project, run the following command:
```
npm install
npm init -y
npm install prompt-sync
npm install commander mysql2
npm install fs
```

## 📚 Database

```
CREATE TABLE transactions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT,
    FOREIGN KEY(account_id) REFERENCES accounts(id),
   `type` ENUM('deposit', 'withdraw', 'transfer_in','transfer_out'),
    amount DECIMAL(15,2) DEFAULT 0.00,
    target_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABEL ACCOUNTS
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(30) NOT NULL,
    pin VARCHAR(6) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🗂️ Tech Stack

- **Node.js**  
- **MySQL Workbench**
- **Commander** (for CLI commands)
- **Prompt-Sync** (for user input)
- **fs** (File System for session and transfer histories)

---

## ⚒ How to Run

- node index.js register
- node index.js login
- node index.js check-account
- node index.js deposit
- node index.js withdraw
- node index.js transfer
- node index.js check-balance
- node index.js logout

## 📸 Screenshots

- ### Register a new account
<img width="336" height="83" alt="image" src="https://github.com/user-attachments/assets/1c922781-535e-4f74-8b73-64815cc820b7" />

---

- ### Login to your account
<img width="446" height="69" alt="image" src="https://github.com/user-attachments/assets/75363df0-4d9c-48ce-bb8a-9c93a932e7a9" />

---

- ### Detail about your account

#### a. Account Details (Normal)

<img width="384" height="96" alt="image" src="https://github.com/user-attachments/assets/43e3fedc-1829-4110-a05c-9abf91a41bbd" />

#### b. Account Details (without **login**)

<img width="383" height="33" alt="image" src="https://github.com/user-attachments/assets/093ddf73-e9f8-446a-9844-d181f9d4ae07" />

---

- ### Deposit money to your account

#### a. Deposit (Normal)

<img width="404" height="66" alt="image" src="https://github.com/user-attachments/assets/c9460410-698d-450d-b022-b31846c85624" />

#### b. Deposit (without **login**)

<img width="331" height="33" alt="image" src="https://github.com/user-attachments/assets/420d1325-ca52-4d4d-b9bf-2e6875ca27fe" />

#### c. Deposit (if less than 1000 Rupiah)

<img width="326" height="68" alt="image" src="https://github.com/user-attachments/assets/503af2b0-6a2c-4c3c-b747-3d2487857d61" />

---

- ### Withdraw your money

#### a. Withdraw (Normal)

<img width="468" height="68" alt="image" src="https://github.com/user-attachments/assets/2ed69a9a-f41d-4065-bcf4-79696b402af3" />

#### b. Withdraw (without **login**)

<img width="337" height="33" alt="image" src="https://github.com/user-attachments/assets/d87d82b1-5866-45a2-95bc-93dea3d2b9e8" />

#### c. Withdraw (if greater than your current balance)

<img width="384" height="66" alt="image" src="https://github.com/user-attachments/assets/8868af65-98c7-48b5-ac7e-80662809ce59" />

#### d. Withdraw (if less than 1000 rupiah)

<img width="343" height="66" alt="image" src="https://github.com/user-attachments/assets/412c9aec-656a-4fc2-a372-bf103ed35848" />

---

- ### Transfer money to another user

#### a. Transfer (Normal)

<img width="345" height="146" alt="image" src="https://github.com/user-attachments/assets/f0ea0f95-c580-497a-8e17-2fb2fa771d76" />

#### b. Transfer (without **login**)

<img width="340" height="38" alt="image" src="https://github.com/user-attachments/assets/6dfa47ce-fc0f-4c65-b279-c6d9c85a7863" />

#### c. Transfer (if less than 1000 rupiah)

<img width="345" height="64" alt="image" src="https://github.com/user-attachments/assets/85c45078-e7dc-401f-8262-9b87460ba326" />

#### d. Transfer (if greater than sender's current balance)

<img width="381" height="64" alt="image" src="https://github.com/user-attachments/assets/320fa88e-8596-4dc5-823b-e7f2e5578cb5" />

---

- ### Check your current balance

<img width="379" height="54" alt="image" src="https://github.com/user-attachments/assets/5062995e-582d-4262-b8d6-0f51f0129732" />

---

- ### Logout from your account

<img width="319" height="36" alt="image" src="https://github.com/user-attachments/assets/760d1e2b-04f1-42e6-be2a-912997b8bdf5" />

---

## 👤 Author

- [Muhammad Ibnu Hasyim Asshidiq Bachdar](https://www.linkedin.com/in/muhammad-ibnu-hasyim-asshidiq-bachdar-386318312)
