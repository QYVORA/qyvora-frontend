import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Clock, Zap } from 'lucide-react'
import { Card, StatCard, Badge, Skeleton } from '@/shared/components/ui'
import { useAuth } from '@/core/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { cpService } from '@/core/services'
import { CP_COIN } from '@/features/marketing/data/landingData'

function TxRow({ tx }) {
  const isEarned = tx.type === 'earned'
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-[var(--border)] last:border-0">
      <div className={`p-2 rounded-xl shrink-0 ${isEarned ? 'bg-accent/10' : 'bg-[var(--primary-10)]'}`}>
        {isEarned
          ? <ArrowDownLeft size={16} className="text-accent" />
          : <ArrowUpRight size={16} className="text-[var(--text-primary)]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{tx.source}</p>
        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5 flex items-center gap-1">
          <Clock size={10} /> {tx.date}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-mono font-bold text-sm ${isEarned ? 'text-accent' : 'text-[var(--text-primary)]'}`}>
          {isEarned ? '+' : '-'}{tx.amount} CP
        </p>
        <Badge variant={isEarned ? 'success' : 'danger'} className="mt-0.5">
          {isEarned ? 'Earned' : 'Spent'}
        </Badge>
      </div>
    </div>
  )
}

export default function WalletPage() {
  const { user, updateUser } = useAuth()
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [balRes, txRes] = await Promise.all([
          cpService.getBalance(),
          cpService.getTransactions(20),
        ])
        if (!mounted) return
        setBalance(balRes.data || null)
        setTransactions(txRes.data?.items || [])
        if (balRes.data?.balance !== undefined) {
          updateUser({ cpPoints: balRes.data.balance })
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  const earnedTx = transactions.filter(t => Number(t.points || 0) > 0)
  const spentTx = transactions.filter(t => Number(t.points || 0) < 0)
  const totalEarned = earnedTx.reduce((a, t) => a + Number(t.points || 0), 0)
  const totalSpent = spentTx.reduce((a, t) => a + Math.abs(Number(t.points || 0)), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">CP Wallet</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Your Captured Points balance and transaction history.</p>
      </div>

      {/* Balance hero */}
      <div className="card border-accent/20 p-8 relative overflow-hidden isolate">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-10 w-40 h-40 opacity-20 pointer-events-none">
          <img src={CP_COIN} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Current Balance</p>
              {loading ? (
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <p className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-accent mt-2 glow-text">
                  {Number(balance?.balance ?? user?.cpPoints ?? 0).toLocaleString()}
                  <span className="text-base sm:text-xl text-[var(--text-secondary)] ml-2">CP</span>
                </p>
              )}
            </div>
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
              <Wallet size={28} className="text-accent" />
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Earn CP by completing modules, phases, and challenges. Spend in the marketplace.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </Card>
          ))
        ) : (
          <>
            <StatCard label="Total Earned" value={totalEarned.toLocaleString()} sub="All time" icon={TrendingUp} color="var(--accent)" />
            <StatCard label="Total Spent" value={totalSpent.toLocaleString()} sub="All time" icon={ArrowUpRight} color="var(--primary)" />
            <StatCard label="Net Balance" value={Number(balance?.balance ?? user?.cpPoints ?? 0).toLocaleString()} sub="Available now" icon={Zap} color="var(--accent)" />
          </>
        )}
      </div>

      {/* Transaction history */}
      <Card>
        <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Clock size={16} className="text-accent" />
          Transaction History
        </h3>
        <div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-4 border-b border-[var(--border)] last:border-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-sm text-[var(--text-secondary)]">No transactions yet.</div>
          ) : (
            transactions.map(tx => (
              <TxRow key={tx._id || tx.id} tx={{
                id: tx._id || tx.id,
                type: Number(tx.points || 0) > 0 ? 'earned' : 'spent',
                amount: Math.abs(Number(tx.points || 0)),
                source: tx.note || tx.type || 'CP activity',
                date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—',
              }} />
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
