"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if user has admin role
    if (user && user.role !== "admin") {
      router.push("/dashboard/admin")
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
        toast({
          title: "Failed to load requests",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to load requests",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (requestId: string, action: "approve" | "reject") => {
    setIsProcessing(true)
    
    try {
      const response = await fetch(`/api/admin/approvals/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast({
          title: `Request ${action}d successfully`,
          description: `The admin request has been ${action}d.`,
        })
        loadAdminRequests() // Reload the list
      } else {
        const error = await response.json()
        toast({
          title: `Failed to ${action} request`,
          description: error.error || "An error occurred.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: `Failed to ${action} request`,
        description: "An error occurred while processing the request.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", 
        icon: Clock 
      },
      approved: { 
        color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", 
        icon: CheckCircle2 
      },
      rejected: { 
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400", 
        icon: XCircle 
      },
    }

    const config = configs[status as keyof typeof configs] || configs.pending
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const configs = {
      admin: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
      manager: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
    }

    const config = configs[role as keyof typeof configs] || configs.manager

    return (
      <Badge variant="outline" className={config.color}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Admin Approvals
          </h1>
          <p className="text-muted-foreground">
            Review and manage admin access requests.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Access granted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Access denied
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
            <CardDescription>
              Review and approve or reject admin access requests
            </CardDescription>
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
                            {request.jobTitle && (
                              <div className="text-xs text-muted-foreground">{request.jobTitle}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(request.role)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{request.company || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {format(new Date(request.adminRequestDate), "MMM dd, yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.adminRequestStatus)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Admin Request Details</DialogTitle>
                                <DialogDescription>
                                  Review the request details before making a decision.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium">Requestor Information</h4>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Name:</strong> {selectedRequest.name}<br />
                                      <strong>Email:</strong> {selectedRequest.email}<br />
                                      <strong>Role:</strong> {selectedRequest.role}<br />
                                      <strong>Company:</strong> {selectedRequest.company || "N/A"}<br />
                                      <strong>Job Title:</strong> {selectedRequest.jobTitle || "N/A"}<br />
                                      <strong>Department:</strong> {selectedRequest.department || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Reason for Access</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedRequest.adminRequestReason}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() => handleApproval(selectedRequest._id, "approve")}
                                      disabled={isProcessing}
                                      className="flex-1"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleApproval(selectedRequest._id, "reject")}
                                      disabled={isProcessing}
                                      className="flex-1"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
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

      {/* No Pending Requests */}
      {pendingRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground">
              All admin access requests have been processed.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {(approvedRequests.length > 0 || rejectedRequests.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Recently approved and rejected requests
            </CardDescription>
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
                        <span className="text-sm">
                          {format(new Date(request.adminRequestDate), "MMM dd, yyyy")}
                        </span>
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
