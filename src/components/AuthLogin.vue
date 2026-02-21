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

    <button @click="createFarm" class="bg-purple-600 text-white rounded px-4 py-2">
      Create Test Farm
    </button>

    <p v-if="message" class="text-sm text-center">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { signIn, signUp } from '@/lib/auth'

const email = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

async function handleSignIn() {
  if (!email.value || !password.value) return
  loading.value = true
  message.value = ''

  const { error } = await signIn(email.value, password.value)
  message.value = error ? error.message : 'Signed in!'
  loading.value = false
}

async function handleSignUp() {
  if (!email.value || !password.value) return
  loading.value = true
  message.value = ''

  const { error } = await signUp(email.value, password.value)
  message.value = error ? error.message : 'Account created!'
  loading.value = false
}

async function createFarm() {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return

  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data, error } = await supabase
    .from('farms')
    .insert({
      name: 'My First Farm',
      code,
      created_by: userData.user.id,
    })
    .select()
    .single()

  if (error) {
    console.log('Farm insert error:', error)
    return
  }

  const { error: memberError } = await supabase.from('farm_members').insert({
    farm_id: data.id,
    user_id: userData.user.id,
    role: 'admin',
  })

  console.log('Farm created:', data, memberError)
}
</script>
