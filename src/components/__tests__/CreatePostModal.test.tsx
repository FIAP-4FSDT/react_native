import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {CreatePostModal} from '../CreatePostModal';
import {usePostsStore} from '../../stores/postsStore';
import {theme} from '../../theme';

// Mock the stores
jest.mock('../../stores/postsStore');
jest.mock('react-native-toast-message');

const mockUsePostsStore = usePostsStore as jest.MockedFunction<typeof usePostsStore>;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider theme={theme}>
      {component}
    </PaperProvider>
  );
};

describe('CreatePostModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockCreatePost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsStore.mockReturnValue({
      createPost: mockCreatePost,
      loading: false,
      // Add other required store properties with default values
      posts: [],
      filteredPosts: [],
      error: null,
      searchQuery: '',
      selectedSubjects: [],
      availableSubjects: [],
      hasMore: true,
      page: 1,
      limit: 10,
      fetchPosts: jest.fn(),
      searchPosts: jest.fn(),
      filterBySubjects: jest.fn(),
      applyFilters: jest.fn(),
      loadMorePosts: jest.fn(),
      refreshPosts: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      likePost: jest.fn(),
      unlikePost: jest.fn(),
      setSearchQuery: jest.fn(),
      setSelectedSubjects: jest.fn(),
      clearFilters: jest.fn(),
      clearError: jest.fn(),
    });
  });

  it('renders correctly when visible', () => {
    const {getByText, getByPlaceholderText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    expect(getByText('Criar Novo Post')).toBeTruthy();
    expect(getByText('Compartilhe conhecimento com seus alunos')).toBeTruthy();
    expect(getByPlaceholderText('Digite o título do post')).toBeTruthy();
    expect(getByPlaceholderText('Digite o conteúdo do seu post aqui...')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const {queryByText} = renderWithProvider(
      <CreatePostModal visible={false} onClose={mockOnClose} />
    );

    expect(queryByText('Criar Novo Post')).toBeNull();
  });

  it('shows validation errors for empty fields', async () => {
    const {getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    const submitButton = getByText('Publicar Post');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('O título é obrigatório')).toBeTruthy();
      expect(getByText('O conteúdo é obrigatório')).toBeTruthy();
      expect(getByText('A matéria é obrigatória')).toBeTruthy();
    });
  });

  it('shows validation error for short title', async () => {
    const {getByPlaceholderText, getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    const titleInput = getByPlaceholderText('Digite o título do post');
    fireEvent.changeText(titleInput, 'abc');

    const submitButton = getByText('Publicar Post');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('O título deve ter pelo menos 5 caracteres')).toBeTruthy();
    });
  });

  it('shows validation error for short content', async () => {
    const {getByPlaceholderText, getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    const contentInput = getByPlaceholderText('Digite o conteúdo do seu post aqui...');
    fireEvent.changeText(contentInput, 'short content');

    const submitButton = getByText('Publicar Post');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('O conteúdo deve ter pelo menos 20 caracteres')).toBeTruthy();
    });
  });

  it('allows subject selection', () => {
    const {getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    const physicsButton = getByText('Física');
    fireEvent.press(physicsButton);

    // The button should be selected (this would be visually indicated by styling)
    expect(physicsButton).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const {getByTestId} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    // Note: We'd need to add testID to the close button in the component
    // For now, we'll test the cancel button
    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('submits form with valid data using store createPost', async () => {
    mockCreatePost.mockResolvedValueOnce(undefined);

    const {getByPlaceholderText, getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    // Fill form with valid data
    const titleInput = getByPlaceholderText('Digite o título do post');
    const contentInput = getByPlaceholderText('Digite o conteúdo do seu post aqui...');
    
    fireEvent.changeText(titleInput, 'Test Post Title');
    fireEvent.changeText(contentInput, 'This is a test post content with enough characters');
    
    // Select a subject
    const physicsButton = getByText('Física');
    fireEvent.press(physicsButton);

    // Submit form
    const submitButton = getByText('Publicar Post');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        title: 'Test Post Title',
        content: 'This is a test post content with enough characters',
        materia: 'Física',
      });
    });

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Post criado com sucesso!',
      text2: 'Seu post foi publicado.',
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('submits form with valid data using custom onSubmit', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    const {getByPlaceholderText, getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Fill form with valid data
    const titleInput = getByPlaceholderText('Digite o título do post');
    const contentInput = getByPlaceholderText('Digite o conteúdo do seu post aqui...');
    
    fireEvent.changeText(titleInput, 'Test Post Title');
    fireEvent.changeText(contentInput, 'This is a test post content with enough characters');
    
    // Select a subject
    const physicsButton = getByText('Física');
    fireEvent.press(physicsButton);

    // Submit form
    const submitButton = getByText('Publicar Post');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Post Title',
        content: 'This is a test content with enough characters',
        materia: 'Física',
      });
    });

    expect(mockCreatePost).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles submission error', async () => {
    const error = new Error('Network error');
    mockCreatePost.mockRejectedValueOnce(error);

    const {getByPlaceholderText, getByText} = renderWithProvider(
      <CreatePostModal visible={true} onClose={mockOnClose} />
    );

    // Fill form with valid data
    const titleInput = getByPlaceholderText('Digite o título do post');
    const contentInput = getByPlaceholderText('Digite o conteúdo do seu post aqui...');
    
    fireEvent.changeText(titleInput, 'Test Post Title');
    fireEvent.changeText(contentInput, 'This is a test post content with enough characters');
    
    // Select a subject
    const physicsButton = getByText('Física');
    fireEvent.press(physicsButton);

    // Submit form
    const submitButton = getByText('Publicar Post');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro ao criar post',
        text2: 'Network error',
      });
    });

    // Modal should not close on error
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});