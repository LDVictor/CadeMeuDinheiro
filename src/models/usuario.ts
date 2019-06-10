import { MetaGasto } from "./meta";
import { Cartao } from "./cartao";

export class Usuario {
    nome: string;
    username: string;
    profissao: string;
    salario: number;
    email: string;
    fotosrc: string;
    userId: string;
    pushToken: string;
    metas: MetaGasto[];
    numPagamentos: number;
    carteira: number;
    cartao: Cartao;
}

