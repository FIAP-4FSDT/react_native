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
import {authService} from '../../services/authService';
import {colors} from '../../theme';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('O email é obrigatório');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de email inválido');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email.trim());
      setIsSubmitted(true);
      Toast.show({
        type: 'success',
        text1: 'Email enviado!',
        text2: 'Verifique sua caixa de entrada',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar email',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text variant="headlineSmall" style={styles.successTitle}>
                Email enviado!
              </Text>
              <Text variant="bodyLarge" style={styles.successText}>
                Enviamos um link de recuperação para{' '}
                <Text style={styles.emailText}>{email}</Text>.
              </Text>
              <Text variant="bodyMedium" style={styles.instructionText}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </Text>
              <Button
                mode="outlined"
                onPress={() => setIsSubmitted(false)}
                style={styles.tryAgainButton}>
                Tentar com outro email
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                style={styles.backButton}>
                Voltar para o login
              </Button>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

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
              Recuperar Senha
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Enviaremos um link para redefinir sua senha
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError('');
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!error}
                disabled={isLoading}
                style={styles.input}
              />
              {error && (
                <Text variant="bodySmall\" style={styles.errorText}>
                  {error}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isLoading}
                style={styles.submitButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}
                style={styles.backButton}>
                Voltar para o login
              </Button>
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
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
  submitButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
  successTitle: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text.primary,
  },
  emailText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text.secondary,
  },
  tryAgainButton: {
    marginBottom: 16,
  },
  footer: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
});

export default ForgotPasswordScreen;