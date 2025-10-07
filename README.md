# Password Generator (Rough UI)

A secure and easy-to-use web application to generate strong passwords and save them safely in a personal vault. Built with **Next.js**, **Mongodb**, **Tailwind CSS** and **Secure MVP Vault** .This project demonstrates full-stack development skills, local storage handling, and user authentication.


---

## 🚀 Features

1. Enter / edit password  
2. Checkboxes: Include Uppercase, Numbers, Symbols  
3. Password length slider  
4. Generate button  
5. Generated password display  
6. Copy to clipboard
7. Save to Vault 

---

## 💻 Tech Stack

- **Frontend:** Next.js (App Router)  
- **Styling:** Tailwind CSS  
- **Language:** JavaScript (React)


---

## ⚡ How to Run Locally

1. Install Dependencies
```
npx create-next-app@latest
```
```
✔ Would you like to use TypeScript? … No
✔ Would you like to use ESLint? … Yes ✅
✔ Would you like to use Tailwind CSS? … Yes  ✅
✔ Would you like to use `src/` directory? … No 
✔ App Router or Pages Router? … yes ✅
✔ Would you like to customize the default import alias (@/*)? … No
```

2. The structure of folder 

```
password-vault/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.js        ✅ our backend auth route
│   │   ├── vault/
│   │   │   └── route.js        ✅ vault CRUD route
│   ├── page.js                 ✅ main page
│
├── components/
│   └── AuthForm.js             ✅ login/signup component
│
├── lib/
│   └── db.js                   ✅ mongoose connection
│
├── models/
│   └── User.js                  ✅ mongoose model
        Vault.js               
│
├── package.json
└── next.config.mjs
```


3. Install dependencies
```
npm install
```

4. Run the Development Server
```
npm run dev 
```

5. Open in browser: http://localhost:3000


---

## How it Works

**Step 1** : Signup with Email and Password then Login
**Step 2** : Enter any letters of your name and other 
**Step 3** : Click Checkboxes which you want
**Step 4** : Select Length of Your Password using Length slider
**Step 5**: Click **Generate Password** Button
**Step 6** : You see your Generated password in below Box
**Step 7** : You are able to Copy or Save your password in vault

##Screenshots 


