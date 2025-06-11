export const config = {
  BACKEND_API_URL: 'http://localhost:3002',
  AUTH_API_URL: 'http://localhost:3000',
  STRIPE_PUBLIC_KEY: process.env.VITE_STRIPE_PUBLIC_KEY || ''
}; 