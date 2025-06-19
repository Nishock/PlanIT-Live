"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  MoreHorizontal,
  Users,
  UserPlus,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Trash2,
  Shield,
  Crown,
  User,
  Eye,
  Settings,
  Activity,
  TrendingUp,
  Loader2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "manager" | "member" | "guest"
  jobTitle?: string
  department?: string
  phone?: string
  location?: string
  joinedAt: string
  lastActive?: string
  isActive: boolean
  tasksAssigned: number
  tasksCompleted: number
  projectsCount: number
  workspaces: string[]
  status: "online" | "away" | "offline"
}

interface InviteData {
  email: string
  role: "admin" | "manager" | "member" | "guest"
  workspaces: string[]
  message?: string
}

interface EditMemberData {
  name: string
  jobTitle: string
  department: string
  phone: string
  location: string
  role: string
}

export default function TeamPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [inviteData, setInviteData] = useState<InviteData>({
    email: "",
    role: "member",
    workspaces: [],
    message: "",
  })
  const [editData, setEditData] = useState<EditMemberData>({
    name: "",
    jobTitle: "",
    department: "",
    phone: "",
    location: "",
    role: "",
  })
  const [pendingInvites, setPendingInvites] = useState<any[]>([])
  const [loadingInvites, setLoadingInvites] = useState(false)

  const workspaceId = members[0]?.workspaces?.[0] || ""

  useEffect(() => {
    fetchTeamMembers()
    fetchPendingInvites()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/team/members", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) throw new Error("Failed to fetch team members")
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingInvites = async () => {
    if (!workspaceId) return
    setLoadingInvites(true)
    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`/api/team/invite?workspaceId=${workspaceId}`, {
        headers: { "Authorization": `Bearer ${token}` },
        credentials: "include",
      })
      const data = await res.json()
      setPendingInvites(data.invites || [])
    } catch (error) {
      setPendingInvites([])
    } finally {
      setLoadingInvites(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteData.email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    try {
      setIsInviting(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(inviteData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send invitation")
      }

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteData.email}`,
      })

      setInviteData({ email: "", role: "member", workspaces: [], message: "" })
      setIsInviteDialogOpen(false)
      fetchTeamMembers()
    } catch (error: any) {
      console.error("Error inviting member:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setEditData({
      name: member.name,
      jobTitle: member.jobTitle || "",
      department: member.department || "",
      phone: member.phone || "",
      location: member.location || "",
      role: member.role,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateMember = async () => {
    if (!selectedMember) return

    try {
      setIsUpdating(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/team/members/${selectedMember.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) throw new Error("Failed to update member")

      toast({
        title: "Member updated",
        description: "Member information has been updated successfully",
      })

      setIsEditDialogOpen(false)
      setSelectedMember(null)
      fetchTeamMembers()
    } catch (error) {
      console.error("Error updating member:", error)
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/team/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error("Failed to remove member")

      toast({
        title: "Member removed",
        description: "Team member has been removed successfully",
      })

      fetchTeamMembers()
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (memberId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/team/members/${memberId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast({
        title: "Status updated",
        description: `Member has been ${!isActive ? "activated" : "deactivated"}`,
      })

      fetchTeamMembers()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive",
      })
    }
  }

  const filteredMembers = members.filter((member) => {
    if (
      searchQuery &&
      !member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !member.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !member.department?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (activeTab !== "all") {
      if (activeTab === "active" && !member.isActive) return false
      if (activeTab === "inactive" && member.isActive) return false
      if (activeTab === "online" && member.status !== "online") return false
      if (activeTab !== "active" && activeTab !== "inactive" && activeTab !== "online" && member.role !== activeTab)
        return false
    }

    return true
  })

  const getRoleBadge = (role: string) => {
    const configs = {
      owner: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400", icon: Crown },
      admin: { color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400", icon: Shield },
      manager: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", icon: Briefcase },
      member: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", icon: User },
      guest: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", icon: Eye },
    }

    const config = configs[role as keyof typeof configs]
    const Icon = config?.icon || User

    return (
      <Badge variant="outline" className={config?.color}>
        <Icon className="h-3 w-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
          <UserX className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      )
    }

    const configs = {
      online: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", icon: CheckCircle2 },
      away: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: Clock },
      offline: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", icon: AlertCircle },
    }

    const config = configs[status as keyof typeof configs]
    const Icon = config?.icon || AlertCircle

    return (
      <Badge variant="outline" className={config?.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    )
  }

  const getTeamStats = () => {
    const total = members.length
    const active = members.filter((m) => m.isActive).length
    const online = members.filter((m) => m.status === "online").length
    const admins = members.filter((m) => m.role === "admin" || m.role === "owner").length
    const avgTasks = members.reduce((sum, m) => sum + m.tasksCompleted, 0) / total || 0

    return { total, active, online, admins, avgTasks }
  }

  const stats = getTeamStats()

  const handleRevokeInvite = async (inviteId: string) => {
    const token = localStorage.getItem("auth_token")
    await fetch(`/api/team/invite?inviteId=${inviteId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
      credentials: "include",
    })
    toast({ title: "Invite revoked" })
    fetchPendingInvites()
  }

  const handleResendInvite = async (inviteId: string) => {
    const token = localStorage.getItem("auth_token")
    await fetch(`/api/team/invite/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ inviteId }),
    })
    toast({ title: "Invite resent" })
    fetchPendingInvites()
  }

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage your team members, roles, and permissions</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-11 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team with specific role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">Email Address *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData({ ...inviteData, role: value as any })}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                    <SelectItem value="manager">Manager - Team management</SelectItem>
                    <SelectItem value="member">Member - Standard access</SelectItem>
                    <SelectItem value="guest">Guest - Limited access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                <Textarea
                  id="invite-message"
                  value={inviteData.message}
                  onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                  placeholder="Add a personal message to the invitation..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember} disabled={!inviteData.email || isInviting}>
                {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.online}</p>
              </div>
              <Activity className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{Math.round(stats.avgTasks)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/25 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members by name, email, or department..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-12">
          <TabsTrigger value="all" className="gap-2">
            All ({members.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Active ({members.filter((m) => m.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="online" className="gap-2">
            <Activity className="h-4 w-4" />
            Online ({members.filter((m) => m.status === "online").length})
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Shield className="h-4 w-4" />
            Admins ({members.filter((m) => m.role === "admin").length})
          </TabsTrigger>
          <TabsTrigger value="manager" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Managers ({members.filter((m) => m.role === "manager").length})
          </TabsTrigger>
          <TabsTrigger value="member" className="gap-2">
            <User className="h-4 w-4" />
            Members ({members.filter((m) => m.role === "member").length})
          </TabsTrigger>
          <TabsTrigger value="guest" className="gap-2">
            <Eye className="h-4 w-4" />
            Guests ({members.filter((m) => m.role === "guest").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Enhanced Team Members Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No team members found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? `No members matching "${searchQuery}"` : "Invite your first team member to get started"}
          </p>
          <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden"
            >
              {/* Status indicator */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  member.status === "online"
                    ? "bg-green-500"
                    : member.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              />

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {/* Online status dot */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.email}</CardDescription>
                      {member.jobTitle && <p className="text-sm text-muted-foreground mt-1">{member.jobTitle}</p>}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEditMember(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(member.id, member.isActive)}>
                        {member.isActive ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={member.id === user?.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getRoleBadge(member.role)}
                  {getStatusBadge(member.status, member.isActive)}
                </div>

                {/* Enhanced Member Info */}
                <div className="space-y-2 text-sm">
                  {member.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{member.department}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{member.location}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Enhanced Performance Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{member.tasksAssigned}</div>
                    <div className="text-xs text-muted-foreground">Assigned</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{member.tasksCompleted}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{member.projectsCount}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">
                      {member.tasksAssigned > 0 ? Math.round((member.tasksCompleted / member.tasksAssigned) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{
                        width: `${
                          member.tasksAssigned > 0 ? (member.tasksCompleted / member.tasksAssigned) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-muted-foreground">
                    {member.lastActive ? (
                      <span>Last active {new Date(member.lastActive).toLocaleDateString()}</span>
                    ) : (
                      <span>Never logged in</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditMember(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update member information and role permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={editData.role} onValueChange={(value) => setEditData({ ...editData, role: value })}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-job-title">Job Title</Label>
                <Input
                  id="edit-job-title"
                  value={editData.jobTitle}
                  onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })}
                  placeholder="Enter job title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editData.department}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  placeholder="Enter department"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} disabled={!editData.name || isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending Invites Section */}
      {loadingInvites ? (
        <div className="my-6 text-center text-muted-foreground">Loading pending invites...</div>
      ) : pendingInvites.length > 0 ? (
        <div className="my-6">
          <h2 className="text-lg font-semibold mb-2">Pending Invites</h2>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div key={invite._id} className="flex items-center gap-4 bg-muted/50 rounded-lg px-4 py-2">
                <span className="font-medium">{invite.email}</span>
                <Badge>{invite.role}</Badge>
                <span className="text-xs text-muted-foreground">{invite.status}</span>
                <Button size="sm" variant="outline" onClick={() => handleResendInvite(invite._id)}>
                  Resend
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleRevokeInvite(invite._id)}>
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
