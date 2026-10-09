import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}

export function Reveal({ children, className = '', as: Tag = 'div' }: Props) {
  return <Tag className={className}>{children}</Tag>
}
