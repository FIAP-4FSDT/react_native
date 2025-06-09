# 📱 Portal Educacional - React Native

Este é um aplicativo móvel desenvolvido em **React Native** para facilitar a comunicação entre professores(as) e alunos(as) através de postagens educacionais.

## 🚀 Funcionalidades

### 👨‍🏫 Para Professores
- **Criar Posts**: Compartilhar conteúdo educacional com título, conteúdo e matéria
- **Editar Posts**: Modificar posts existentes
- **Excluir Posts**: Remover posts quando necessário
- **Gerenciar Conteúdo**: Visualizar todos os seus posts em uma seção dedicada

### 👩‍🎓 Para Alunos
- **Visualizar Posts**: Acessar todo o conteúdo compartilhado pelos professores
- **Buscar Conteúdo**: Encontrar posts específicos por título ou professor
- **Navegar por Matérias**: Filtrar conteúdo por disciplina

### 🔐 Sistema de Autenticação
- **Login/Registro**: Sistema completo de autenticação
- **Recuperação de Senha**: Funcionalidade para redefinir senha
- **Perfis de Usuário**: Diferenciação entre professores e alunos

## 🛠️ Tecnologias Utilizadas

- **React Native** 0.73.2
- **React Navigation** 6.x (Stack + Bottom Tabs)
- **React Native Paper** (Material Design)
- **Zustand** (Gerenciamento de estado)
- **AsyncStorage** (Armazenamento local)
- **TypeScript** (Tipagem estática)
- **Date-fns** (Manipulação de datas)

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS - apenas macOS)
- Java Development Kit (JDK)

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2. Configurar o Ambiente

#### Android
```bash
# Instalar dependências nativas (Android)
npx react-native run-android
```

#### iOS (apenas macOS)
```bash
# Instalar pods do iOS
cd ios && pod install && cd ..

# Executar no iOS
npx react-native run-ios
```

### 3. Iniciar o Metro Bundler

```bash
npx react-native start
```

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React
├── navigation/         # Configuração de navegação
├── screens/           # Telas do aplicativo
│   ├── auth/         # Telas de autenticação
│   └── main/         # Telas principais
├── services/         # Serviços de API
├── stores/          # Gerenciamento de estado (Zustand)
├── theme/           # Configuração de tema
└── config/          # Configurações gerais
```

## 🔧 Configuração da API

Edite o arquivo `src/config/api.ts` para configurar a URL da sua API:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3001/api' // Android Emulator
  : 'https://sua-api-producao.com/api';
```

### URLs por Plataforma:
- **Android Emulator**: `http://10.0.2.2:3001/api`
- **iOS Simulator**: `http://localhost:3001/api`
- **Dispositivo Físico**: `http://SEU_IP:3001/api`

## 📦 Build para Produção

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace PortalEducacionalRN.xcworkspace -scheme PortalEducacionalRN -configuration Release -destination generic/platform=iOS -archivePath PortalEducacionalRN.xcarchive archive
```

## 🎨 Personalização

### Cores do Tema
Edite `src/theme/index.ts` para personalizar as cores:

```typescript
export const colors = {
  primary: '#8c7a63',
  secondary: '#726452',
  // ... outras cores
};
```

### Ícones
O projeto usa `react-native-vector-icons` com Material Icons. Para usar outros ícones, consulte a [documentação oficial](https://github.com/oblador/react-native-vector-icons).

## 🐛 Solução de Problemas

### Erro de Metro
```bash
npx react-native start --reset-cache
```

### Erro de Build Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Erro de Pods iOS
```bash
cd ios
rm -rf Pods
pod install
cd ..
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para suporte@portaleducacional.com ou abra uma issue no GitHub.

---

**Portal Educacional** - Conectando educadores e estudantes através da tecn