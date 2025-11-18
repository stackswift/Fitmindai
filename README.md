# 🏋️‍♂️ FitMind AI - Your Personal Fitness Coach

An AI-powered fitness assistant built with Next.js that generates personalized workout and diet plans using advanced Large Language Models (LLMs). Features voice narration and AI-generated images for an immersive fitness experience.

![FitMind AI](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=FitMind+AI+Fitness+Coach)

## 🚀 Features

### 🧠 AI-Powered Plan Generation
- **Personalized Workout Plans** - Custom exercise routines based on your fitness level, goals, and available equipment
- **Tailored Diet Plans** - Nutritional guidance aligned with your dietary preferences and fitness objectives
- **Smart Recommendations** - AI-generated tips for lifestyle, motivation, and recovery
- **Dynamic Content** - No hardcoded plans - everything is AI-generated and personalized

### 📊 User Input System
Users can provide detailed information including:
- **Basic Info**: Name, Age, Gender, Height, Weight
- **Fitness Goals**: Weight Loss, Muscle Gain, Maintenance, Endurance, Strength
- **Preferences**: Fitness Level, Workout Location (Home/Gym/Outdoor)
- **Diet**: Vegetarian, Non-Vegetarian, Vegan, Keto, Paleo options
- **Lifestyle**: Sleep hours, stress levels, available time, workout timing
- **Medical History**: Optional health considerations

### 🔊 Voice Features
- **Text-to-Speech**: Listen to your workout and diet plans
- **Multiple Voices**: Support for ElevenLabs API and browser speech synthesis
- **Section Selection**: Choose to listen to specific parts (workout/diet/tips)

### 🖼️ AI Image Generation
- **Exercise Visualization**: AI-generated images for workout demonstrations
- **Meal Inspiration**: Visual representations of recommended foods
- **Multiple Providers**: OpenAI DALL-E, Replicate, with fallback options

### 📄 Export & Sharing
- **PDF Export**: Download your complete fitness plan
- **Local Storage**: Save plans automatically in browser
- **Plan Regeneration**: Create new plans with updated preferences

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Glass Morphism**: Modern design with backdrop blur effects
- **Accessibility**: WCAG compliant with proper semantic markup

### 💪 Daily Motivation
- **Quote of the Day**: AI-powered motivational messages
- **Progress Tracking**: Weekly goals and measurement guidelines
- **Achievement System**: Milestone celebration and encouragement

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI Components |
| **Animations** | Framer Motion |
| **AI APIs** | OpenAI GPT, Google Gemini, Claude (Anthropic) |
| **Voice** | ElevenLabs TTS API, Web Speech API |
| **Images** | OpenAI DALL-E, Replicate, Stable Diffusion |
| **PDF** | jsPDF with custom styling |
| **Icons** | Lucide React |
| **Deployment** | Vercel, Netlify Ready |

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- API keys for AI services (optional but recommended)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd fitmindai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the environment template and add your API keys:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# AI API Keys (at least one recommended)
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

### 5. Build for Production
```bash
npm run build
npm start
```

## 🔑 API Keys Setup

### OpenAI (Recommended)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and navigate to API keys
3. Generate a new secret key
4. Add to `.env.local` as `OPENAI_API_KEY`

### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Get your API key
3. Add to `.env.local` as `GEMINI_API_KEY`

### ElevenLabs (Voice)
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from settings
3. Add to `.env.local` as `ELEVENLABS_API_KEY`

### Replicate (Images)
1. Create account at [Replicate](https://replicate.com/)
2. Generate API token
3. Add to `.env.local` as `REPLICATE_API_TOKEN`

> **Note**: The app works with fallback options if API keys are not provided, but AI features will be limited.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── generate-plan/ # Main AI plan generation
│   │   ├── generate-image/# AI image generation
│   │   ├── text-to-speech/# Voice synthesis
│   │   └── export-pdf/    # PDF generation
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── header.tsx        # App header with theme toggle
│   ├── user-form.tsx     # User input form
│   ├── plan-display.tsx  # Fitness plan viewer
│   ├── motivation-quote.tsx # Daily motivation
│   └── theme-provider.tsx # Theme context
├── lib/                  # Utility libraries
│   ├── ai-service.ts     # AI plan generation logic
│   ├── image-service.ts  # Image generation service
│   ├── pdf-service.ts    # PDF export functionality
│   └── utils.ts          # General utilities
└── types/                # TypeScript type definitions
    └── index.ts          # All interface definitions
```

## 🎯 Features in Detail

### AI Plan Generation
The app uses a sophisticated prompt engineering approach to generate comprehensive fitness plans:

- **Multi-Provider Support**: Tries OpenAI first, falls back to Gemini, then provides high-quality fallback plans
- **Contextual Prompts**: Incorporates all user data for personalized recommendations
- **Structured Output**: Consistent JSON format for reliable parsing
- **Safety First**: Plans are generated with user safety and realistic expectations in mind

### Voice Integration
- **ElevenLabs Integration**: Premium voice quality for professional narration
- **Browser Fallback**: Uses Web Speech API when ElevenLabs is unavailable
- **Selective Reading**: Users can choose which sections to hear (workout, diet, tips)
- **Playback Controls**: Start/stop functionality with visual feedback

### Image Generation
- **Exercise Demos**: Generate realistic gym and home workout demonstrations
- **Food Visualization**: Create appetizing images of recommended meals
- **Multiple Models**: Support for DALL-E 3, Stable Diffusion via Replicate
- **Smart Prompts**: Optimized prompts for fitness and food photography styles

### PDF Export
- **Professional Layout**: Clean, formatted PDF documents
- **Complete Plans**: Includes all workout days, meals, and tips
- **Responsive Design**: Proper page breaks and text wrapping
- **Custom Branding**: FitMind AI branded exports

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

### Self-Hosted
1. Build: `npm run build`
2. Use a process manager like PM2
3. Configure reverse proxy (nginx/apache)
4. Set up SSL certificates

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use proper component structure
- Add proper error handling
- Test with different user scenarios
- Ensure responsive design
- Maintain accessibility standards

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models and DALL-E
- **Google** for Gemini AI
- **ElevenLabs** for voice synthesis
- **Vercel** for hosting and deployment
- **Shadcn/ui** for beautiful components
- **Tailwind CSS** for styling system
- **Framer Motion** for smooth animations

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the [Issues](../../issues)** for existing solutions
2. **Create a new issue** with detailed description
3. **Join our community** discussions
4. **Email support**: support@fitmindai.com

## 📈 Roadmap

- [ ] **User Authentication** - Save plans across devices
- [ ] **Progress Photos** - Visual tracking capabilities
- [ ] **Community Features** - Share plans and achievements
- [ ] **Wearable Integration** - Connect with fitness trackers
- [ ] **Nutrition Tracking** - Calorie and macro monitoring
- [ ] **Video Workouts** - AI-generated exercise videos
- [ ] **Personal Trainer Chat** - Real-time AI coaching
- [ ] **Social Sharing** - Share achievements on social media

---

**Built with ❤️ by the FitMind AI Team**

[Live Demo](https://fitmindai.vercel.app) | [Documentation](https://docs.fitmindai.com) | [API Reference](https://api.fitmindai.com/docs)