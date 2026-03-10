<template>
  <div class="max-w-md mx-auto mt-20 px-4">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="block text-center mb-6">
        <img src="/images/main-logo.png" alt="Stardew Valley Logo" class="mx-auto mb-4 w-2/3" />
        <h1 class="text-lg font-stardew-bold text-white">CO-OP COMPANION</h1>
      </RouterLink>

      <div class="border-menu grad-amber rounded-lg p-6 shadow-xl space-y-4">
        <template v-if="mode === 'login'">
          <form @submit.prevent="handleSignIn" class="space-y-3">
            <h2 class="text-2xl font-stardew-thin text-orange-950 text-center">Welcome, Farmer</h2>

            <input
              v-model="email"
              type="email"
              placeholder="Email"
              autofocus
              autocomplete="email"
              class="w-full border-menu bg-amber-50 rounded px-3 py-2 text-orange-950 placeholder:text-orange-700"
            />

            <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              class="w-full border-menu bg-amber-50 rounded px-3 py-2 text-orange-950 placeholder:text-orange-700"
            />

            <div class="space-y-2 pt-2">
              <button
                type="submit"
                :disabled="loading || !email || !password"
                class="w-full border-menu grad-green py-2 px-4 font-stardew-bold text-green-950 stardew-btn disabled:opacity-50"
              >
                {{ loading ? 'Loading...' : 'Sign In' }}
              </button>

              <button
                @click="handleSignUp"
                :disabled="loading || !email || !password"
                class="w-full border-menu grad-blue py-2 px-4 font-stardew-bold text-blue-950 stardew-btn disabled:opacity-50"
              >
                {{ loading ? 'Loading...' : 'Create Account' }}
              </button>

              <button
                @click="handleForgotPassword"
                :disabled="loading"
                class="w-full text-sm font-stardew-bold text-orange-950 underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </template>

        <template v-else-if="mode === 'forgot'">
          <h2 class="text-2xl font-stardew-thin text-orange-950 text-center">Reset Password</h2>

          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full border-menu bg-amber-50 rounded px-3 py-2 text-orange-950 placeholder:text-orange-700"
          />

          <button
            @click="handleSendReset"
            :disabled="loading"
            class="w-full border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Send Reset Email' }}
          </button>

          <button
            @click="backToLogin"
            :disabled="loading"
            class="w-full text-sm font-stardew-bold text-orange-950 underline underline-offset-2 disabled:opacity-50"
          >
            Back to login
          </button>
        </template>

        <template v-else>
          <h2 class="text-2xl font-stardew-bold text-orange-950 text-center">
            Choose New Password
          </h2>

          <div class="space-y-1">
            <input
              v-model="newPassword"
              type="password"
              placeholder="New password"
              class="w-full border-menu bg-amber-50 rounded px-3 py-2 text-orange-950 placeholder:text-orange-700"
            />

            <p class="text-xs text-orange-950/80 px-1">
              Use 8+ characters with a letter and a number.
            </p>
          </div>

          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            class="w-full border-menu bg-amber-50 rounded px-3 py-2 text-orange-950 placeholder:text-orange-700"
          />

          <button
            @click="handleUpdatePassword"
            :disabled="loading"
            class="w-full border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Update Password' }}
          </button>
        </template>

        <p
          v-if="message"
          class="text-sm text-center font-stardew-bold"
          :class="
            message.toLowerCase().includes('success') || message.toLowerCase().includes('sent')
              ? 'text-green-900'
              : 'text-red-900'
          "
        >
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  getPasswordValidationMessage,
  requestPasswordReset,
  signIn,
  signUp,
  updatePassword,
} from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { buildFlashQuery } from '@/lib/flash'

const route = useRoute()
const router = useRouter()

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

  const validationMessage = getPasswordValidationMessage(password.value)
  if (validationMessage) {
    message.value = validationMessage
    return
  }

  loading.value = true
  message.value = ''

  const { error } = await signUp(email.value, password.value)

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Check your email to verify your account.'
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

  const validationMessage = getPasswordValidationMessage(newPassword.value)
  if (validationMessage) {
    message.value = validationMessage
    return
  }

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

  await router.replace({
    path: '/account',
    query: buildFlashQuery(
      {},
      {
        type: 'success',
        message: 'Password updated successfully.',
      },
    ),
  })
}
</script>
