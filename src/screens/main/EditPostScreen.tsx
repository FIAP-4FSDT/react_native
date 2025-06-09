import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  Appbar,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import {MainStackParamList} from '../../navigation/MainNavigator';
import {usePostsStore} from '../../stores/postsStore';
import {postsService} from '../../services/postsService';
import {Post} from '../../stores/postsStore';
import {colors} from '../../theme';

type EditPostScreenRouteProp = RouteProp<MainStackParamList, 'EditPost'>;
type EditPostScreenNavigationProp = StackNavigationProp<MainStackParamList, 'EditPost'>;

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

const EditPostScreen: React.FC = () => {
  const navigation = useNavigation<EditPostScreenNavigationProp>();
  const route = useRoute<EditPostScreenRouteProp>();
  const {postId} = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    materia: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPost, setLoadingPost] = useState(true);

  const {updatePost, loading} = usePostsStore();

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoadingPost(true);
      const postData = await postsService.fetchPost(postId);
      const postToEdit = Array.isArray(postData) ? postData[0] : postData;
      
      setPost(postToEdit);
      setFormData({
        title: postToEdit.title,
        content: postToEdit.content,
        materia: postToEdit.materia || '',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar post',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      navigation.goBack();
    } finally {
      setLoadingPost(false);
    }
  };

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
      await updatePost(postId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        materia: formData.materia,
      });

      Toast.show({
        type: 'success',
        text1: 'Post atualizado com sucesso!',
        text2: 'Suas alterações foram salvas.',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar post',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Limpar erro quando o usuário digita
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  if (loadingPost) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={handleGoBack} />
          <Appbar.Content title="Carregando..." />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Editar Post" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          <Card style={styles.formCard}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleLarge" style={styles.formTitle}>
                Editar Post
              </Text>
              <Text variant="bodyMedium" style={styles.formSubtitle}>
                Atualize as informações do seu post
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
                    compact>
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
                numberOfLines={8}
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
                  onPress={handleGoBack}
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
                    <ActivityIndicator color={colors.surface} />
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    elevation: 4,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
  },
  cardContent: {
    padding: 24,
  },
  formTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formSubtitle: {
    color: colors.text.secondary,
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 12,
    marginTop: 16,
    color: colors.text.primary,
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  subjectButton: {
    margin: 4,
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

export default EditPostScreen;