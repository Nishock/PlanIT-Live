"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, Shield, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminRequest {
  id: string
  name: string
  email: string
  company: string
  status: "pending" | "approved" | "rejected"
  reason?: string
  createdAt: string
  approvedAt?: string
  approvedBy?: {
    name: string
    email: string
  }
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin-requests")
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/enterprise-login")
          return
        }
        throw new Error("Failed to fetch requests")
      }

      const data = await response.json()
      setRequests(data)
    } catch (err) {
      setError("Failed to load admin requests")
      console.error("Error fetching requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (requestId: string, action: "accept" | "reject") => {
    try {
      setProcessing(requestId)
      const response = await fetch(`/api/admin-requests/${requestId}/${action}`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`)
      }

      const data = await response.json()
      
      toast({
        title: `Request ${action}ed`,
        description: data.message,
      })

      // Refresh the requests list
      await fetchRequests()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Action failed",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                Admin Requests
              </h1>
              <p className="text-gray-600 mt-2">
                Manage company admin access requests
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchRequests}
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await fetch("/api/enterprise-logout", { method: "POST" })
                    router.push("/enterprise-login")
                  } catch (error) {
                    console.error("Logout error:", error)
                  }
                }}
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Access Requests ({requests.length})
            </CardTitle>
            <CardDescription>
              Review and manage admin access requests from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">There are no admin access requests to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.company}</TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAction(request.id, "accept")}
                                disabled={processing === request.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processing === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(request.id, "reject")}
                                disabled={processing === request.id}
                              >
                                {processing === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {request.approvedBy && (
                                <div>
                                  {request.status === "approved" ? "Approved" : "Rejected"} by{" "}
                                  {request.approvedBy.name}
                                  {request.approvedAt && (
                                    <div className="text-xs">
                                      {formatDate(request.approvedAt)}
                                    </div>
                                  )}
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
