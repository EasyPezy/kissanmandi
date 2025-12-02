# Security Guidelines

## 🔒 API Keys and Secrets

**IMPORTANT**: Never commit API keys, passwords, or other sensitive information to the repository!

### Protected Information:
- API keys (Gemini, MongoDB, etc.)
- Database connection strings with passwords
- Authentication tokens
- Private keys
- Any credentials or secrets

### How to Handle Secrets:

1. **Use Environment Variables**:
   - Store all secrets in `.env` files
   - `.env` files are already in `.gitignore` and will NOT be committed
   - Use `.env.example` files as templates (without real values)

2. **For Local Development**:
   - Copy `.env.example` to `.env`
   - Fill in your actual values in `.env`
   - Never commit `.env` to git

3. **For Production Deployment**:
   - Set environment variables in your hosting platform (Railway, Render, Vercel)
   - Never hardcode secrets in code
   - Use the platform's environment variable settings

### Current Security Status:

✅ **Secure**:
- `.env` files are in `.gitignore`
- No hardcoded API keys in code
- All secrets use environment variables

### If You Accidentally Committed Secrets:

1. **Immediately rotate/regenerate** the exposed secrets:
   - Generate new API keys
   - Change passwords
   - Update connection strings

2. **Remove from Git history** (if needed):
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Or contact GitHub support for help
   ```

3. **Update all deployments** with new secrets

### Best Practices:

- ✅ Always use environment variables
- ✅ Use `.env.example` as templates
- ✅ Review commits before pushing
- ✅ Use different keys for dev/prod
- ❌ Never commit `.env` files
- ❌ Never hardcode secrets
- ❌ Never share secrets in issues/PRs


