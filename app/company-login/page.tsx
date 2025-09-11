"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CompanyLoginAlias() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/enterprise-login')
  }, [router])
  return null
}
