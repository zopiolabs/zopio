# Security Policy

## 🛡️ Reporting Security Vulnerabilities

The Zopio team takes security seriously. We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge your contributions.

### Where to Report

**DO NOT** open a public issue for security vulnerabilities. Instead, please report them privately through one of these channels:

1. **GitHub Security Advisories (Preferred):**
   - Go to our [Security Advisories](https://github.com/zopiolabs/zopio/security/advisories)
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email:**
   - Send details to: <security@zopio.com>
   - For sensitive information, please encrypt your message using our [PGP key](https://keys.openpgp.org/search?q=security@zopio.com)
   - [Download our PGP key (.asc)](https://zopio.dev/security/pgp-key.asc)

### What to Include

Please provide as much information as possible:

- **Description**: Clear explanation of the vulnerability
- **Impact**: Potential impact or CVSS score (if known)
- **Steps to Reproduce**: Detailed steps for reproduction
- **Affected Versions**: List of affected Zopio versions
- **Proof of Concept**: Code samples, screenshots, or logs if available
- **Suggested Fix**: If you have ideas for remediation

### Disclosure Timeline

| Timeline Stage        | Target Time |
|---------------------- |----------- |
| Report Acknowledgment | Within 48 hours |
| Initial Response      | Within 2 business days |
| Fix Deployment        | Within 7 days for critical issues |
| Public Disclosure     | After fix or within 90 days of report |

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your report
2. **Ongoing Communication**: Regular status updates
3. **Timely Fix**: Critical issues within 7 days where possible
4. **Recognition**: Your contribution listed in our acknowledgments (unless you prefer anonymity)
5. **Rewards**: While we don't have a formal bounty program, discretionary rewards may be offered for high-impact findings

## 🔒 Security Measures

### Our Security Practices

- **Code Reviews**: All code changes require peer review before merging
- **Automated Scanning**: CodeQL and secret scanning tools in CI/CD pipelines
- **Dependency Management**: Automated updates via Dependabot
- **Secret Scanning**: Prevents accidental leaks of credentials
- **Security Headers**: Applied across all applications
- **Input Validation**: Comprehensive input sanitization
- **Authentication**: Secure authentication using Clerk
- **Rate Limiting**: Abuse prevention using Arcjet ([Arcjet docs](https://arcjet.com/docs))

### Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Supported |
| < 1.0.0 | ❌ Not Supported |

## 🚨 Security Best Practices for Contributors

When contributing to Zopio, please:

1. **Never commit secrets**: API keys, passwords, tokens, etc.
2. **Validate inputs**: Sanitize all user inputs
3. **Use parameterized queries**: Prevent SQL injection
4. **Implement authentication and authorization checks**
5. **Handle errors securely**: Avoid sensitive info leakage
6. **Keep dependencies updated**
7. **Follow OWASP Top 10 guidelines**
8. **Check for exposed ports or unintended endpoints**
9. **Review for logging sensitive data**

## 📋 Security Checklist for PRs

Before submitting your PR:

- [ ] No hardcoded secrets or credentials
- [ ] All user inputs are validated and sanitized
- [ ] Proper authentication and authorization implemented
- [ ] Error messages do not expose sensitive information
- [ ] Dependencies are up-to-date
- [ ] Security headers configured where applicable
- [ ] Rate limiting is implemented if needed
- [ ] No unintended debug logs or sensitive logs included
- [ ] No open ports or unintended endpoints

## 🔐 Disclosure Policy

- We request **90 days** to address and fix issues before public disclosure
- We will work with you to clarify and resolve the issue
- You will be credited (if desired)
- We fully support responsible disclosure and will not pursue legal action for good faith reports

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/authentication)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)
- [Arcjet Security](https://arcjet.com/docs/security)

## 🙏 Acknowledgments

We thank the following security researchers for their contributions:

<!-- Security researchers will be listed here -->

---

**Thank you for helping keep Zopio and its users safe!** 🛡️
