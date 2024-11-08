import {ref, unref} from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token'))

    async function api(method, url, payload = {}){
        const response = await fetch(`http://localhost:3333${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Athentication': `Bearer ${token.value}`
            },
            body: method !== 'GET' ? JSON.stringify(payload) : null
        })
    }

    return response.json()
})