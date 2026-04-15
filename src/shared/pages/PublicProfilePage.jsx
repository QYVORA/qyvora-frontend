import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Skeleton } from '@/shared/components/ui'
import api from '@/core/services/api'

export default function PublicProfilePage() {
  const { handle } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get(`/public/users/${encodeURIComponent(handle || '')}`)
        if (!mounted) return
        setProfile(res.data || null)
      } catch (err) {
        if (!mounted) return
        setProfile(null)
        setError(err?.response?.status === 404 ? 'Profile not found.' : 'Failed to load profile.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [handle])

  return (
    <section className="py-28 px-6 min-h-[70vh]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// public profile</p>
          <h1 className="font-mono font-black text-4xl text-[var(--text-primary)]">
            @{handle}
          </h1>
        </div>

        {loading ? (
          <Card className="p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          </Card>
        ) : error ? (
          <Card className="p-6">
            <p className="text-sm text-[var(--text-secondary)]">{error}</p>
            <Link to="/" className="btn-secondary inline-flex mt-4">Back Home</Link>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="border border-[var(--border)] p-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Name</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{profile?.name || 'Operator'}</p>
                </div>
                <div className="border border-[var(--border)] p-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Profile</p>
                  <p className="text-sm text-accent mt-1">@{profile?.handle || handle}</p>
                </div>
                <div className="border border-[var(--border)] p-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">CP</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{Number(profile?.cpPoints || 0).toLocaleString()}</p>
                </div>
                <div className="border border-[var(--border)] p-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Role</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{profile?.role || 'student'}</p>
                </div>
                <div className="border border-[var(--border)] p-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Rank</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{profile?.rank || 'Operator'}</p>
                </div>
                <div className="border border-[var(--border)] p-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Rooms Completed</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{Number(profile?.completedRoomsCount || 0)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Completed Rooms</p>
              {!Array.isArray(profile?.completedRooms) || profile.completedRooms.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No completed rooms yet.</p>
              ) : (
                <div className="space-y-2">
                  {profile.completedRooms.map((room) => (
                    <div key={room.id} className="border border-[var(--border)] p-3">
                      <p className="text-sm text-[var(--text-primary)]">{room.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{room.level || '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </section>
  )
}

