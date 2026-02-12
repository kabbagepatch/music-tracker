<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { currentUser, userLoaded } from '../firebaseApp';
import { signIn, signUp } from '../services/users';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const router = useRouter();

if (userLoaded.value && currentUser.value) {
  router.replace('/');
}

const state = ref<'Log in' | 'Sign up'>('Log in');
const name = ref('');
const email = ref('');
const password = ref('');
const password2 = ref('');
const error = ref('');

const toggleState = () => {
  state.value = state.value === 'Log in' ? 'Sign up' : 'Log in';
}

const submitForm = async (e: SubmitEvent) => {
  e.preventDefault();
  if (!email.value || !password.value || (state.value === 'Sign up' && (!name.value || !password2.value))) {
    error.value = 'Please enter all the fields';
    return;
  }
  if (!email.value.match(EMAIL_REGEX)) {
    error.value = 'Please enter a valid email';
    return;
  }
  if (state.value === 'Sign up' && password !== password2) {
    error.value = 'Passwords do not match';
    return;
  }

  try {
    if (state.value === 'Log in') {
      await signIn(email.value, password.value);
    } else {
      await signUp(email.value, password.value, name.value);
    }

    router.replace('/');
  } catch (e: any) {
    error.value = 'There was an error logging in';
  }
}

const fieldUpdate = () => {
  error.value = '';
}

</script>

<template>
  <div class="container">
    <h2>{{ state }}</h2>
    <form @submit="submitForm">
      <input v-if="state === 'Sign up'" v-model="name" @focus="fieldUpdate" class="field" type="text" id="email" name="email" required placeholder="Name" />
      <input v-model="email" @focus="fieldUpdate" class="field" type="text" id="email" name="email" required placeholder="Email" />
      <input v-model="password" @focus="fieldUpdate" class="field" type="password" id="password" name="password" required placeholder="Password" />
      <input v-if="state === 'Sign up'" v-model="password2" @focus="fieldUpdate" class="field" type="password" id="password" name="password" required placeholder="Repeat Password" />
      <button class="submit" type="submit">{{ state }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="state === 'Sign up'">Have an account already? <a href="#" @click="toggleState">Log in</a></p>
    <p v-else>Don't Have an Account? <a href="#" @click="toggleState">Sign Up</a></p>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
  }

  h2 {
    text-transform: uppercase;
  }

  form {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 15px;
    width: 80%;
  }

  .field {
    height: 50px;
    padding: 0 15px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid white;
  }

  button.submit {
    margin: 8px 0;
    font-size: 16px;
    text-transform: uppercase;
  }

  p {
    margin-top: 10px;
    margin-bottom: 0px;
  }

  p.error {
    color: red;
  }
</style>