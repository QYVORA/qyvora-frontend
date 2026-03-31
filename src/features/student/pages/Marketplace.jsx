import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { useModal } from '@/core/contexts/ModalContext'
import { cpService, marketplaceService } from '@/core/services'
import { MarketplaceHeader } from '@/features/student/components/marketplace/MarketplaceHeader'
import { MarketplaceFilters } from '@/features/student/components/marketplace/MarketplaceFilters'
import { MarketplaceGrid } from '@/features/student/components/marketplace/MarketplaceGrid'

export default function MarketplacePage() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasedIds, setPurchasedIds] = useState(() => new Set())
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const { openModal } = useModal()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [itemsRes, txRes] = await Promise.all([
          marketplaceService.getItems(),
          cpService.getTransactions(200),
        ])
        if (!mounted) return
        setItems(itemsRes.data?.items || [])
        const purchases = (txRes.data?.items || [])
          .filter(tx => tx.type === 'purchase' && tx.productId)
          .map(tx => String(tx.productId))
        setPurchasedIds(new Set(purchases))
      } catch {
        setItems([])
        setPurchasedIds(new Set())
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => {
    const unique = new Set(items.map(i => i.type || 'General'))
    return ['All', ...Array.from(unique)]
  }, [items])

  const filtered = items.filter(item => {
    const itemCategory = item.type || 'General'
    const matchCat = category === 'All' || itemCategory === category
    const matchSearch = (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleBuy = (item) => {
    const cp = user?.cpPoints ?? user?.cp ?? 0
    if (cp < item.cpPrice) {
      toast({ type: 'error', title: 'Insufficient CP', message: `You need ${item.cpPrice - cp} more CP to purchase this.` })
      return
    }
    openModal({
      title: 'Confirm Purchase',
      badge: 'MARKETPLACE',
      description: `You're about to purchase "${item.title}" for ${item.cpPrice.toLocaleString()} CP. This action cannot be undone.`,
      confirmLabel: `Buy for ${item.cpPrice} CP`,
      cancelLabel: 'Cancel',
      onConfirm: () => {
        cpService.purchase(item._id || item.id)
          .then((res) => {
            const nextBalance = res.data?.balance
            if (nextBalance !== undefined) updateUser({ cpPoints: nextBalance })
            setPurchasedIds(prev => {
              const next = new Set(prev)
              next.add(String(item._id || item.id))
              return next
            })
            toast({ type: 'success', title: 'Purchase successful!', message: `"${item.title}" has been added to your library.` })
          })
          .catch((err) => {
            toast({ type: 'error', title: 'Purchase failed', message: err?.response?.data?.error || 'Please try again.' })
          })
      },
      onCancel: () => {},
    })
  }

  const handleDownload = (item) => {
    cpService.download(item._id || item.id)
      .then((res) => {
        const contentDisposition = res.headers?.['content-disposition'] || ''
        const match = contentDisposition.match(/filename="([^"]+)"/)
        const filename = match?.[1] || `${item.title || 'cp-product'}.pdf`
        const blob = new Blob([res.data], { type: res.data?.type || 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
      .catch((err) => {
        toast({ type: 'error', message: err?.response?.data?.error || 'Download failed.' })
      })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <MarketplaceHeader cp={user?.cpPoints ?? user?.cp} />
      <MarketplaceFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />
      <MarketplaceGrid
        items={filtered}
        user={user}
        onBuy={handleBuy}
        onDownload={handleDownload}
        purchasedIds={purchasedIds}
        loading={loading}
      />
    </div>
  )
}
