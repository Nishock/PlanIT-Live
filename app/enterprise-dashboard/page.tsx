"use client"

import useSWR from "swr"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, Shield, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  return res.json()
})

type RequestItem = {
  id: string
  name: string
  email: string
  company: string
  roleRequested: "admin" | "manager"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  approvedAt?: string
  approvedBy?: { name: string; email: string }
}

export default function EnterpriseDashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { data, error, isLoading, mutate } = useSWR<RequestItem[]>("/api/admin-requests", fetcher, { revalidateOnFocus: true })

  const requests = (data || []).filter((r) => {
    const q = query.trim().toLowerCase()
    const matchesQ = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.roleRequested.toLowerCase().includes(q)
    const inDateRange = (!dateFrom || new Date(r.createdAt) >= new Date(dateFrom)) && (!dateTo || new Date(r.createdAt) <= new Date(dateTo))
    return matchesQ && inDateRange
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleString()

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      setProcessingId(id)
      const res = await fetch(`/api/admin-requests/${id}/${action}`, { method: "PATCH" })
      if (!res.ok) throw new Error(`Failed to ${action} request`)
      const json = await res.json()
      toast({ title: `Request ${action}ed`, description: json.message })
      await mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Action failed", variant: "destructive" })
      if (e?.message?.includes("401")) router.push("/company-login")
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading enterprise dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>Failed to load dashboard.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />Enterprise Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage all Admin/Manager access requests</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => mutate()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />Refresh
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Search name/email/company/role" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Access Requests ({requests.length})</CardTitle>
            <CardDescription>Review and manage requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">Try adjusting filters or refresh.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requester</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role Requested</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.company}</TableCell>
                        <TableCell className="capitalize">{r.roleRequested}</TableCell>
                        <TableCell>{formatDate(r.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(r.status)}</TableCell>
                        <TableCell>
                          {r.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleAction(r.id, "accept")} disabled={processingId === r.id} className="bg-green-600 hover:bg-green-700">
                                {processingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleAction(r.id, "reject")} disabled={processingId === r.id}>
                                {processingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {r.approvedBy && (
                                <div>
                                  {r.status === "approved" ? "Approved" : "Rejected"} by {r.approvedBy.name}
                                  {r.approvedAt && (<div className="text-xs">{formatDate(r.approvedAt)}</div>)}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
