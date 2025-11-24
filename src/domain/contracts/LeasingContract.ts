import { LeasingContract as LeasingContractType } from "../billing/Types";

export class LeasingContractModel implements LeasingContractType {
  constructor(
    public idContrato: string,
    public nomeCliente: string,
    public documentoCliente: string,
    public unidadeConsumidora: string,
    public uf: string,
    public kWhContratadoMensal: number,
    public descontoPercentual: number,
    public permiteCobrancaExcedente: boolean,
    public incluirTusdTaxaMinimaPorPadrao: boolean
  ) {}

  public toJSON(): LeasingContractType {
    return {
      idContrato: this.idContrato,
      nomeCliente: this.nomeCliente,
      documentoCliente: this.documentoCliente,
      unidadeConsumidora: this.unidadeConsumidora,
      uf: this.uf,
      kWhContratadoMensal: this.kWhContratadoMensal,
      descontoPercentual: this.descontoPercentual,
      permiteCobrancaExcedente: this.permiteCobrancaExcedente,
      incluirTusdTaxaMinimaPorPadrao: this.incluirTusdTaxaMinimaPorPadrao,
    };
  }
}
