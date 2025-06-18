"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { profileService, uploadService } from "@/lib/api-service"
import {
  User,
  Upload,
  Briefcase,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  Loader2,
  X,
  Camera,
} from "lucide-react"

interface ProfileData {
  name: string
  email: string
  bio: string
  jobTitle: string
  department: string
  phone: string
  location: string
  website: string
  timezone: string
  github: string
  linkedin: string
  twitter: string
  skills: string[]
  profileCompleted: boolean
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    jobTitle: "",
    department: "",
    phone: "",
    location: "",
    website: "",
    timezone: "America/New_York",
    github: "",
    linkedin: "",
    twitter: "",
    skills: [],
    profileCompleted: false,
  })

  // Fetch profile data from API
  const fetchProfile = async () => {
    try {
      setIsFetching(true)
      console.log("Fetching profile data...")
      
      const data = await profileService.getProfile()
      console.log("Profile data received:", data)

      setProfileData({
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        jobTitle: data.jobTitle || "",
        department: data.department || "",
        phone: data.phone || "",
        location: data.location || "",
        website: data.website || "",
        timezone: data.timezone || "America/New_York",
        github: data.github || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        skills: data.skills || [],
        profileCompleted: data.profileCompleted || false,
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  // Load profile data when component mounts
  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim()) && profileData.skills.length < 20) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, or WebP image",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Upload file using the upload service
      const result = await uploadService.uploadProfilePhoto(file)

      // Update profile with new avatar URL
      await profileService.updateAvatar(result.url)

      // Refresh user data
      await refreshUser()

      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully",
      })
    } catch (error) {
      console.error("Photo upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      console.log("Saving profile data:", profileData)

      const result = await profileService.updateProfile(profileData)
      console.log("Profile save result:", result)

      // Update the user context with new profile data
      await refreshUser()

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      setIsEditing(false)

      // Clear the profile completion prompt if profile is now completed
      if (result?.profileCompleted) {
        localStorage.setItem("profile_completion_dismissed", "true")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        {!profileData.profileCompleted && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
            Profile incomplete
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={profileData.name} />
                      <AvatarFallback className="text-2xl">{profileData.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-background hover:bg-accent"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.jobTitle || "No job title set"}</p>
                  <p className="text-sm text-muted-foreground mt-1">{profileData.department || "No department set"}</p>

                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.email}</span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                    )}
                    {profileData.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.website}</span>
                      </div>
                    )}
                  </div>

                  {(profileData.github || profileData.linkedin || profileData.twitter) && (
                    <div className="flex gap-2 mt-6">
                      {profileData.github && (
                        <Button variant="outline" size="icon">
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      {profileData.linkedin && (
                        <Button variant="outline" size="icon">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                      {profileData.twitter && (
                        <Button variant="outline" size="icon">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Your professional skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <div key={index} className="relative group">
                        <Badge variant="secondary" className="pr-6">
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      </div>
                    ))}
                    {profileData.skills.length === 0 && !isEditing && (
                      <p className="text-sm text-muted-foreground">No skills added yet</p>
                    )}
                    {isEditing && (
                      <div className="flex gap-2 w-full mt-2">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddSkill}
                          disabled={!newSkill.trim() || profileData.skills.length >= 20}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            name="jobTitle"
                            value={profileData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g. Senior Product Designer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select
                            value={profileData.department}
                            onValueChange={(value) => handleSelectChange("department", value)}
                          >
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Design">Design</SelectItem>
                              <SelectItem value="Engineering">Engineering</SelectItem>
                              <SelectItem value="Product">Product</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="HR">Human Resources</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. +1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={profileData.website}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={profileData.timezone}
                            onValueChange={(value) => handleSelectChange("timezone", value)}
                          >
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Social Profiles</Label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            <Input
                              name="github"
                              value={profileData.github}
                              onChange={handleInputChange}
                              placeholder="GitHub username"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            <Input
                              name="linkedin"
                              value={profileData.linkedin}
                              onChange={handleInputChange}
                              placeholder="LinkedIn profile URL"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            <Input
                              name="twitter"
                              value={profileData.twitter}
                              onChange={handleInputChange}
                              placeholder="Twitter handle"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Bio</h3>
                        <p className="text-sm text-muted-foreground">{profileData.bio || "No bio added yet"}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.phone || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.location || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.website || "Not provided"}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Work Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.jobTitle || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.department || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profileData.timezone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(profileData.github || profileData.linkedin || profileData.twitter) && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Social Profiles</h3>
                          <div className="space-y-2">
                            {profileData.github && (
                              <div className="flex items-center gap-2">
                                <Github className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{profileData.github}</span>
                              </div>
                            )}
                            {profileData.linkedin && (
                              <div className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{profileData.linkedin}</span>
                              </div>
                            )}
                            {profileData.twitter && (
                              <div className="flex items-center gap-2">
                                <Twitter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{profileData.twitter}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity to show</p>
                <p className="text-sm">Your activity will appear here as you use PLANIT</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>Tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks assigned yet</p>
                <p className="text-sm">Tasks assigned to you will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
