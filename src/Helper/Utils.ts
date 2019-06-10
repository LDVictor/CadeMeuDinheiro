
export default class Utils {

    static formataValorFB(valor: number) {
        let valorAsString = String(valor);
        while (valorAsString.includes(".")) {
            valorAsString = valorAsString.replace(".", "");
        }
        return Number(valorAsString.replace(",", "."));
    }
}