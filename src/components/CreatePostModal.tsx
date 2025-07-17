import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  IconButton,
  Portal,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {usePostsStore, CreatePostData} from '../stores/postsStore';
import {colors} from '../theme';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: CreatePostData) => Promise<void>;
}

const subjects = [
  'Física',
  'Literatura',
  'Matemática',
  'História',
  'Biologia',
  'Química',
  'Geografia',
  'Filosofia',
  'Sociologia',
  'Artes',
  'Educação Física',
  'Inglês',
  'Espanhol',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    materia: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {createPost, loading} = usePostsStore();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setFormData({
        title: '',
        content: '',
        materia: '',
      });
      setErrors({});
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'O título deve ter pelo menos 5 caracteres';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'O conteúdo é obrigatório';
    } else if (formData.content.trim().length < 20) {
      newErrors.content = 'O conteúdo deve ter pelo menos 20 caracteres';
    }

    if (!formData.materia) {
      newErrors.materia = 'A matéria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const postData: CreatePostData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        materia: formData.materia,
      };

      // Use custom onSubmit if provided, otherwise use store's createPost
      if (onSubmit) {
        await onSubmit(postData);
      } else {
        await createPost(postData);
      }

      Toast.show({
        type: 'success',
        text1: 'Post criado com sucesso!',
        text2: 'Seu post foi publicado.',
      });

      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar post',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  const updateFormData = (field: keyof CreatePostData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <Card style={styles.modalCard}>
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.title}>
                Criar Novo Post
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={handleClose}
                disabled={loading}
                style={styles.closeButton}
              />
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              
              <Card.Content style={styles.cardContent}>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Compartilhe conhecimento com seus alunos
                </Text>

                <TextInput
                  label="Título"
                  value={formData.title}
                  onChangeText={(value) => updateFormData('title', value)}
                  mode="outlined"
                  error={!!errors.title}
                  disabled={loading}
                  style={styles.input}
                  maxLength={100}
                  placeholder="Digite o título do post"
                />
                {errors.title && (
                  <Text variant="bodySmall" style={styles.errorText}>
                    {errors.title}
                  </Text>
                )}

                <Text variant="bodyMedium" style={styles.label}>
                  Matéria
                </Text>
                <View style={styles.subjectContainer}>
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      mode={formData.materia === subject ? 'contained' : 'outlined'}
                      onPress={() => updateFormData('materia', subject)}
                      style={[
                        styles.subjectButton,
                        formData.materia === subject && styles.selectedSubjectButton,
                      ]}
                      compact
                      disabled={loading}>
                      {subject}
                    </Button>
                  ))}
                </View>
                {errors.materia && (
                  <Text variant="bodySmall" style={styles.errorText}>
                    {errors.materia}
                  </Text>
                )}

                <TextInput
                  label="Conteúdo"
                  value={formData.content}
                  onChangeText={(value) => updateFormData('content', value)}
                  mode="outlined"
                  multiline
                  numberOfLines={6}
                  error={!!errors.content}
                  disabled={loading}
                  style={styles.contentInput}
                  placeholder="Digite o conteúdo do seu post aqui..."
                />
                {errors.content && (
                  <Text variant="bodySmall" style={styles.errorText}>
                    {errors.content}
                  </Text>
                )}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleClose}
                    disabled={loading}
                    style={styles.cancelButton}>
                    Cancelar
                  </Button>

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.submitButton}>
                    {loading ? (
                      <ActivityIndicator color={colors.surface} size="small" />
                    ) : (
                      'Publicar Post'
                    )}
                  </Button>
                </View>
              </Card.Content>
            </ScrollView>
          </Card>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 16,
  },
  keyboardView: {
    flex: 1,
    maxHeight: '90%',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardContent: {
    padding: 24,
    paddingTop: 16,
  },
  subtitle: {
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 12,
    marginTop: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  subjectButton: {
    marginBottom: 8,
  },
  selectedSubjectButton: {
    backgroundColor: colors.primary,
  },
  contentInput: {
    marginBottom: 8,
    marginTop: 16,
    minHeight: 120,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});