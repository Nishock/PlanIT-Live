# PLANIT Deployment Guide

## 🚀 Quick Deploy to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas database
- OpenAI API key (optional, for AI features)

### 2. Deploy Steps

#### Step 1: Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit - PLANIT Task Manager"
git branch -M main
git remote add origin https://github.com/yourusername/planit-task-manager.git
git push -u origin main
\`\`\`

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `OPENAI_API_KEY`: Your OpenAI API key (optional)

#### Step 3: Set Environment Variables in Vercel
\`\`\`env
MONGODB_URI=mongodb+srv://nishock03:Happynow1@cluster0.2uveg4c.mongodb.net/planit?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-random-jwt-secret-here
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=production
\`\`\`

### 3. Alternative Deployment Options

#### Deploy to Netlify
1. Build the static export: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables

#### Deploy to Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Deploy to DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Set environment variables

### 4. Post-Deployment Setup

#### Initialize Database
After deployment, run the database setup:
\`\`\`bash
# If deploying to a platform with shell access
npm run setup-db
\`\`\`

#### Test the Application
1. Visit your deployed URL
2. Try logging in with demo account:
   - Email: `demo@planit.app`
   - Password: `demo1234`
3. Test creating tasks, projects, and documents

### 5. Custom Domain (Optional)
1. Purchase a domain
2. Configure DNS settings
3. Add domain in Vercel/Netlify dashboard
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## 🔧 Local Development

### Setup
\`\`\`bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values
# Start development server
npm run dev
\`\`\`

### Database Setup
\`\`\`bash
# Initialize database with demo data
npm run setup-db
\`\`\`

## 📊 Features Included

✅ **Authentication System**
- JWT-based authentication
- User registration/login
- Protected routes
- Demo account included

✅ **Task Management**
- Create, edit, delete tasks
- Kanban board with drag & drop
- Task priorities and due dates
- Task assignment and tags

✅ **Project Management**
- Create and manage projects
- Project progress tracking
- Team collaboration
- Project-specific tasks

✅ **Document Management**
- Rich text editor
- Document collaboration
- File organization
- Search functionality

✅ **AI Features** (with OpenAI API)
- AI-powered task suggestions
- Smart content generation
- Natural language processing
- Automated insights

✅ **Multi-Workspace Support**
- Personal workspaces
- Team workspaces
- Role-based permissions
- Workspace switching

✅ **Real-time Features**
- Live updates
- Collaborative editing
- Instant notifications
- Activity feeds

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- XSS protection
- CSRF protection

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop experience
- Dark/light mode support

## 🔍 SEO Optimized

- Meta tags
- Open Graph tags
- Structured data
- Fast loading times
\`\`\`

Finally, let's create a comprehensive README:
