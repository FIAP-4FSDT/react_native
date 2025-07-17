import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Searchbar,
  FAB,
  Card,
  Avatar,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import {MainStackParamList} from '../../navigation/MainNavigator';
import {usePostsStore, Post} from '../../stores/postsStore';
import {useAuthStore} from '../../stores/authStore';
import {colors} from '../../theme';
import {CreatePostModal} from '../../components/CreatePostModal';
import {useCreatePostModal} from '../../hooks/useCreatePostModal';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {posts, loading, fetchPosts, searchPosts} = usePostsStore();
  const {user} = useAuthStore();
  const {isOpen, openModal, closeModal} = useCreatePostModal();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchPosts(query);
    } else {
      await fetchPosts();
    }
  };

  const handlePostPress = (postId: number) => {
    navigation.navigate('PostDetail', {postId});
  };

  const handleCreatePost = () => {
    openModal();
  };

  const renderPost = ({item}: {item: Post}) => (
    <TouchableOpacity onPress={() => handlePostPress(item.id)}>
      <Card style={styles.postCard}>
        <Card.Content>
          <View style={styles.postHeader}>
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
          </View>

          <Text variant="titleLarge" style={styles.postTitle}>
            {item.title}
          </Text>

          <Text
            variant="bodyMedium"
            numberOfLines={3}
            style={styles.postContent}>
            {item.content}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum post disponível'}
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        {searchQuery
          ? 'Tente buscar por outro termo'
          : 'Seja o primeiro a compartilhar conhecimento!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Portal Educacional
        </Text>
        <Searchbar
          placeholder="Buscar por título ou professor..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
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

      {user?.tipo_usuario === 'professor' && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreatePost}
        />
      )}

      <CreatePostModal
        visible={isOpen}
        onClose={closeModal}
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
    marginBottom: 16,
  },
  searchbar: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default HomeScreen;