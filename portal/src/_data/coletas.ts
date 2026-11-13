import { encomendas, type User, type Encomenda } from "./encomendas";

export type StatusColeta = "criada" | "retirada";

export interface PontoRetirada {
  nomeUnidade: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  horarioFuncionamento: string;
}

export interface ColetaItem {
  id: string; // Ex: "COL-001"
  codigoAgendamento: string;
  codigoEncomenda: string;
  nf: string;
  status: StatusColeta;
  destinatario: User;
  remetente: User;
  dataChegadaDestino: string;
  dataAgendadaColeta: string;
  horarioAgendado: string;
  dataEfetivaRetirada?: string;
  pontoRetirada: PontoRetirada;
  documentoRetiradaExigido: string;
  observacoes?: string;
}

// Unidades locais de retirada por cidade de destino
const pontosPorCidade: Record<string, PontoRetirada> = {
  "Rio de Janeiro": {
    nomeUnidade: "CDD Copacabana - Balcão de Retirada",
    endereco: "Av. Nossa Senhora de Copacabana, 800",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    cep: "22050-001",
    horarioFuncionamento: "Seg a Sex: 08:00 às 17:30 | Sáb: 08:00 às 12:00",
  },
  "Curitiba": {
    nomeUnidade: "CDD Batel - Centro Operacional",
    endereco: "Rua Bispo Dom José, 2100",
    cidade: "Curitiba",
    uf: "PR",
    cep: "80440-080",
    horarioFuncionamento: "Seg a Sex: 08:30 às 18:00",
  },
  "Campinas": {
    nomeUnidade: "Hub Cambuí - Unidade de Encomendas",
    endereco: "Rua Coronel Quirino, 850",
    cidade: "Campinas",
    uf: "SP",
    cep: "13025-004",
    horarioFuncionamento: "Seg a Sex: 08:00 às 18:00 | Sáb: 09:00 às 13:00",
  },
};

export const coletasCadastradas: ColetaItem[] = [
  // 1. Encomenda BR111222333BR (Carlos - RJ) -> Status: retirada
  {
    id: "COL-101-01",
    codigoAgendamento: "AG-92810",
    codigoEncomenda: "BR111222333BR",
    nf: "NF-0019290",
    status: "retirada",
    destinatario: {
      id: "usr-dest-01",
      nome: "Carlos Eduardo Silva",
      documento: "321.654.987-00",
      email: "carlos.silva@email.com",
      telefone: "(21) 98765-4321",
      endereco: "Rua Barata Ribeiro, 450, Apto 302",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
    remetente: {
      id: "usr-rem-03",
      nome: "Mega Eletrônicos S/A",
      cidade: "Campinas",
      uf: "SP",
    },
    dataChegadaDestino: "05/11/2026",
    dataAgendadaColeta: "06/11/2026",
    horarioAgendado: "14:30",
    dataEfetivaRetirada: "06/11/2026 às 15:10",
    pontoRetirada: pontosPorCidade["Rio de Janeiro"],
    documentoRetiradaExigido: "Documento oficial com foto (RG/CNH) e código AG-92810",
    observacoes: "Retirado pelo próprio titular. Assinatura e documento validados no balcão.",
  },

  // 2. Encomenda BR123456789BR (Mariana - Curitiba) -> Status: retirada
  {
    id: "COL-101-02",
    codigoAgendamento: "AG-92811",
    codigoEncomenda: "BR123456789BR",
    nf: "NF-0023411",
    status: "retirada",
    destinatario: {
      id: "usr-dest-02",
      nome: "Mariana Souza Santos",
      documento: "111.222.333-44",
      email: "mariana.souza@email.com",
      telefone: "(41) 99123-4567",
      endereco: "Av. Sete de Setembro, 3200",
      cidade: "Curitiba",
      uf: "PR",
    },
    remetente: {
      id: "usr-rem-02",
      nome: "Moda & Estilo E-commerce",
      cidade: "Belo Horizonte",
      uf: "MG",
    },
    dataChegadaDestino: "07/11/2026",
    dataAgendadaColeta: "08/11/2026",
    horarioAgendado: "10:00",
    dataEfetivaRetirada: "08/11/2026 às 10:25",
    pontoRetirada: pontosPorCidade["Curitiba"],
    documentoRetiradaExigido: "Documento com foto e código de confirmação",
    observacoes: "Volume entregue em perfeitas condições. Protocolo impresso entregue.",
  },

  // 3. Encomenda BR987654321BR (Carlos - RJ) -> Status: criada (aguardando o dia agendado)
  {
    id: "COL-101-03",
    codigoAgendamento: "AG-92812",
    codigoEncomenda: "BR987654321BR",
    nf: "NF-0019283",
    status: "criada",
    destinatario: {
      id: "usr-dest-01",
      nome: "Carlos Eduardo Silva",
      documento: "321.654.987-00",
      email: "carlos.silva@email.com",
      telefone: "(21) 98765-4321",
      endereco: "Rua Barata Ribeiro, 450, Apto 302",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
    remetente: {
      id: "usr-rem-01",
      nome: "Tech Log Distribuidora LTDA",
      cidade: "São Paulo",
      uf: "SP",
    },
    dataChegadaDestino: "08/11/2026",
    dataAgendadaColeta: "13/11/2026",
    horarioAgendado: "11:00",
    pontoRetirada: pontosPorCidade["Rio de Janeiro"],
    documentoRetiradaExigido: "Documento com foto (RG/CNH) e código AG-92812",
    observacoes: "Carga conferida no CDD Copacabana. Aguardando comparecimento do destinatário no dia agendado.",
  },

  // 4. Encomenda BR334455667BR (Mariana - Curitiba) -> Status: criada
  {
    id: "COL-101-04",
    codigoAgendamento: "AG-92813",
    codigoEncomenda: "BR334455667BR",
    nf: "NF-0023437",
    status: "criada",
    destinatario: {
      id: "usr-dest-02",
      nome: "Mariana Souza Santos",
      documento: "111.222.333-44",
      email: "mariana.souza@email.com",
      telefone: "(41) 99123-4567",
      endereco: "Av. Sete de Setembro, 3200",
      cidade: "Curitiba",
      uf: "PR",
    },
    remetente: {
      id: "usr-rem-01",
      nome: "Tech Log Distribuidora LTDA",
      cidade: "São Paulo",
      uf: "SP",
    },
    dataChegadaDestino: "10/11/2026",
    dataAgendadaColeta: "14/11/2026",
    horarioAgendado: "16:00",
    pontoRetirada: pontosPorCidade["Curitiba"],
    documentoRetiradaExigido: "Documento oficial e código AG-92813",
    observacoes: "Disponível na triagem do CDD Batel. Guardada no setor B-12.",
  },

  // 5. Encomenda BR556677889BR (Fernanda - Campinas) -> Status: criada
  {
    id: "COL-101-05",
    codigoAgendamento: "AG-92814",
    codigoEncomenda: "BR556677889BR",
    nf: "NF-0030094",
    status: "criada",
    destinatario: {
      id: "usr-dest-03",
      nome: "Fernanda Lima de Oliveira",
      documento: "444.555.666-77",
      email: "fernanda.lima@email.com",
      telefone: "(19) 98877-6655",
      endereco: "Rua Coronel Quirino, 1120",
      cidade: "Campinas",
      uf: "SP",
    },
    remetente: {
      id: "usr-rem-03",
      nome: "Mega Eletrônicos S/A",
      cidade: "Campinas",
      uf: "SP",
    },
    dataChegadaDestino: "10/11/2026",
    dataAgendadaColeta: "13/11/2026",
    horarioAgendado: "09:30",
    pontoRetirada: pontosPorCidade["Campinas"],
    documentoRetiradaExigido: "Documento com foto original e NF-0030094",
    observacoes: "Cliente optou por retirada no Hub Cambuí. Encomenda pronta no balcão.",
  },

  // 6. Encomenda BR778899001BR (Fernanda - Campinas) -> Status: retirada
  {
    id: "COL-101-06",
    codigoAgendamento: "AG-92815",
    codigoEncomenda: "BR778899001BR",
    nf: "NF-0030115",
    status: "retirada",
    destinatario: {
      id: "usr-dest-03",
      nome: "Fernanda Lima de Oliveira",
      documento: "444.555.666-77",
      email: "fernanda.lima@email.com",
      telefone: "(19) 98877-6655",
      endereco: "Rua Coronel Quirino, 1120",
      cidade: "Campinas",
      uf: "SP",
    },
    remetente: {
      id: "usr-rem-01",
      nome: "Tech Log Distribuidora LTDA",
      cidade: "São Paulo",
      uf: "SP",
    },
    dataChegadaDestino: "08/11/2026",
    dataAgendadaColeta: "10/11/2026",
    horarioAgendado: "14:00",
    dataEfetivaRetirada: "10/11/2026 às 14:15",
    pontoRetirada: pontosPorCidade["Campinas"],
    documentoRetiradaExigido: "Documento com foto",
    observacoes: "Retirada concluída pela própria titular.",
  },
];
