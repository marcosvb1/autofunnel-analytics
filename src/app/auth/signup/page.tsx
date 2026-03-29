import SignupForm from '@/components/auth/signup-form'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md p-4">
        <SignupForm />
        <p className="mt-6 text-center text-sm text-text-tertiary">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}