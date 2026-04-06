import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Joyride, { EVENTS, STATUS } from 'react-joyride'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { studentService } from '@/core/services'

export function OnboardingTour({ active, onComplete }) {
  const { updateUser } = useAuth()
  const { toast } = useToast()
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const activeTargetRef = useRef(null)
  const stepIndexRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 640px)')
    const handleChange = () => setIsMobile(mq.matches)
    handleChange()
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange)
      return () => mq.removeEventListener('change', handleChange)
    }
    mq.addListener(handleChange)
    return () => mq.removeListener(handleChange)
  }, [])

  const steps = useMemo(() => ([
    {
      id: 'social-youtube',
      target: '[data-tour="social-youtube"]',
      content: 'Step 1: Click YouTube and follow us there.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      id: 'social-x',
      target: '[data-tour="social-x"]',
      content: 'Step 2: Click X and follow for live ops updates.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'social-linkedin',
      target: '[data-tour="social-linkedin"]',
      content: 'Step 3: Click LinkedIn and follow the company page.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'social-whatsapp',
      target: '[data-tour="social-whatsapp"]',
      content: 'Step 4: Click WhatsApp and join the briefing room.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'dashboard-header',
      target: '[data-tour="dashboard-header"]',
      content: 'This is your command header for status, rank, and quick navigation.',
      placement: isMobile ? 'bottom' : 'bottom-start',
    },
    {
      id: 'overview-card',
      target: '[data-tour="overview-card"]',
      content: 'This overview shows your current module and bootcamp status at a glance.',
      placement: isMobile ? 'bottom' : 'top',
    },
    {
      id: 'quick-wallet',
      target: '[data-tour="quick-wallet"]',
      content: 'Open the CP Wallet to view transactions and manage your points.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'quick-marketplace',
      target: '[data-tour="quick-marketplace"]',
      content: 'The marketplace is where you spend CP on tools, merch, and boosts.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'quick-bootcamp',
      target: '[data-tour="quick-bootcamp"]',
      content: 'Bootcamp is where the core training happens. Click to continue.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'bootcamp-cards',
      target: '[data-tour="bootcamp-cards"]',
      content: 'All available bootcamps live here. Enroll or continue anytime.',
      placement: isMobile ? 'bottom' : 'top',
    },
    {
      id: 'nav-notifications',
      target: isMobile ? '[data-tour="topbar-notifications"]' : '[data-tour="nav-notifications"]',
      content: 'Notifications keep you updated on events and activity.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
    {
      id: 'nav-profile',
      target: isMobile ? '[data-tour="topbar-profile"]' : '[data-tour="nav-profile"]',
      content: 'Your profile is your personal account hub. Update details and security.',
      placement: isMobile ? 'bottom' : 'right',
      spotlightClicks: true,
    },
  ]), [isMobile])

  useEffect(() => {
    if (active) {
      setStepIndex(0)
      setRun(true)
      return
    }
    setRun(false)
  }, [active])

  useEffect(() => {
    stepIndexRef.current = stepIndex
  }, [stepIndex])

  useEffect(() => {
    if (!active) {
      if (activeTargetRef.current) {
        activeTargetRef.current.classList.remove('tour-target-active')
        activeTargetRef.current = null
      }
      return
    }
    const target = steps[stepIndex]?.target
    const element = target ? document.querySelector(target) : null
    if (activeTargetRef.current && activeTargetRef.current !== element) {
      activeTargetRef.current.classList.remove('tour-target-active')
      activeTargetRef.current = null
    }
    if (element) {
      element.classList.add('tour-target-active')
      activeTargetRef.current = element
    }
  }, [active, stepIndex, steps])

  useEffect(() => {
    if (!active) return undefined
    const handler = (event) => {
      const key = event?.detail?.key
      if (!key) return
      const current = steps[stepIndexRef.current]
      if (current?.id !== `social-${key}`) return
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
    }
    window.addEventListener('hsociety:onboarding-social', handler)
    return () => window.removeEventListener('hsociety:onboarding-social', handler)
  }, [active, steps])

  const completeTour = useCallback(async () => {
    try {
      await studentService.updateOnboarding({ complete: true })
      updateUser({ onboardingCompletedAt: new Date().toISOString() })
      toast({ type: 'success', message: 'Onboarding complete. Welcome aboard.' })
    } catch {
      // ignore
    } finally {
      setRun(false)
      if (onComplete) onComplete()
    }
  }, [onComplete, toast, updateUser])

  const handleCallback = useCallback((data) => {
    const { status, type, index } = data
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      completeTour()
      return
    }
    if (type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + 1)
    }
  }, [completeTour])

  if (!active) return null

  return (
    <Joyride
      continuous
      run={run}
      stepIndex={stepIndex}
      steps={steps}
      scrollToFirstStep
      showSkipButton
      showProgress
      disableOverlayClose
      callback={handleCallback}
      styles={{
        options: {
          arrowColor: 'var(--bg-card)',
          backgroundColor: 'var(--bg-card)',
          overlayColor: 'rgba(6, 8, 12, 0.7)',
          primaryColor: '#88AD7C',
          textColor: 'var(--text-primary)',
          zIndex: 2000,
        },
        tooltip: {
          borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 18,
          boxShadow: '0 18px 60px rgba(0, 0, 0, 0.35)',
        },
        spotlight: {
          borderRadius: 14,
          boxShadow: '0 0 0 2px rgba(31, 191, 143, 0.75), 0 0 24px rgba(31, 191, 143, 0.35)',
        },
        buttonNext: {
          borderRadius: 10,
          fontWeight: 600,
        },
        buttonBack: {
          color: 'var(--text-muted)',
        },
      }}
    />
  )
}
