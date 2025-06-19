"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, User, Mail, Lock, Zap, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function CyberpunkLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Form data states
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })

  // Auth hooks
  const { login, register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 1000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      toast({
        title: "PlanIT Link Established!",
        description: "Welcome back to the PlanIT.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Invalid PlanIT credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(registerData.name, registerData.email, registerData.password)
      toast({
        title: "PlanIT Profile Created!",
        description: "Welcome to PlanIT. Your PlanIT link has been established.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "PlanIT Link Failed",
        description: error instanceof Error ? error.message : "Failed to create PlanIT profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Create floating particles
    const particles = document.querySelectorAll(".particle")
    particles.forEach((particle, index) => {
      const element = particle as HTMLElement
      element.style.animationDelay = `${index * 0.5}s`
      element.style.left = `${Math.random() * 100}%`
      element.style.animationDuration = `${3 + Math.random() * 4}s`
    })
  }, [])

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="wave-animation absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
            <div className="wave-animation-2 absolute inset-0 bg-gradient-to-l from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
            <div className="wave-animation-3 absolute inset-0 bg-gradient-to-t from-purple-500/10 via-pink-500/10 to-cyan-500/10"></div>
          </div>
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          ></div>
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern w-full h-full"></div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-3xl blur-xl animate-pulse"></div>

        {/* Glassmorphism Card */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Holographic Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <Link href="/" className="inline-block">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Planit
                </h1>
              </Link>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur"></div>
            </div>
            <p className="text-gray-300 mt-2 text-sm">Manage with AI</p>
          </div>

          {/* Toggle Switch */}
          <div className="relative mb-8">
            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-500 relative overflow-hidden ${
                  isLogin
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="relative z-10">LOGIN</span>
                {isLogin && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-500 relative overflow-hidden ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="relative z-10">REGISTER</span>
                {!isLogin && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Form Container with Liquid Transition */}
          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-700 ease-in-out transform ${
                isLogin ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-cyan-400 z-10" />
                    <input
                      type="email"
                      placeholder="PlanIT ID / Email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-blue-400 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Quantum Key"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  onClick={createRipple}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        ESTABLISHING CONNECTION...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        INITIALIZE CONNECTION
                      </>
                    )}
                  </span>
                  {ripples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className="absolute bg-white/30 rounded-full animate-ping"
                      style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-600/30 to-cyan-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </form>
            </div>

            <div
              className={`transition-all duration-700 ease-in-out transform ${
                !isLogin ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              {/* Register Form */}
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Username Field */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-5 h-5 text-purple-400 z-10" />
                    <input
                      type="text"
                      placeholder="PlanIT Alias"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-cyan-400 z-10" />
                    <input
                      type="email"
                      placeholder="PlanIT ID / Email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-blue-400 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Quantum Key"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  onClick={createRipple}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        CREATING PlanIT LINK...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        CREATE PlanIT LINK
                      </>
                    )}
                  </span>
                  {ripples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className="absolute bg-white/30 rounded-full animate-ping"
                      style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">
              ← Return to PlanIT Hub
            </Link>
            <p className="text-gray-400 text-xs mt-4">Secured by Quantum Encryption • PlanIT Network Protected</p>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .wave-animation {
          animation: wave 8s ease-in-out infinite;
        }
        
        .wave-animation-2 {
          animation: wave 12s ease-in-out infinite reverse;
        }
        
        .wave-animation-3 {
          animation: wave 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(0deg) scale(1); }
          25% { transform: translateX(-50%) translateY(-50%) rotate(90deg) scale(1.1); }
          50% { transform: translateX(-50%) translateY(-50%) rotate(180deg) scale(0.9); }
          75% { transform: translateX(-50%) translateY(-50%) rotate(270deg) scale(1.1); }
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .particle {
          box-shadow: 0 0 10px currentColor;
        }
      `}</style>
    </div>
  )
}
