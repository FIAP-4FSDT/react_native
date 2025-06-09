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
  SegmentedButtons,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {useAuthStore} from '../../stores/authStore';
import {colors} from '../../theme';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacao_senha: '',
    tipo_usuario: 'aluno' as 'professor' | 'aluno',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {register, isLoading} = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.nome.trim())) {
      newErrors.nome = 'O nome deve conter apenas letras';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'A senha é obrigatória';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmacao_senha) {
      newErrors.confirmacao_senha = 'Confirme sua senha';
    } else if (formData.senha !== formData.confirmacao_senha) {
      newErrors.confirmacao_senha = 'As senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(formData);
      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        text2: 'Você já pode fazer login',
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar conta',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Limpar erro quando o usuário digita
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
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
              Criar Conta
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Junte-se ao Portal Educacional
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <TextInput
                label="Nome completo"
                value={formData.nome}
                onChangeText={(value) => updateFormData('nome', value)}
                mode="outlined"
                autoCapitalize="words"
                error={!!errors.nome}
                disabled={isLoading}
                style={styles.input}
              />
              {errors.nome && (
                <Text variant="bodySmall\" style={styles.errorText}>
                  {errors.nome}
                </Text>
              )}

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                disabled={isLoading}
                style={styles.input}
              />
              {errors.email && (
                <Text variant="bodySmall\" style={styles.errorText}>
                  {errors.email}
                </Text>
              )}

              <Text variant="bodyMedium" style={styles.label}>
                Tipo de usuário
              </Text>
              <SegmentedButtons
                value={formData.tipo_usuario}
                onValueChange={(value) => updateFormData('tipo_usuario', value)}
                buttons={[
                  {value: 'aluno', label: 'Estudante'},
                  {value: 'professor', label: 'Professor'},
                ]}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Senha"
                value={formData.senha}
                onChangeText={(value) => updateFormData('senha', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.senha}
                disabled={isLoading}
                style={styles.input}
              />
              {errors.senha && (
                <Text variant="bodySmall\" style={styles.errorText}>
                  {errors.senha}
                </Text>
              )}

              <TextInput
                label="Confirmar senha"
                value={formData.confirmacao_senha}
                onChangeText={(value) => updateFormData('confirmacao_senha', value)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                error={!!errors.confirmacao_senha}
                disabled={isLoading}
                style={styles.input}
              />
              {errors.confirmacao_senha && (
                <Text variant="bodySmall\" style={styles.errorText}>
                  {errors.confirmacao_senha}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleRegister}
                disabled={isLoading}
                style={styles.registerButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  'Criar conta'
                )}
              </Button>

              <View style={styles.linksContainer}>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  disabled={isLoading}>
                  Já tem uma conta? Fazer login
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
  label: {
    marginBottom: 8,
    marginTop: 16,
    color: colors.text.primary,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  registerButton: {
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

export default RegisterScreen;