<template>
  <div class="flex flex-col gap-3 max-w-sm mx-auto mt-20">
    <template v-if="mode === 'login'">
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

      <button @click="handleForgotPassword" :disabled="loading" class="text-sm underline">
        Forgot password?
      </button>
    </template>

    <template v-else-if="mode === 'forgot'">
      <input v-model="email" type="email" placeholder="Email" class="border rounded px-3 py-2" />

      <button
        @click="handleSendReset"
        :disabled="loading"
        class="bg-amber-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {{ loading ? 'Loading...' : 'Send Reset Email' }}
      </button>

      <button @click="backToLogin" :disabled="loading" class="text-sm underline">
        Back to login
      </button>
    </template>

    <template v-else>
      <input
        v-model="newPassword"
        type="password"
        placeholder="New password"
        class="border rounded px-3 py-2"
      />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        class="border rounded px-3 py-2"
      />

      <button
        @click="handleUpdatePassword"
        :disabled="loading"
        class="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {{ loading ? 'Loading...' : 'Update Password' }}
      </button>
    </template>

    <p v-if="message" class="text-sm text-center">
      {{ message }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { requestPasswordReset, signIn, signUp, updatePassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const route = useRoute()

const email = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)
const mode = ref<'login' | 'forgot' | 'reset'>('login')

let unsubscribeAuth: (() => void) | null = null

onMounted(() => {
  if (route.query.mode === 'reset') {
    mode.value = 'reset'
    message.value = 'Enter your new password.'
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      mode.value = 'reset'
      message.value = 'Enter your new password.'
    }
  })

  unsubscribeAuth = () => {
    subscription.unsubscribe()
  }
})

onUnmounted(() => {
  unsubscribeAuth?.()
})

async function handleSignIn() {
  if (!email.value || !password.value) return

  loading.value = true
  message.value = ''

  const { error } = await signIn(email.value, password.value)

  if (error) {
    message.value = error.message
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
    message.value = 'Account created. Check your email if confirmation is required.'
  }

  loading.value = false
}

function handleForgotPassword() {
  message.value = ''
  mode.value = 'forgot'
}

function backToLogin() {
  message.value = ''
  mode.value = 'login'
}

async function handleSendReset() {
  if (!email.value) return

  loading.value = true
  message.value = ''

  const { error } = await requestPasswordReset(email.value)

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Password reset email sent.'
  }

  loading.value = false
}

async function handleUpdatePassword() {
  if (!newPassword.value || !confirmPassword.value) return

  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  message.value = ''

  const { error } = await updatePassword(newPassword.value)

  if (error) {
    message.value = error.message
    loading.value = false
    return
  }

  message.value = 'Password updated successfully.'
  loading.value = false
}
</script>
