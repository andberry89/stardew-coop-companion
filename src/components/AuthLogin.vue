<template>
  <div class="flex flex-col gap-3 max-w-sm mx-auto mt-20">
    <input
      v-model="email"
      type="email"
      placeholder="Enter your email"
      class="border rounded px-3 py-2"
    />

    <button
      @click="handleLogin"
      :disabled="loading"
      class="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
    >
      {{ loading ? 'Sending...' : 'Send Magic Link' }}
    </button>

    <p v-if="message" class="text-sm text-center">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmail } from '@/lib/auth'

const email = ref('')
const loading = ref(false)
const message = ref('')

async function handleLogin() {
  if (!email.value) return

  loading.value = true
  message.value = ''

  const { error } = await signInWithEmail(email.value)

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Check your email for the login link.'
  }

  loading.value = false
}
</script>
