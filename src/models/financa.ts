import { Verificacao } from "./VerificacaoEnum";

export class Financa {
    key: string;
    ehDebito: boolean; //true para debito, false para credito
    descricao: string;
    valor: number;
    data: Date;
    categoria: string;
    verificacao: Verificacao;
    ehCompartilhada: boolean;
    usuarioCriador: string;
}
