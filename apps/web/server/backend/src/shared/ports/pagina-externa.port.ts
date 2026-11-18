export const PAGINA_EXTERNA = Symbol('PAGINA_EXTERNA');

export interface PaginaExternaPort {
  buscarHtml(): Promise<string>;
}
