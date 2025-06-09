import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  List,
  Divider,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {useAuthStore} from '../../stores/authStore';
import {colors} from '../../theme';

const ProfileScreen: React.FC = () => {
  const {user, logout} = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar logout',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Toast.show({
                type: 'success',
                text1: 'Logout realizado com sucesso!',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao fazer logout',
                text2: error instanceof Error ? error.message : 'Erro desconhecido',
              });
            }
          },
        },
      ],
    );
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'professor':
        return 'Professor';
      case 'aluno':
        return 'Estudante';
      default:
        return 'Usuário';
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'professor':
        return 'school';
      case 'aluno':
        return 'account-school';
      default:
        return 'account';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Erro ao carregar perfil
          </Text>
          <Text variant="bodyLarge" style={styles.errorText}>
            Não foi possível carregar as informações do usuário.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Perfil
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user.nome.charAt(0)}
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.userName}>
              {user.nome}
            </Text>
            <Text variant="bodyLarge" style={styles.userEmail}>
              {user.email}
            </Text>
            <View style={styles.userTypeContainer}>
              <Text variant="titleMedium" style={styles.userType}>
                {getUserTypeLabel(user.tipo_usuario)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <List.Section>
            <List.Subheader>Informações da Conta</List.Subheader>
            
            <List.Item
              title="Nome"
              description={user.nome}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            
            <Divider />
            
            <List.Item
              title="Email"
              description={user.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            
            <Divider />
            
            <List.Item
              title="Tipo de usuário"
              description={getUserTypeLabel(user.tipo_usuario)}
              left={(props) => <List.Icon {...props} icon={getUserTypeIcon(user.tipo_usuario)} />}
            />
          </List.Section>
        </Card>

        <Card style={styles.menuCard}>
          <List.Section>
            <List.Subheader>Configurações</List.Subheader>
            
            <List.Item
              title="Sobre o aplicativo"
              description="Versão 1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Portal Educacional',
                  text2: 'Versão 1.0.0 - React Native',
                });
              }}
            />
            
            <Divider />
            
            <List.Item
              title="Política de Privacidade"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Política de Privacidade',
                  text2: 'Funcionalidade em desenvolvimento',
                });
              }}
            />
            
            <Divider />
            
            <List.Item
              title="Termos de Uso"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Termos de Uso',
                  text2: 'Funcionalidade em desenvolvimento',
                });
              }}
            />
          </List.Section>
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor={colors.error}>
            Sair da Conta
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.footer}>
          © {new Date().getFullYear()} Portal Educacional. Todos os direitos reservados.
        </Text>
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
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  profileContent: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  userName: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: colors.text.secondary,
    marginBottom: 12,
  },
  userTypeContainer: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userType: {
    color: colors.primary,
    fontWeight: '500',
  },
  menuCard: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  logoutContainer: {
    marginVertical: 24,
  },
  logoutButton: {
    marginHorizontal: 16,
  },
  footer: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 32,
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
  },
});

export default ProfileScreen;