import express from 'express';
import multer from 'multer';
import { calcularFaturaSolarInvest } from '../engine/billingEngine';
import { BillingInput, BillingResult, ContractParams, RawInvoiceData } from '../engine/types';
import { runExternalOcr } from '../ocr/externalOcrClient';
import { parseEnergyInvoice } from '../parser/energyInvoiceParser';
import { gerarPdfFatura } from '../pdf/solarinvestBillPdf';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não enviado' });
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Tipo de arquivo não suportado' });
    }

    const ocrText = await runExternalOcr(req.file.buffer, req.file.originalname, req.file.mimetype);
    const parsed = parseEnergyInvoice(ocrText);

    return res.json({
      rawInvoice: parsed,
      ocrPreview: ocrText.slice(0, 500),
      fileName: req.file.originalname,
    });
  } catch (error: any) {
    console.error('Erro no upload de fatura', error);
    return res.status(500).json({ error: error?.message || 'Falha ao processar fatura' });
  }
});

router.post('/calculate', (req, res) => {
  try {
    const { rawInvoice, contrato } = req.body as BillingInput;
    if (!rawInvoice || !contrato) {
      return res.status(400).json({ error: 'rawInvoice e contrato são obrigatórios' });
    }
    if (contrato.kcEnergiaContratadaKWh <= 0) {
      return res.status(400).json({ error: 'kcEnergiaContratadaKWh deve ser maior que zero' });
    }
    const result = calcularFaturaSolarInvest({ rawInvoice, contrato });
    return res.json(result);
  } catch (error: any) {
    console.error('Erro no cálculo', error);
    return res.status(500).json({ error: error?.message || 'Falha ao calcular fatura' });
  }
});

router.post('/generate-bill-pdf', (req, res) => {
  try {
    const { billingResult, rawInvoice, contrato } = req.body as {
      billingResult: BillingResult;
      rawInvoice?: RawInvoiceData;
      contrato?: ContractParams;
    };
    if (!billingResult) {
      return res.status(400).json({ error: 'billingResult é obrigatório' });
    }
    const pdfBuffer = gerarPdfFatura(billingResult, rawInvoice, contrato);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="fatura-solarinvest.pdf"');
    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Erro na geração de PDF', error);
    return res.status(500).json({ error: error?.message || 'Falha ao gerar PDF' });
  }
});

export default router;
