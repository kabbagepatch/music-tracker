import { ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: 'habitsapi-426700.firebaseapp.com',
  projectId: 'habitsapi-426700',
  storageBucket: 'habitsapi-426700.appspot.com',
  messagingSenderId: '472591136365',
  appId: '1:472591136365:web:6129ffd560b9c66e7cf164',
  measurementId: 'G-TF2VLVQTLR'
};

const firebaseApp = initializeApp(firebaseConfig);

export const currentUser = ref<User | null>(null);
export const userLoaded = ref(false)
onAuthStateChanged(getAuth(), user => {
  currentUser.value = user;
  userLoaded.value = true;
});

export default firebaseApp;
