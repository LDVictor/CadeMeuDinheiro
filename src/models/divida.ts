import { Acordo } from "./acordo";
import { Verificacao } from './VerificacaoEnum';

export class Divida {
    key: string;
    emailUsuarioEmprestador: string;
    usuarioEmprestador: string;
    nomeUsuarioEmprestador: string;
    data: Date;
    descricao: string;
    emailUsuarioDevedor: string;
    usuarioDevedor: string;
    nomeUsuarioDevedor: string;
    valor: number;
    valorParcial: number;
    fotosrc: string;
    aberta: boolean;
    acordos: Acordo[];
    verificacao: Verificacao;
    usuarioCriador: string
}
