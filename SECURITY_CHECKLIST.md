# 🔒 Security Checklist Before Pushing to GitHub

## ✅ What's Already Protected

1. **`.env` files are in `.gitignore`** - Your MongoDB password and Pusher secrets are safe
2. **No hardcoded secrets in code** - All credentials now use environment variables
3. **Sensitive files are ignored** - `.env`, `*.key`, `*.pem`, `pass.txt`, etc.

## ⚠️ Critical: Before Pushing to GitHub

### 1. Verify `.env` Files Are NOT Tracked
```bash
git status
# Make sure you DON'T see:
# - messenger-backend/.env
# - messenger-mern-starter-project/.env
```

### 2. Check Git History (If Repository Already Exists)
If you've already committed sensitive data before:
```bash
# Check if .env was ever committed
git log --all --full-history -- messenger-backend/.env
git log --all --full-history -- messenger-mern-starter-project/.env

# If found, you need to remove it from history (see below)
```

### 3. Scan for Hardcoded Credentials
Run this command to check for any exposed secrets:
```bash
# Search for your actual credentials in tracked files
git grep -i "TVqncsSmZQ4doerW"
git grep -i "5c0837595356a298ace2"
git grep -i "2071720"
```

### 4. Review Files Being Committed
```bash
git status
# Review every file listed - make sure no secrets are visible
```

## 🚨 If You Accidentally Committed Secrets

### Option 1: Remove from Last Commit (If Not Pushed Yet)
```bash
git reset --soft HEAD~1
# Remove .env from staging
git reset HEAD messenger-backend/.env
git commit -m "Your commit message"
```

### Option 2: Remove from Git History (If Already Pushed)
```bash
# Use git filter-branch or BFG Repo-Cleaner
# This is complex - consider using GitHub's secret scanning
```

### Option 3: Rotate Your Credentials (Recommended)
If secrets were exposed:
1. **MongoDB**: Change your database password in MongoDB Atlas
2. **Pusher**: Regenerate your Pusher secret key
3. Update your `.env` files with new credentials

## 📋 Pre-Push Checklist

- [ ] `.env` files are NOT in `git status`
- [ ] No hardcoded passwords/secrets in code files
- [ ] `.gitignore` includes `.env` and other sensitive files
- [ ] `.env.example` files exist (with placeholder values)
- [ ] No API keys or secrets in commit history
- [ ] README.md doesn't contain real credentials

## 🔐 Best Practices

1. **Never commit `.env` files** - Always use `.env.example` as a template
2. **Use environment variables** - Never hardcode secrets
3. **Rotate credentials regularly** - Especially if exposed
4. **Use GitHub Secrets** - For CI/CD pipelines
5. **Enable 2FA** - On your GitHub account
6. **Review commits** - Before pushing, review what you're committing

## 📝 What's Safe to Commit

✅ Safe:
- `.env.example` files (with placeholder values)
- `package.json` and `package-lock.json`
- Source code (without hardcoded secrets)
- Configuration files (using env vars)
- README.md (without real credentials)

❌ Never Commit:
- `.env` files with real credentials
- API keys or secrets
- Database passwords
- Private keys (`.pem`, `.key` files)
- Personal access tokens

## 🛡️ Additional Security Measures

1. **Make repository private** if it contains sensitive business logic
2. **Use GitHub's secret scanning** - It will alert you if secrets are detected
3. **Set up branch protection** - Prevent accidental pushes to main
4. **Use dependency scanning** - Check for vulnerable packages

## 📞 If Secrets Are Exposed

1. **Immediately rotate** all exposed credentials
2. **Check access logs** - MongoDB Atlas, Pusher dashboard
3. **Review recent activity** - Look for unauthorized access
4. **Consider using a secret manager** - AWS Secrets Manager, Azure Key Vault, etc.

---

**Remember**: Once secrets are pushed to GitHub (even in private repos), consider them compromised and rotate them immediately.

