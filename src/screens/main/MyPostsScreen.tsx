import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  FAB,
  Card,
  Avatar,
  Chip,
  ActivityIndicator,
  IconButton,
  Menu,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import Toast from 'react-native-toast-message';

import {MainStackParamList} from '../../navigation/MainNavigator';
import {usePostsStore, Post} from '../../stores/postsStore';
import {useAuthStore} from '../../stores/authStore';
import {colors} from '../../theme';

type MyPostsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const MyPostsScreen: React.FC = () => {
  const navigation = useNavigation<MyPostsScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<{[key: number]: boolean}>({});

  const {posts, loading, fetchPosts, deletePost} = usePostsStore();
  const {user} = useAuthStore();

  // Filtrar apenas os posts do usuário atual
  const myPosts = posts.filter(post => post.author_id === user?.id);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handlePostPress = (postId: number) => {
    navigation.navigate('PostDetail', {postId});
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const handleEditPost = (postId: number) => {
    setMenuVisible({});
    navigation.navigate('EditPost', {postId});
  };

  const handleDeletePost = (postId: number, postTitle: string) => {
    setMenuVisible({});
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o post "${postTitle}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId);
              Toast.show({
                type: 'success',
                text1: 'Post excluído com sucesso!',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao excluir post',
                text2: error instanceof Error ? error.message : 'Erro desconhecido',
              });
            }
          },
        },
      ],
    );
  };

  const toggleMenu = (postId: number) => {
    setMenuVisible(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderPost = ({item}: {item: Post}) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.postHeaderContent}
            onPress={() => handlePostPress(item.id)}>
            <Avatar.Text
              size={40}
              label={item.nome.charAt(0)}
              style={styles.avatar}
            />
            <View style={styles.postInfo}>
              <Text variant="titleMedium">{item.nome}</Text>
              <Text variant="bodySmall" style={styles.postDate}>
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </Text>
            </View>
            {item.materia && (
              <Chip mode="outlined" compact style={styles.subjectChip}>
                {item.materia}
              </Chip>
            )}
          </TouchableOpacity>
          
          <Menu
            visible={menuVisible[item.id] || false}
            onDismiss={() => toggleMenu(item.id)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => toggleMenu(item.id)}
              />
            }>
            <Menu.Item
              onPress={() => handleEditPost(item.id)}
              title="Editar"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => handleDeletePost(item.id, item.title)}
              title="Excluir"
              leadingIcon="delete"
            />
          </Menu>
        </View>

        <TouchableOpacity onPress={() => handlePostPress(item.id)}>
          <Text variant="titleLarge" style={styles.postTitle}>
            {item.title}
          </Text>

          <Text
            variant="bodyMedium"
            numberOfLines={3}
            style={styles.postContent}>
            {item.content}
          </Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Nenhum post criado
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Que tal criar seu primeiro post?
      </Text>
    </View>
  );

  // Verificar se o usuário é professor
  if (user?.tipo_usuario !== 'professor') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Meus Posts
          </Text>
        </View>
        <View style={styles.unauthorizedContainer}>
          <Text variant="headlineSmall" style={styles.unauthorizedTitle}>
            Acesso Restrito
          </Text>
          <Text variant="bodyLarge" style={styles.unauthorizedText}>
            Apenas professores podem criar e gerenciar posts.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Meus Posts
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={myPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreatePost}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  postCard: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  postInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postDate: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  subjectChip: {
    backgroundColor: colors.primaryContainer,
    marginRight: 8,
  },
  postTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    color: colors.text.primary,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unauthorizedTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  unauthorizedText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default MyPostsScreen;