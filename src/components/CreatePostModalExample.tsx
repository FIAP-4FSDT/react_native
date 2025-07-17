import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CreatePostModal} from './CreatePostModal';
import {useCreatePostModal} from '../hooks/useCreatePostModal';
import {colors} from '../theme';

export const CreatePostModalExample: React.FC = () => {
  const {isOpen, openModal, closeModal} = useCreatePostModal();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          CreatePostModal Example
        </Text>
        
        <Text variant="bodyMedium" style={styles.description}>
          This example demonstrates the CreatePostModal component functionality.
        </Text>

        <Button
          mode="contained"
          onPress={openModal}
          style={styles.button}>
          Open Create Post Modal
        </Button>

        <CreatePostModal
          visible={isOpen}
          onClose={closeModal}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  button: {
    minWidth: 200,
  },
});