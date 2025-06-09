// Configuração da API
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3001/api' // Android Emulator
  : 'https://sua-api-producao.com/api';

// Para iOS Simulator, use: 'http://localhost:3001/api'
// Para dispositivo físico, use o IP da sua máquina: 'http://192.168.1.100:3001/api'

export const API_TIMEOUT = 10000; // 10 segundos