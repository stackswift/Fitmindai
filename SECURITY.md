# 🛡️ Security Guidelines

## Environment Variables Protection

### ✅ Current Security Measures
- `.env.local` is properly ignored by git
- `.env` files are listed in `.gitignore`
- Only `.env.example` (template) is committed to version control

### 🔒 Environment File Security Rules

1. **NEVER commit actual `.env` files**
   - Use `.env.local` for local development
   - Use platform-specific environment variables for production

2. **Files that should NEVER be committed:**
   - `.env`
   - `.env.local`
   - `.env.development.local`
   - `.env.production.local`
   - Any file containing real API keys

3. **Files that ARE safe to commit:**
   - `.env.example` (template with placeholder values)

### 🔑 API Keys Security

**Current API Keys in use:**
- OpenAI API Key (for GPT models)
- Google Gemini API Key (for AI generation)
- Replicate API Token (for image generation)
- ElevenLabs API Key (for text-to-speech)

**Security Best Practices:**
- Rotate API keys regularly
- Use environment-specific keys (dev/prod)
- Monitor API usage for unauthorized access
- Never log API keys or include them in error messages

### 🚨 If Accidentally Committed

If you accidentally commit environment files:

1. **Immediately revoke all exposed API keys**
2. **Remove the files from git history:**
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.local' --prune-empty --tag-name-filter cat -- --all
   ```
3. **Generate new API keys**
4. **Force push to overwrite history (if safe to do so)**

### 📋 Deployment Security

**For Production Deployment:**
- Set environment variables directly in your hosting platform
- Use platform-specific secrets management (Vercel, Netlify, etc.)
- Never include production keys in any committed files

### ✅ Security Checklist

- [x] `.gitignore` includes all environment file patterns
- [x] `.env.local` is not tracked by git
- [x] `.env.example` contains only placeholder values
- [x] Real API keys are stored securely
- [x] Security documentation is in place

### 🔍 Regular Security Audit

Run this command to check for accidentally committed secrets:
```bash
git log --all --full-history -- .env* | head -20
```

If this returns any results (other than .env.example), investigate immediately.