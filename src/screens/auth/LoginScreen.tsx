import React, {useState} from 'react';
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
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {useAuthStore} from '../../stores/authStore';
import {colors} from '../../theme';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const {login, isLoading} = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'A senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email.trim(), password);
      Toast.show({
        type: 'success',
        text1: 'Login realizado com sucesso!',
        text2: 'Bem-vindo ao Portal Educacional',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no login',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              Portal Educacional
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Faça login para acessar sua conta
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                disabled={isLoading}
                style={styles.input}
              />
              {errors.email && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.email}
                </Text>
              )}

              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.password}
                disabled={isLoading}
                style={styles.input}
              />
              {errors.password && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.password}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  'Entrar'
                )}
              </Button>

              <View style={styles.linksContainer}>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('ForgotPassword')}
                  disabled={isLoading}>
                  Esqueceu sua senha?
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register')}
                  disabled={isLoading}>
                  Criar conta
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Text variant="bodySmall" style={styles.footer}>
            © {new Date().getFullYear()} Portal Educacional. Todos os direitos reservados.
          </Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    marginBottom: 32,
  },
  cardContent: {
    padding: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  linksContainer: {
    alignItems: 'center',
  },
  footer: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
});

export default LoginScreen;