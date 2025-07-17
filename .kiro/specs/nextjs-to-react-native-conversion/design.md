# Design Document

## Overview

This design outlines the conversion of the existing Next.js web application into the React Native mobile application. The project currently has both a Next.js web app (in the `app/` directory) and a React Native app (in the `src/` directory). The goal is to migrate all web functionality into the mobile app, creating a unified mobile-first educational portal.

The conversion will leverage the existing React Native architecture while incorporating missing features from the web application. The design maintains the current state management (Zustand), navigation structure (React Navigation), and API integration patterns while adding new components and screens as needed.

## Architecture

### Current React Native Architecture
- **Navigation**: React Navigation with Stack and Bottom Tab navigators
- **State Management**: Zustand stores for authentication and posts
- **UI Components**: React Native Paper for Material Design
- **Storage**: AsyncStorage for local data persistence
- **API Integration**: Custom service layer with fetch-based HTTP client

### Enhanced Architecture for Conversion
The existing architecture will be extended with:
- **Enhanced Post Management**: Full CRUD operations with modals and dialogs
- **Advanced Search and Filtering**: Real-time search with subject filtering
- **Comments System**: Nested comments with real-time updates
- **Like System**: Optimistic updates with proper state management
- **Theme System**: Light/dark mode toggle with persistence
- **Enhanced Authentication**: Password reset flow and improved error handling
- **User Management System**: Complete CRUD operations for teachers and students
- **Administrative Interface**: Centralized management panel for all content and users
- **Role-Based Access Control**: Proper permission management for different user types

## Components and Interfaces

### New Components to Create

#### 1. Modal Components
```typescript
// CreatePostModal.tsx
interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => Promise<void>;
}

// EditPostModal.tsx
interface EditPostModalProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  onSubmit: (data: UpdatePostData) => Promise<void>;
}

// DeletePostDialog.tsx
interface DeletePostDialogProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}
```

#### 2. Enhanced Post Components
```typescript
// PostCard.tsx (Enhanced)
interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  showActions?: boolean;
}

// CommentsSection.tsx
interface CommentsSectionProps {
  postId: number;
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

// LikeButton.tsx
interface LikeButtonProps {
  postId: number;
  isLiked: boolean;
  likesCount: number;
  onToggle: () => void;
}
```

#### 3. Search and Filter Components
```typescript
// SearchBar.tsx
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

// SubjectFilter.tsx
interface SubjectFilterProps {
  subjects: string[];
  selectedSubjects: string[];
  onSelectionChange: (subjects: string[]) => void;
}
```

#### 4. Theme Components
```typescript
// ThemeToggle.tsx
interface ThemeToggleProps {
  currentTheme: 'light' | 'dark';
  onToggle: () => void;
}
```

#### 5. User Management Components
```typescript
// CreateUserModal.tsx
interface CreateUserModalProps {
  visible: boolean;
  userType: 'professor' | 'aluno';
  onClose: () => void;
  onSubmit: (data: CreateUserData) => Promise<void>;
}

// EditUserModal.tsx
interface EditUserModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserData) => Promise<void>;
}

// DeleteUserDialog.tsx
interface DeleteUserDialogProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

// UserCard.tsx
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  showActions?: boolean;
}

// UserList.tsx
interface UserListProps {
  users: User[];
  userType: 'professor' | 'aluno';
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}
```

#### 6. Administrative Components
```typescript
// AdminPanel.tsx
interface AdminPanelProps {
  currentSection: 'posts' | 'teachers' | 'students';
  onSectionChange: (section: string) => void;
}

// AdminPostsList.tsx
interface AdminPostsListProps {
  posts: Post[];
  loading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

// AdminStats.tsx
interface AdminStatsProps {
  stats: {
    totalPosts: number;
    totalTeachers: number;
    totalStudents: number;
    recentActivity: number;
  };
}
```

### Enhanced Stores

#### 1. Enhanced Posts Store
```typescript
interface PostsState {
  // Existing properties
  posts: Post[];
  loading: boolean;
  error: string | null;
  
  // New properties for web features
  searchQuery: string;
  selectedSubjects: string[];
  filteredPosts: Post[];
  hasMore: boolean;
  page: number;
  
  // Enhanced methods
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  filterBySubjects: (subjects: string[]) => void;
  likePost: (postId: number) => Promise<void>;
  unlikePost: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
}
```

#### 2. New Theme Store
```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  loadStoredTheme: () => Promise<void>;
}
```

#### 3. New Comments Store
```typescript
interface CommentsState {
  commentsByPost: Record<number, Comment[]>;
  loading: boolean;
  error: string | null;
  
  fetchComments: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
}
```

#### 4. New Users Store
```typescript
interface UsersState {
  teachers: User[];
  students: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  
  fetchTeachers: (page?: number, limit?: number) => Promise<void>;
  fetchStudents: (page?: number, limit?: number) => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: number, userData: UpdateUserData) => Promise<void>;
  deleteUser: (id: number, userType: 'professor' | 'aluno') => Promise<void>;
  searchUsers: (query: string, userType: 'professor' | 'aluno') => Promise<void>;
}
```

#### 5. New Admin Store
```typescript
interface AdminState {
  stats: {
    totalPosts: number;
    totalTeachers: number;
    totalStudents: number;
    recentActivity: number;
  };
  loading: boolean;
  error: string | null;
  
  fetchStats: () => Promise<void>;
  fetchAllPosts: () => Promise<void>;
  bulkDeletePosts: (postIds: number[]) => Promise<void>;
  bulkDeleteUsers: (userIds: number[], userType: 'professor' | 'aluno') => Promise<void>;
}
```

### Enhanced Services

#### 1. Enhanced Posts Service
```typescript
class PostsService {
  // Existing methods
  fetchPosts(): Promise<Post[]>;
  createPost(data: CreatePostData): Promise<Post>;
  updatePost(id: number, data: UpdatePostData): Promise<Post>;
  deletePost(id: number): Promise<void>;
  
  // New methods for web features
  searchPosts(query: string): Promise<Post[]>;
  likePost(postId: number): Promise<{ likes: number }>;
  unlikePost(postId: number): Promise<{ likes: number }>;
  fetchPostsBySubject(subject: string): Promise<Post[]>;
}
```

#### 2. New Comments Service
```typescript
class CommentsService {
  fetchComments(postId: number): Promise<Comment[]>;
  addComment(postId: number, content: string): Promise<Comment>;
  deleteComment(commentId: number): Promise<void>;
}
```

#### 3. New Users Service
```typescript
class UsersService {
  fetchTeachers(page?: number, limit?: number): Promise<{ users: User[], hasMore: boolean }>;
  fetchStudents(page?: number, limit?: number): Promise<{ users: User[], hasMore: boolean }>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(id: number, userData: UpdateUserData): Promise<User>;
  deleteUser(id: number): Promise<void>;
  searchUsers(query: string, userType: 'professor' | 'aluno'): Promise<User[]>;
}
```

#### 4. New Admin Service
```typescript
class AdminService {
  fetchStats(): Promise<AdminStats>;
  fetchAllPosts(): Promise<Post[]>;
  bulkDeletePosts(postIds: number[]): Promise<void>;
  bulkDeleteUsers(userIds: number[], userType: 'professor' | 'aluno'): Promise<void>;
  exportData(type: 'posts' | 'users'): Promise<Blob>;
}
```

## Data Models

### Enhanced Post Model
```typescript
interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  nome: string;
  created_at: string;
  updated_at?: string;
  materia?: string;
  likes: number;
  comments_count: number;
  is_liked_by_user: boolean;
  author: {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'professor' | 'aluno';
    avatar?: string;
  };
}
```

### New Comment Model
```typescript
interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: string;
  author: {
    id: number;
    nome: string;
    email: string;
    avatar?: string;
  };
}
```

### Enhanced User Model
```typescript
interface User {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'professor' | 'aluno';
  avatar?: string;
  created_at: string;
  posts_count?: number;
  likes_count?: number;
}
```

## Error Handling

### API Error Handling
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handling in services
const handleApiError = (error: any): never => {
  if (error.response) {
    throw new ApiError(
      error.response.data.message || 'API Error',
      error.response.status,
      error.response.data.code
    );
  }
  throw new ApiError('Network Error', 0);
};
```

### Store Error Handling
```typescript
// Consistent error handling across stores
const handleStoreError = (error: unknown, set: Function) => {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';
  
  set({ 
    error: errorMessage, 
    loading: false 
  });
  
  // Log error for debugging
  console.error('Store Error:', error);
};
```

### UI Error Display
```typescript
// Toast notifications for errors
const showErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: 'Erro',
    text2: message,
    visibilityTime: 4000,
  });
};

// Error boundary for critical errors
class ErrorBoundary extends React.Component {
  // Implementation for catching and displaying critical errors
}
```

## Testing Strategy

### Unit Testing
- **Components**: Test all new components with React Native Testing Library
- **Stores**: Test Zustand store actions and state changes
- **Services**: Test API service methods with mocked responses
- **Utils**: Test utility functions and helpers

### Integration Testing
- **Navigation**: Test navigation flows between screens
- **API Integration**: Test complete API workflows
- **State Management**: Test store interactions with components

### E2E Testing
- **Authentication Flow**: Complete login/register/logout flow
- **Post Management**: Create, edit, delete posts flow
- **Search and Filter**: Search functionality and filtering
- **Comments and Likes**: User interaction features

### Testing Tools
- **Jest**: Unit and integration testing framework
- **React Native Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking for tests
- **Detox**: E2E testing framework for React Native

## Migration Strategy

### Phase 1: Component Migration
1. Create new modal components (CreatePost, EditPost, DeletePost)
2. Enhance existing PostCard component with like/comment functionality
3. Create search and filter components
4. Implement theme toggle component

### Phase 2: Store Enhancement
1. Enhance PostsStore with new functionality
2. Create ThemeStore for theme management
3. Create CommentsStore for comment management
4. Update AuthStore with enhanced error handling

### Phase 3: Screen Updates
1. Update HomeScreen with enhanced post feed
2. Update SearchScreen with advanced filtering
3. Update MyPostsScreen with management actions
4. Add new screens for post details and comments

### Phase 4: Service Integration
1. Enhance PostsService with new API endpoints
2. Create CommentsService for comment operations
3. Update AuthService with password reset functionality
4. Implement proper error handling across all services

### Phase 5: Cleanup and Optimization
1. Remove all Next.js files and dependencies
2. Update package.json to remove web-specific packages
3. Optimize bundle size and performance
4. Update documentation and README

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Implement lazy loading for post images and content
- **Pagination**: Implement proper pagination for post feeds
- **Caching**: Cache API responses and implement offline support
- **Image Optimization**: Use React Native Fast Image for better performance
- **Memory Management**: Proper cleanup of subscriptions and listeners

### Bundle Size Optimization
- Remove unused dependencies from package.json
- Implement code splitting where possible
- Optimize image assets and use appropriate formats
- Use React Native's built-in performance tools for monitoring