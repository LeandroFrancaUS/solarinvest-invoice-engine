# SolarInvest Invoice Engine

Plataforma standalone para processamento de faturas de energia, cálculo SolarInvest e geração de PDF, com backend em Node.js/Express e frontend em React/Vite.

## Estrutura
- `backend/`: API HTTP para upload, OCR, parse, cálculo e geração de PDF.
- `frontend/`: Dashboard React para operar o fluxo completo.
- `cli/test-engine.ts`: CLI simples para testar o motor de cálculo.

## Como rodar
1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Acesse `http://localhost:5173`.

3. **CLI de teste**
   ```bash
   npm install
   npm run cli:test
   ```

## Configuração de ambiente (backend/.env)
Veja `backend/.env.example` para variáveis de OCR e defaults de cálculo.
