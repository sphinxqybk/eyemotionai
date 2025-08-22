# EyeMotion - Adaptive Visual Storytelling & Verification Ecosystem

Professional film ecosystem powered by Intent-Aware AI. Transform lived experience into verified authentic visual narratives with Film From Zero (FFZ) educational framework and Cine Suite™ tools.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/eyemotion/eyemotion-ecosystem.git
cd eyemotion-ecosystem
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.local .env

# Edit .env with your actual values
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Backend**: Supabase
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel

## 🎨 Design System

### Typography
- **Primary**: Inter (Interface elements)
- **Display**: Poppins (Headers & branding)
- **Mono**: JetBrains Mono (Technical content)

### Colors (EyeMotion Ecosystem)
- **Intent Blue**: `oklch(0.488 0.243 264.376)` - AI & Intelligence
- **Experience Cyan**: `oklch(0.75 0.35 195)` - User Experience  
- **Story Orange**: `oklch(0.769 0.188 70.08)` - Narrative & Content
- **Verification Purple**: `oklch(0.627 0.265 303.9)` - Authenticity & Security
- **Community Coral**: `oklch(0.645 0.246 16.439)` - Community & Social

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

2. **Environment Variables**
Add these environment variables in Vercel Dashboard:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Do NOT use Vercel Secrets (@secret_name) for VITE_ prefixed variables as they won't be available at build time. Use regular Environment Variables instead.

3. **Build Configuration**
Vercel automatically detects Vite projects. The configuration is in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

4. **Troubleshooting**
- Ensure Node.js version is between 18.18 and 22 (set in package.json engines)
- Make sure all VITE_ environment variables are set in Vercel dashboard
- Check build logs for any missing dependencies

### Manual Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy the `dist` folder**
The built files will be in the `dist` directory. Deploy this folder to any static hosting service.

## 🔧 Configuration

### Vite Configuration
The project uses Vite for fast development and optimized builds. Key configurations:

- **Entry Point**: `src/main.tsx`
- **Build Output**: `dist/`
- **Environment Variables**: Must be prefixed with `VITE_`

### TypeScript
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx
- **Strict Mode**: Enabled

## 🌐 Environment Variables

### Required Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration  
VITE_APP_URL=https://your-domain.com
```

### Optional Variables

```bash
# Development
VITE_DEMO_MODE=false
NODE_ENV=development
```

## 📁 Project Structure

```
eyemotion-ecosystem/
├── src/
│   └── main.tsx              # Entry point
├── components/               # React components
├── pages/                   # Page components
├── hooks/                   # Custom hooks
├── contexts/                # React contexts
├── utils/                   # Utility functions
├── styles/                  # Global styles
├── types/                   # TypeScript types
├── public/                  # Static assets
├── dist/                    # Build output
├── index.html               # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies and scripts
```

## 🔐 Authentication

The project uses Supabase Authentication with:
- Email/password authentication
- Social login support (Google, GitHub, etc.)
- Protected routes
- User profile management

## 📦 Backend Integration

### Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and anon key
3. Set up authentication providers (optional)
4. Configure RLS policies for your tables

### Database Schema
The project includes SQL schema files in the `database/` directory for setting up the required tables.

## 🎯 Features

- **Adaptive Visual Storytelling**: AI-powered story creation tools
- **Film From Zero (FFZ) Framework**: Educational curriculum for filmmaking
- **Intent-Aware AI**: Understanding and amplifying creative vision
- **Verification Systems**: Content authenticity and cultural verification
- **Multi-language Support**: Thai and English localization
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Cinema-grade dark interface
- **Real-time Collaboration**: Multi-user project support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.eyemotion.ai](https://docs.eyemotion.ai)
- **Support Email**: support@eyemotionai.com
- **Issues**: [GitHub Issues](https://github.com/eyemotion/eyemotion-ecosystem/issues)

## 🌟 Acknowledgments

- Film industry professionals for design inspiration
- Open source community for amazing tools
- Supabase for backend infrastructure
- Vercel for seamless deployment