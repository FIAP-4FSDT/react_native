# CreatePostModal Component

## Overview

The `CreatePostModal` component is a React Native modal that allows teachers to create new educational posts. It provides a form with validation for title, content, and subject selection.

## Features

- **Form Validation**: Validates title (minimum 5 characters) and content (minimum 20 characters)
- **Subject Selection**: Allows selection from predefined subjects
- **Integration with PostsStore**: Automatically integrates with the Zustand posts store
- **Custom Submit Handler**: Supports custom onSubmit function for flexibility
- **Loading States**: Shows loading indicators during submission
- **Error Handling**: Displays toast notifications for success/error states
- **Responsive Design**: Adapts to different screen sizes with keyboard handling

## Props

```typescript
interface CreatePostModalProps {
  visible: boolean;           // Controls modal visibility
  onClose: () => void;        // Called when modal should close
  onSubmit?: (data: CreatePostData) => Promise<void>; // Optional custom submit handler
}
```

## Usage

### Basic Usage with PostsStore

```typescript
import React from 'react';
import {CreatePostModal} from '../components/CreatePostModal';
import {useCreatePostModal} from '../hooks/useCreatePostModal';

const MyComponent = () => {
  const {isOpen, openModal, closeModal} = useCreatePostModal();

  return (
    <>
      <Button onPress={openModal}>Create Post</Button>
      <CreatePostModal
        visible={isOpen}
        onClose={closeModal}
      />
    </>
  );
};
```

### Usage with Custom Submit Handler

```typescript
import React from 'react';
import {CreatePostModal} from '../components/CreatePostModal';

const MyComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCustomSubmit = async (data: CreatePostData) => {
    // Custom logic here
    console.log('Creating post:', data);
    await myCustomPostService.create(data);
  };

  return (
    <CreatePostModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onSubmit={handleCustomSubmit}
    />
  );
};
```

## Form Fields

### Title
- **Type**: Text input
- **Validation**: Required, minimum 5 characters
- **Max Length**: 100 characters

### Content
- **Type**: Multiline text input
- **Validation**: Required, minimum 20 characters
- **Rows**: 6 lines initially, expandable

### Subject (Matéria)
- **Type**: Button selection
- **Validation**: Required
- **Options**: Física, Literatura, Matemática, História, Biologia, Química, Geografia, Filosofia, Sociologia, Artes, Educação Física, Inglês, Espanhol

## Integration with Existing Screens

The component has been integrated into the `HomeScreen` to replace the navigation-based post creation flow:

```typescript
// In HomeScreen.tsx
import {CreatePostModal} from '../../components/CreatePostModal';
import {useCreatePostModal} from '../../hooks/useCreatePostModal';

const HomeScreen = () => {
  const {isOpen, openModal, closeModal} = useCreatePostModal();

  const handleCreatePost = () => {
    openModal(); // Instead of navigation.navigate('CreatePost')
  };

  return (
    <>
      {/* Other components */}
      <FAB onPress={handleCreatePost} />
      <CreatePostModal visible={isOpen} onClose={closeModal} />
    </>
  );
};
```

## Styling

The component uses the app's theme system and follows Material Design principles:

- **Colors**: Uses theme colors from `src/theme/index.ts`
- **Typography**: Uses React Native Paper's typography variants
- **Spacing**: Consistent padding and margins
- **Elevation**: Proper shadow and elevation for modal

## Error Handling

The component handles various error scenarios:

1. **Validation Errors**: Shows inline error messages for invalid fields
2. **Network Errors**: Shows toast notifications for API failures
3. **Loading States**: Disables form during submission
4. **Form Reset**: Clears form when modal closes

## Accessibility

- **Screen Reader Support**: Proper labels and descriptions
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling when modal opens/closes
- **Error Announcements**: Screen readers announce validation errors

## Testing

The component includes comprehensive unit tests covering:

- Rendering with different props
- Form validation scenarios
- Submission handling (both success and error cases)
- Integration with PostsStore
- Custom onSubmit handler usage

Run tests with:
```bash
npm test -- --testPathPatterns=CreatePostModal.test.tsx
```

## Dependencies

- `react-native-paper`: UI components and theming
- `zustand`: State management (PostsStore integration)
- `react-native-toast-message`: Toast notifications
- `@react-native-async-storage/async-storage`: Token storage (via PostsService)

## Requirements Fulfilled

This component fulfills the following task requirements:

- ✅ **Build modal with form fields for title, content, and subject**
- ✅ **Add form validation and submission handling**
- ✅ **Integrate with PostsStore for creating posts**
- ✅ **Requirements 2.1, 2.3**: Teacher post creation functionality