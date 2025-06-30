# Work Command - Implement GitHub Issue

This command takes a GitHub issue number as an argument and implements the feature/fix following React Native and Expo best practices, then tests it with iOS simulator.

## Usage
```
/work <issue_number>
```

## What it does:
1. Fetches the GitHub issue details
2. Creates a development plan with todos
3. Implements the feature following React Native/Expo best practices
4. Runs type checking and linting
5. Tests the implementation with iOS simulator MCP
6. Records end-to-end feature demonstration

## Arguments:
- `issue_number`: The GitHub issue number to implement (required)

## Example:
```
/work 1
```

---

# Implementation

You are tasked with implementing a GitHub issue for this React Native Expo project. Follow these steps:

## Step 1: Fetch Issue Details
```bash
gh issue view $ARGUMENTS --json title,body,labels,assignees
```

Parse the issue to understand:
- Feature requirements
- Acceptance criteria  
- Technical specifications
- Dependencies needed

## Step 2: Create Development Plan
Use TodoWrite to create a comprehensive plan with these phases:
1. **Setup & Dependencies** - Install required packages
2. **Core Implementation** - Build main functionality  
3. **UI Components** - Create React Native components
4. **Integration** - Connect components and logic
5. **Testing** - Type checking, linting, simulator testing
6. **Documentation** - Update CLAUDE.md if needed

## Step 3: Implementation Best Practices

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

