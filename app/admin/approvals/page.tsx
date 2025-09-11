"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle2, XCircle, Clock, UserCheck, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface AdminRequest {
  _id: string
  name: string
  email: string
  role: string
  jobTitle?: string
  department?: string
  company?: string
  adminRequestReason: string
  adminRequestDate: string
  adminRequestStatus: "pending" | "approved" | "rejected"
  isActive: boolean
  isApproved: boolean
}

export default function AdminApprovalsStandalonePage() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }
    loadAdminRequests()
  }, [user, router])

  const loadAdminRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/approvals")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      } else {
        toast({ title: "Failed to load requests", description: "Please try again.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Failed to load requests", description: "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (requestId: string, action: "approve" | "reject") => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/approvals/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (response.ok) {
        toast({ title: `Request ${action}d`, description: `The request has been ${action}d.` })
        loadAdminRequests()
      } else {
        const err = await response.json()
        toast({ title: `Failed to ${action}`, description: err.error || "Unknown error", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: `Failed to ${action}`, description: "Network error", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const map = {
      pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", Icon: Clock },
      approved: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", Icon: CheckCircle2 },
      rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400", Icon: XCircle },
    } as const
    const { color, Icon } = map[(status as keyof typeof map) || "pending"]
    return (
      <Badge variant="outline" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => (
    <Badge variant="outline" className={role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin requests...</p>
        </div>
      </div>
    )
  }

  const pendingRequests = requests.filter(r => r.adminRequestStatus === "pending")
  const approvedRequests = requests.filter(r => r.adminRequestStatus === "approved")
  const rejectedRequests = requests.filter(r => r.adminRequestStatus === "rejected")

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
          Admin Approvals
        </h1>
        <p className="text-muted-foreground">Review and manage admin/manager access requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Access granted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Access denied</p>
          </CardContent>
        </Card>
      </div>

      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
            <CardDescription>Review and approve or reject admin access requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-sm text-muted-foreground">{request.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(request.role)}</TableCell>
                      <TableCell><span className="text-sm">{request.company || "N/A"}</span></TableCell>
                      <TableCell>
                        <span className="text-sm">{format(new Date(request.adminRequestDate), "MMM dd, yyyy")}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.adminRequestStatus)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Admin Request Details</DialogTitle>
                                <DialogDescription>Review details before making a decision.</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium">Requestor</h4>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Name:</strong> {selectedRequest.name}<br/>
                                      <strong>Email:</strong> {selectedRequest.email}<br/>
                                      <strong>Role:</strong> {selectedRequest.role}<br/>
                                      <strong>Company:</strong> {selectedRequest.company || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Reason</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.adminRequestReason}</p>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button onClick={() => handleApproval(selectedRequest._id, "approve")} disabled={isProcessing} className="flex-1">
                                      <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleApproval(selectedRequest._id, "reject")} disabled={isProcessing} className="flex-1">
                                      <XCircle className="h-4 w-4 mr-2" /> Reject
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(approvedRequests.length > 0 || rejectedRequests.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Recently approved and rejected requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...approvedRequests, ...rejectedRequests]
                    .sort((a, b) => new Date(b.adminRequestDate).getTime() - new Date(a.adminRequestDate).getTime())
                    .slice(0, 10)
                    .map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" />
                              <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{request.name}</div>
                              <div className="text-sm text-muted-foreground">{request.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(request.role)}</TableCell>
                        <TableCell>{getStatusBadge(request.adminRequestStatus)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{format(new Date(request.adminRequestDate), "MMM dd, yyyy")}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
