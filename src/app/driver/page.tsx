import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/auth/actions'

export default async function DriverDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'driver' && profile?.role !== 'admin') {
    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <h1 className="text-xl font-bold text-green-600">CabApp Driver</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {profile.full_name || user.email} (Driver)
          </span>
          <form action={logout}>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Driver Dashboard</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Available Jobs</h3>
              <p className="mt-2 text-sm text-gray-500">
                Check for new ride requests in your area.
              </p>
              <Button className="mt-4 w-full bg-green-600">View Jobs</Button>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Earnings</h3>
              <p className="mt-2 text-sm text-gray-500">
                Track your daily and monthly earnings.
              </p>
              <Button variant="outline" className="mt-4 w-full">View Stats</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
