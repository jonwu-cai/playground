# Work Command - Implement GitHub Issue

This command takes a GitHub issue number as an argument and implements the feature/fix following React Native and Expo best practices, then tests it with iOS simulator.

## Usage
```
/work <issue_number>
```

## What it does:
1. Creates a new feature branch for the issue
2. Fetches the GitHub issue details
3. Creates a development plan with todos
4. Implements the feature following React Native/Expo best practices
5. Runs type checking and linting
6. Tests the implementation with iOS simulator MCP
7. Commits all changes with descriptive message
8. Creates a draft pull request for review

## Arguments:
- `issue_number`: The GitHub issue number to implement (required)

## Example:
```
/work 1
```

---

# Implementation

You are tasked with implementing a GitHub issue for this React Native Expo project. Follow these steps:

## Step 1: Create Feature Branch
```bash
# Create and checkout new branch for the issue
git checkout -b "feature/issue-$ARGUMENTS"
```

## Step 2: Fetch Issue Details
```bash
gh issue view $ARGUMENTS --json title,body,labels,assignees
```

Parse the issue to understand:
- Feature requirements
- Acceptance criteria  
- Technical specifications
- Dependencies needed

## Step 3: Create Development Plan
Use TodoWrite to create a comprehensive plan with these phases:
1. **Setup & Dependencies** - Install required packages
2. **Core Implementation** - Build main functionality  
3. **UI Components** - Create React Native components
4. **Integration** - Connect components and logic
5. **Testing** - Type checking, linting, simulator testing
6. **Documentation** - Update CLAUDE.md if needed

## Step 4: Implementation Best Practices

### React Native & Expo Standards:
- Use TypeScript for all new files
- Follow functional components with hooks
- Implement proper error boundaries
- Use Expo-compatible libraries only
- Follow accessibility guidelines
- Optimize FlatList performance when applicable
- Use proper state management patterns
- Implement loading and error states

### Code Organization:
```
components/           # Reusable UI components
screens/             # Screen components  
services/            # API services and utilities
types/               # TypeScript definitions
hooks/               # Custom React hooks
constants/           # App constants
```

### TypeScript Best Practices:
- Define proper interfaces/types for all data
- Use strict typing, avoid `any`
- Create type guards for API responses
- Export types for reusability

### Performance Optimizations:
- Use React.memo for expensive components
- Implement proper key extractors for lists
- Use getItemLayout for known item sizes
- Lazy load heavy components when possible

## Step 5: Dependencies Management
Always check existing dependencies first:
```bash
npm list --depth=0
```

Install new dependencies with proper versions:
```bash
npm install <package>@<compatible-version>
```

Update package.json scripts if needed.

## Step 6: Implementation Process
1. **Start development server**: `npm start`
2. **Create components incrementally**
3. **Test each component as you build**
4. **Run type checking**: `npx tsc --noEmit`
5. **Run linting**: `npx expo lint`
6. **Fix any issues immediately**

## Step 7: iOS Simulator Testing

### Prerequisites Check:
```bash
# Check if iOS simulator MCP is available
which idb
xcrun simctl list devices
```

### Simulator Testing Process:
1. **Boot simulator**: Start iOS simulator
2. **Launch app**: `npm run ios`
3. **Take initial screenshot**
4. **Test core functionality**:
   - Navigate through the feature
   - Test user interactions
   - Verify UI elements
   - Test error states
   - Test loading states
5. **Take final screenshot**
6. **Record end-to-end demonstration**

### Testing Commands (if iOS simulator MCP is available):
```bash
# Take screenshot
ios-simulator screenshot

# Describe current screen
ios-simulator describe

# Test interactions
ios-simulator tap <x> <y>
ios-simulator input-text "<text>"
ios-simulator swipe <x1> <y1> <x2> <y2>
```

## Step 8: Quality Assurance
Before marking complete:
- [ ] All TypeScript errors resolved
- [ ] All lint warnings addressed  
- [ ] App runs without crashes
- [ ] Feature works as specified in issue
- [ ] Acceptance criteria met
- [ ] iOS simulator testing completed
- [ ] Screenshots/recording captured

## Step 9: Documentation
Update CLAUDE.md with:
- New dependencies added
- New scripts or commands
- Testing procedures
- Any setup requirements

## Step 10: Commit and Create Pull Request

### Commit Changes
```bash
# Check git status and staged changes
git status
git diff
git log --oneline -5

# Add all changes to staging
git add .

# Create comprehensive commit message
git commit -m "$(cat <<'EOF'
🎯 Implement [Feature/Fix Name] for issue #$ARGUMENTS

- Brief description of main changes
- Key components/files added or modified
- Technical improvements made
- Dependencies added if any
- Testing completed

Fixes #$ARGUMENTS

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Create Draft Pull Request
```bash
# Push feature branch to remote
git push -u origin "feature/issue-$ARGUMENTS"

# Create draft pull request
gh pr create --draft --title "🎯 Implement [Feature/Fix Name] for issue #$ARGUMENTS" --body "$(cat <<'EOF'
## Summary
- Brief description of what this PR implements
- Reference to the GitHub issue it addresses

## Changes Made
- [ ] List of main changes
- [ ] Components/files added or modified
- [ ] Dependencies added
- [ ] Configuration changes

## Testing
- [ ] TypeScript compilation passes
- [ ] ESLint passes with no warnings
- [ ] App runs without crashes
- [ ] Feature works as expected
- [ ] iOS simulator testing completed

## Screenshots/Demo
[Add screenshots or demo videos if applicable]

Closes #$ARGUMENTS

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

## Step 11: Completion
1. **Mark all todos as completed**
2. **Verify commit and PR creation**
3. **Update issue with implementation details**
4. **Share testing results and screenshots**
5. **Request review when ready**

---

## Error Handling
If any step fails:
1. Document the error in todos
2. Research the solution
3. Fix incrementally
4. Continue with remaining steps
5. Don't mark todos complete until issues resolved

## Notes
- Always prioritize user experience and performance
- Follow React Native community conventions
- Keep components small and focused
- Test thoroughly on iOS simulator before completing
- Document any limitations or known issues
- Create draft PR for review before merging
- Include comprehensive commit messages with context

