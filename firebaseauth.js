// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC5eyBjpVFpGU4rMNackwl0aVULbq5URNE",
    authDomain: "beauty-shop-e7176.firebaseapp.com",
    projectId: "beauty-shop-e7176",
    storageBucket: "beauty-shop-e7176.appspot.com",
    messagingSenderId: "221917266718",
    appId: "1:221917266718:web:98c3d1f330b512b8cc7f0f"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
