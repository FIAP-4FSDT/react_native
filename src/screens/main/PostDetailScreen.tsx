import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Chip,
  ActivityIndicator,
  Appbar,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import {MainStackParamList} from '../../navigation/MainNavigator';
import {postsService} from '../../services/postsService';
import {Post} from '../../stores/postsStore';
import {colors} from '../../theme';

type PostDetailScreenRouteProp = RouteProp<MainStackParamList, 'PostDetail'>;
type PostDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const navigation = useNavigation<PostDetailScreenNavigationProp>();
  const route = useRoute<PostDetailScreenRouteProp>();
  const {postId} = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = await postsService.fetchPost(postId);
      setPost(Array.isArray(postData) ? postData[0] : postData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar post');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
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

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={handleGoBack} />
          <Appbar.Content title="Erro" />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorTitle}>
            {error ? 'Erro ao carregar post' : 'Post não encontrado'}
          </Text>
          <Text variant="bodyLarge" style={styles.errorText}>
            {error || 'O post que você procura não existe ou foi removido.'}
          </Text>
          <TouchableOpacity onPress={loadPost} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Post" />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.postCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.postHeader}>
              <Avatar.Text
                size={50}
                label={post.nome.charAt(0)}
                style={styles.avatar}
              />
              <View style={styles.authorInfo}>
                <Text variant="titleLarge" style={styles.authorName}>
                  {post.nome}
                </Text>
                <Text variant="bodyMedium" style={styles.postDate}>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </Text>
              </View>
              {post.materia && (
                <Chip mode="outlined" style={styles.subjectChip}>
                  {post.materia}
                </Chip>
              )}
            </View>

            <Text variant="headlineSmall" style={styles.postTitle}>
              {post.title}
            </Text>

            <Text variant="bodyLarge" style={styles.postContent}>
              {post.content}
            </Text>
          </Card.Content>
        </Card>

        {/* Aqui você pode adicionar seção de comentários no futuro */}
        <View style={styles.commentsPlaceholder}>
          <Text variant="titleMedium" style={styles.commentsTitle}>
            Comentários
          </Text>
          <Text variant="bodyMedium" style={styles.commentsText}>
            Funcionalidade de comentários em desenvolvimento.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  cardContent: {
    padding: 24,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  authorName: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  postDate: {
    color: colors.text.secondary,
    marginTop: 4,
  },
  subjectChip: {
    backgroundColor: colors.primaryContainer,
  },
  postTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  postContent: {
    color: colors.text.primary,
    lineHeight: 24,
  },
  commentsPlaceholder: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  commentsTitle: {
    color: colors.text.primary,
    marginBottom: 8,
  },
  commentsText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default PostDetailScreen;