import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Searchbar,
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
import {colors} from '../../theme';

type SearchScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {searchPosts} = usePostsStore();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchPosts(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePostPress = (postId: number) => {
    navigation.navigate('PostDetail', {postId});
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

  const renderEmptyState = () => {
    if (!searchQuery) {
      return (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Buscar Posts
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Digite algo para começar a buscar
          </Text>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Buscando...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Nenhum resultado encontrado
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubtitle}>
          Tente buscar por outro termo ou professor
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.resultsHeader}>
      <Text variant="titleMedium" style={styles.resultsText}>
        {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'} para "{searchQuery}"
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Buscar
        </Text>
        <Searchbar
          placeholder="Buscar por título ou professor..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          autoFocus
        />
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={searchQuery && searchResults.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    color: colors.text.secondary,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: colors.text.secondary,
    marginTop: 16,
  },
});

export default SearchScreen;