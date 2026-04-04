import { useCallback, useEffect, useMemo, useState } from 'react'
import Joyride, { EVENTS, STATUS } from 'react-joyride'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { studentService } from '@/core/services'

export function OnboardingTour({ active, onComplete }) {
  const { updateUser } = useAuth()
  const { toast } = useToast()
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => ([
    {
      target: '[data-tour="onboarding-welcome"]',
      content: 'Welcome to HSOCIETY. Follow the crew, then we will walk the platform together.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard-header"]',
      content: 'Your dashboard is the command center for progress, status, and quick wins.',
      placement: 'bottom-start',
    },
    {
      target: '[data-tour="overview-card"]',
      content: 'This overview shows your current module and bootcamp status at a glance.',
      placement: 'top',
    },
    {
      target: '[data-tour="quick-wallet"]',
      content: 'Open the CP Wallet to view transactions and manage your points.',
      placement: 'right',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="quick-marketplace"]',
      content: 'The marketplace is where you spend CP on tools, merch, and boosts.',
      placement: 'right',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="quick-bootcamp"]',
      content: 'Bootcamp is where the core training happens. Click to continue.',
      placement: 'right',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="bootcamp-cards"]',
      content: 'All available bootcamps live here. Enroll or continue anytime.',
      placement: 'top',
    },
    {
      target: '[data-tour="nav-notifications"]',
      content: 'Notifications keep you updated on events and activity.',
      placement: 'right',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="nav-profile"]',
      content: 'Your profile is your personal account hub. Update details and security.',
      placement: 'right',
      spotlightClicks: true,
    },
  ]), [])

  useEffect(() => {
    if (active) {
      setStepIndex(0)
      setRun(true)
      return
    }
    setRun(false)
  }, [active])

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
          arrowColor: '#0f141b',
          backgroundColor: '#0f141b',
          overlayColor: 'rgba(6, 8, 12, 0.72)',
          primaryColor: '#0EA5E9',
          textColor: '#f8fafc',
          zIndex: 2000,
        },
        tooltip: {
          borderRadius: 16,
          padding: 18,
        },
        buttonNext: {
          borderRadius: 10,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#94a3b8',
        },
      }}
    />
  )
}
