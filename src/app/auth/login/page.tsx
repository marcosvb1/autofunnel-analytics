import LoginForm from '@/components/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md p-4">
        <LoginForm />
        <p className="mt-6 text-center text-sm text-text-tertiary">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary-hover font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}