<template>
  <div class="flex flex-col gap-3 max-w-sm mx-auto mt-20">
    <input v-model="email" type="email" placeholder="Email" class="border rounded px-3 py-2" />

    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="border rounded px-3 py-2"
    />

    <button
      @click="handleSignIn"
      :disabled="loading"
      class="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
    >
      {{ loading ? 'Loading...' : 'Sign In' }}
    </button>

    <button
      @click="handleSignUp"
      :disabled="loading"
      class="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
    >
      {{ loading ? 'Loading...' : 'Create Account' }}
    </button>

    <p v-if="message" class="text-sm text-center">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signIn, signUp } from '@/lib/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

async function handleSignIn() {
  if (!email.value || !password.value) return

  loading.value = true
  message.value = ''

  const { error } = await signIn(email.value, password.value)

  if (error) {
    message.value = error.message
  } else {
    router.push('/account')
  }

  loading.value = false
}

async function handleSignUp() {
  if (!email.value || !password.value) return

  loading.value = true
  message.value = ''

  const { error } = await signUp(email.value, password.value)

  if (error) {
    message.value = error.message
  } else {
    router.push('/account')
  }

  loading.value = false
}
</script>
