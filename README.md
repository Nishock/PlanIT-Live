<<<<<<< HEAD
# PlanIT-F
=======
# 🎯 PLANIT - AI-Powered Task Management Platform

A modern, full-stack task management application built with Next.js, MongoDB, and AI integration.

![PLANIT Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=PLANIT+Dashboard)

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication system
- Secure password hashing
- Protected routes and API endpoints
- Demo account for testing

### 📋 **Task Management**
- Interactive Kanban board with drag & drop
- Task priorities, due dates, and assignments
- Rich task descriptions and comments
- Tag-based organization
- Advanced filtering and search

### 🏢 **Project & Workspace Management**
- Multi-workspace support (Personal, Team, Organization)
- Project creation and progress tracking
- Team collaboration features
- Role-based permissions

### 📝 **Document Management**
- Rich text editor with collaborative features
- Document organization and search
- File attachments and media support
- Version history and comments

### 🤖 **AI-Powered Features**
- Intelligent task suggestions
- AI-powered content generation
- Natural language task creation
- Smart project insights

### 📊 **Analytics & Reporting**
- Task completion analytics
- Project progress tracking
- Team productivity insights
- Custom reports and exports

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Accessible interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/planit-task-manager.git
   cd planit-task-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` with your values:
   \`\`\`env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   \`\`\`

4. **Initialize the database**
   \`\`\`bash
   npm run setup-db
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Account
- **Email**: `demo@planit.app`
- **Password**: `demo1234`

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### AI & Integrations
- **OpenAI API** - AI-powered features
- **Vercel AI SDK** - AI integration toolkit

## 📁 Project Structure

\`\`\`
planit-task-manager/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   ├── dashboard/        # Dashboard components
│   └── tasks/            # Task components
├── lib/                  # Utility functions
│   ├── models/           # Database models
│   ├── api-service.ts    # API client
│   └── auth-context.tsx  # Authentication context
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get tasks with filters
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Projects
- `GET /api/projects` - Get projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project

### Workspaces
- `GET /api/workspaces` - Get workspaces
- `POST /api/workspaces` - Create workspace

### AI Features
- `POST /api/ai/chat` - AI chat completion
- `POST /api/ai/task-suggestions` - Get AI task suggestions

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Set Environment Variables in Vercel**
   \`\`\`env
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=your-openai-key
   NODE_ENV=production
   \`\`\`

### Other Deployment Options
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **DigitalOcean** - App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- AI powered by [relevanceai](https://app.relevanceai.com/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](./DEPLOYMENT.md)
- Contact the development team

---

**Made with ❤️ by the PLANIT Team**
>>>>>>> master
