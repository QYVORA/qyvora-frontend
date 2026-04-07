import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'

const reduceMotionQuery = '(prefers-reduced-motion: reduce)'

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(reduceMotionQuery).matches
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  as: Component = 'div',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true)
      return undefined
    }
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Component>
  )
}

export function StaggerReveal({
  children,
  className = '',
  delay = 0,
  stagger = 90,
  variant = 'up',
  as: Component = 'div',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true)
      return undefined
    }
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const items = Children.toArray(children).map((child, index) => {
    if (!isValidElement(child)) return child
    const childClass = `${child.props?.className || ''} reveal-item reveal-${variant}`.trim()
    const childStyle = {
      ...(child.props?.style || {}),
      '--reveal-index': index,
    }
    return cloneElement(child, { className: childClass, style: childStyle })
  })

  return (
    <Component
      ref={ref}
      className={`reveal-group ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-stagger': `${stagger}ms` }}
    >
      {items}
    </Component>
  )
}
