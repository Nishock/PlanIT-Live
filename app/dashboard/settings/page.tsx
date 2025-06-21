"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Mail,
  Lock,
  Settings,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
  Clock,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"

interface UserSettings {
  preferences: {
    theme: "light" | "dark" | "system"
    emailNotifications: boolean
    pushNotifications: boolean
    taskReminders: boolean
    weeklyDigest: boolean
    marketing: boolean
    soundEffects: boolean
    autoSave: boolean
    compactMode: boolean
  }
  privacy: {
    profileVisibility: "public" | "team" | "private"
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
    allowDirectMessages: boolean
    allowMentions: boolean
    activityStatus: boolean
  }
  security: {
    twoFactorEnabled: boolean
    passwordLastChanged: string
    activeSessions: number
    loginAlerts: boolean
    deviceTrust: boolean
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [savingSettings, setSavingSettings] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("preferences")
  const [showPassword, setShowPassword] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const [settings, setSettings] = useState<UserSettings>({
    preferences: {
      theme: "system",
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      weeklyDigest: true,
      marketing: false,
      soundEffects: true,
      autoSave: true,
      compactMode: false,
    },
    privacy: {
      profileVisibility: "team",
      showEmail: false,
      showPhone: false,
      showLocation: false,
      allowDirectMessages: true,
      allowMentions: true,
      activityStatus: true,
    },
    security: {
      twoFactorEnabled: false,
      passwordLastChanged: "2024-01-01",
      activeSessions: 3,
      loginAlerts: true,
      deviceTrust: false,
    },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchUserSettings()
  }, [])

  // Sync theme with next-themes
  useEffect(() => {
    if (theme && settings.preferences.theme !== theme) {
      setSettings(prev => ({
        ...prev,
        preferences: { ...prev.preferences, theme: theme as any }
      }))
    }
  }, [theme])

  const fetchUserSettings = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/settings", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) throw new Error("Failed to fetch settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async (section?: keyof UserSettings) => {
    try {
      setSaving(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(section ? { [section]: settings[section] } : settings),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast({
        title: "✅ Settings saved",
        description: "Your settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreferenceChange = async (key: string, value: any) => {
    // Update local state immediately for responsive UI
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }))

    // Special handling for theme changes
    if (key === "theme") {
      setTheme(value)
    }

    // Show loading state for this setting
    setSavingSettings(prev => new Set(prev).add(key))

    // Auto-save the preference change
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: { ...settings.preferences, [key]: value }
        }),
      })

      if (!response.ok) throw new Error("Failed to save preference")

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      // Show a subtle success indicator
      toast({
        title: "Preference updated",
        description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} setting saved`,
      })
    } catch (error) {
      console.error("Error saving preference:", error)
      // Revert the local state change on error
      setSettings(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: !value }
      }))
      // Revert theme change on error
      if (key === "theme") {
        setTheme(settings.preferences.theme)
      }
      toast({
        title: "Error",
        description: "Failed to save preference",
        variant: "destructive",
      })
    } finally {
      // Remove loading state
      setSavingSettings(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }

  const handlePrivacyChange = async (key: string, value: any) => {
    // Update local state immediately for responsive UI
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }))

    // Auto-save the privacy change
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          privacy: { ...settings.privacy, [key]: value }
        }),
      })

      if (!response.ok) throw new Error("Failed to save privacy setting")

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast({
        title: "Privacy setting updated",
        description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} setting saved`,
      })
    } catch (error) {
      console.error("Error saving privacy setting:", error)
      // Revert the local state change on error
      setSettings(prev => ({
        ...prev,
        privacy: { ...prev.privacy, [key]: !value }
      }))
      toast({
        title: "Error",
        description: "Failed to save privacy setting",
        variant: "destructive",
      })
    }
  }

  const handleSecurityChange = async (key: string, value: any) => {
    // Update local state immediately for responsive UI
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }))

    // Auto-save the security change
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          security: { ...settings.security, [key]: value }
        }),
      })

      if (!response.ok) throw new Error("Failed to save security setting")

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast({
        title: "Security setting updated",
        description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} setting saved`,
      })
    } catch (error) {
      console.error("Error saving security setting:", error)
      // Revert the local state change on error
      setSettings(prev => ({
        ...prev,
        security: { ...prev.security, [key]: !value }
      }))
      toast({
        title: "Error",
        description: "Failed to save security setting",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to change password")
      }

      toast({
        title: "🔐 Password changed",
        description: "Your password has been updated successfully",
      })

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggle2FA = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/2fa", {
        method: settings.security.twoFactorEnabled ? "DELETE" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error("Failed to toggle 2FA")

      setSettings({
        ...settings,
        security: {
          ...settings.security,
          twoFactorEnabled: !settings.security.twoFactorEnabled,
        },
      })

      toast({
        title: settings.security.twoFactorEnabled ? "🔓 2FA disabled" : "🔐 2FA enabled",
        description: `Two-factor authentication has been ${settings.security.twoFactorEnabled ? "disabled" : "enabled"}`,
      })
    } catch (error) {
      console.error("Error toggling 2FA:", error)
      toast({
        title: "Error",
        description: "Failed to toggle two-factor authentication",
        variant: "destructive",
      })
    }
  }

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/export-data", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error("Failed to export data")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `planit-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "📥 Data exported",
        description: "Your data has been downloaded successfully",
      })
      setIsExportDialogOpen(false)
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Confirmation required",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error("Failed to delete account")

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      })

      // Redirect to login or home page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  const handleSignOutAllDevices = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/user/signout-all", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error("Failed to sign out")

      toast({
        title: "🚪 Signed out from all devices",
        description: "You've been signed out from all other devices",
      })

      setSettings({
        ...settings,
        security: {
          ...settings.security,
          activeSessions: 1,
        },
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out from all devices",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        <Button
          onClick={() => handleSaveSettings()}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how PLANIT looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Monitor, label: "System" },
                  ].map(({ value, icon: Icon, label }) => (
                    <div
                      key={value}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                        settings.preferences.theme === value
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                          : "border-border"
                      }`}
                      onClick={() =>
                        handlePreferenceChange("theme", value as any)
                      }
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-center font-medium">{label}</p>
                      {settings.preferences.theme === value && (
                        <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-purple-600" />
                      )}
                      {savingSettings.has("theme") && settings.preferences.theme === value && (
                        <Loader2 className="absolute top-2 left-2 h-5 w-5 animate-spin text-purple-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Interface Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactMode" className="font-medium">
                        Compact Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">Show more content in less space</p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={settings.preferences.compactMode}
                      disabled={savingSettings.has("compactMode")}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("compactMode", checked)
                      }
                    />
                    {savingSettings.has("compactMode") && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="soundEffects" className="font-medium">
                        Sound Effects
                      </Label>
                      <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id="soundEffects"
                        checked={settings.preferences.soundEffects}
                        disabled={savingSettings.has("soundEffects")}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("soundEffects", checked)
                        }
                      />
                      {savingSettings.has("soundEffects") && (
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoSave" className="font-medium">
                        Auto-save
                      </Label>
                      <p className="text-sm text-muted-foreground">Automatically save your work</p>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id="autoSave"
                        checked={settings.preferences.autoSave}
                        disabled={savingSettings.has("autoSave")}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("autoSave", checked)
                        }
                      />
                      {savingSettings.has("autoSave") && (
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "Receive important updates via email",
                  icon: Mail,
                },
                {
                  key: "pushNotifications",
                  title: "Push Notifications",
                  description: "Get browser and mobile push notifications",
                  icon: Bell,
                },
                {
                  key: "taskReminders",
                  title: "Task Reminders",
                  description: "Remind me about upcoming task deadlines",
                  icon: Clock,
                },
                {
                  key: "weeklyDigest",
                  title: "Weekly Digest",
                  description: "Summary of your weekly activity and progress",
                  icon: Mail,
                },
                {
                  key: "marketing",
                  title: "Marketing Communications",
                  description: "Product updates, tips, and promotional content",
                  icon: Globe,
                },
              ].map(({ key, title, description, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor={key} className="font-medium">
                        {title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id={key}
                      checked={settings.preferences[key as keyof typeof settings.preferences] as boolean}
                      disabled={savingSettings.has(key)}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange(key, checked)
                      }
                    />
                    {savingSettings.has(key) && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Profile Visibility
              </CardTitle>
              <CardDescription>Control who can see your profile and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Profile Visibility</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "public", label: "Public", description: "Anyone can see your profile" },
                    { value: "team", label: "Team Only", description: "Only team members can see your profile" },
                    { value: "private", label: "Private", description: "Only you can see your profile" },
                  ].map(({ value, label, description }) => (
                    <div
                      key={value}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                        settings.privacy.profileVisibility === value
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                          : "border-border"
                      }`}
                      onClick={() =>
                        handlePrivacyChange("profileVisibility", value as any)
                      }
                    >
                      <h3 className="font-medium mb-1">{label}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                      {settings.privacy.profileVisibility === value && (
                        <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Information Visibility</Label>
                <div className="space-y-3">
                  {[
                    {
                      key: "showEmail",
                      title: "Show Email Address",
                      description: "Display your email on your profile",
                    },
                    {
                      key: "showPhone",
                      title: "Show Phone Number",
                      description: "Display your phone number on your profile",
                    },
                    {
                      key: "showLocation",
                      title: "Show Location",
                      description: "Display your location on your profile",
                    },
                  ].map(({ key, title, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key} className="font-medium">
                          {title}
                        </Label>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        id={key}
                        checked={settings.privacy[key as keyof typeof settings.privacy] as boolean}
                        onCheckedChange={(checked) =>
                          handlePrivacyChange(key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Communication Preferences</Label>
                <div className="space-y-3">
                  {[
                    {
                      key: "allowDirectMessages",
                      title: "Allow Direct Messages",
                      description: "Let others send you direct messages",
                    },
                    {
                      key: "allowMentions",
                      title: "Allow Mentions",
                      description: "Let others mention you in comments and discussions",
                    },
                    {
                      key: "activityStatus",
                      title: "Show Activity Status",
                      description: "Show when you're online or active",
                    },
                  ].map(({ key, title, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key} className="font-medium">
                          {title}
                        </Label>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        id={key}
                        checked={settings.privacy[key as keyof typeof settings.privacy] as boolean}
                        onCheckedChange={(checked) =>
                          handlePrivacyChange(key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Authentication
              </CardTitle>
              <CardDescription>Manage your login credentials and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Change Password</Label>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      isSaving
                    }
                    className="w-fit"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Password last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={settings.security.twoFactorEnabled ? "default" : "secondary"}>
                      {settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Button
                      onClick={handleToggle2FA}
                      variant={settings.security.twoFactorEnabled ? "destructive" : "default"}
                      size="sm"
                    >
                      {settings.security.twoFactorEnabled ? "Disable" : "Enable"} 2FA
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Security Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginAlerts" className="font-medium">
                        Login Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                    </div>
                    <Switch
                      id="loginAlerts"
                      checked={settings.security.loginAlerts}
                      onCheckedChange={(checked) =>
                        handleSecurityChange("loginAlerts", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="deviceTrust" className="font-medium">
                        Device Trust
                      </Label>
                      <p className="text-sm text-muted-foreground">Remember trusted devices for 30 days</p>
                    </div>
                    <Switch
                      id="deviceTrust"
                      checked={settings.security.deviceTrust}
                      onCheckedChange={(checked) =>
                        handleSecurityChange("deviceTrust", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Active Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      You're signed in on {settings.security.activeSessions} devices
                    </p>
                  </div>
                  <Button onClick={handleSignOutAllDevices} variant="outline" size="sm">
                    Sign Out All Devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Export your data or delete your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Export Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of all your data including tasks, projects, and documents
                  </p>
                </div>
                <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Your Data</DialogTitle>
                      <DialogDescription>
                        This will create a downloadable file containing all your PLANIT data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Your export will include:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                        <li>Profile information</li>
                        <li>Tasks and projects</li>
                        <li>Documents and files</li>
                        <li>Workspace data</li>
                        <li>Settings and preferences</li>
                      </ul>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleExportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h3 className="font-medium text-destructive">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <h4 className="font-medium text-destructive mb-2">This will delete:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Your profile and personal information</li>
                          <li>All tasks, projects, and documents</li>
                          <li>Workspace memberships and data</li>
                          <li>Settings and preferences</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deleteConfirmation">
                          Type <strong>DELETE</strong> to confirm:
                        </Label>
                        <Input
                          id="deleteConfirmation"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE here"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== "DELETE"}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account Permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
