export interface User {
  id: string;
  nome: string;
  documento?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade: string;
  uf: string;
}

export interface RastreamentoEvento {
  dataHora: string;
  local: string;
  descricao: string;
  status: string;
}

export type StatusEncomenda =
  | "Pendente"
  | "Em Trânsito"
  | "Saiu para Entrega"
  | "Entregue"
  | "Cancelado";

export interface Encomenda {
  id: string;
  nf: string;
  remetente: User;
  destinatario: User;
  statusAtual: StatusEncomenda;
  dataEnvio: string;
  previsaoEntrega: string;
  detalhesRastreamento: RastreamentoEvento[];
}

// ---------- Remetentes ----------

const remTechLog: User = {
  id: "usr-rem-01",
  nome: "Tech Log Distribuidora LTDA",
  documento: "12.345.678/0001-90",
  email: "logistica@techlog.com.br",
  telefone: "(11) 4002-8922",
  endereco: "Av. das Nações Unidas, 12901",
  cidade: "São Paulo",
  uf: "SP",
};

const remModaEstilo: User = {
  id: "usr-rem-02",
  nome: "Moda & Estilo E-commerce",
  documento: "98.765.432/0001-11",
  email: "contato@modaestilo.com.br",
  telefone: "(31) 3222-1100",
  endereco: "Rua dos Inconfidentes, 780",
  cidade: "Belo Horizonte",
  uf: "MG",
};

const remMegaEletronicos: User = {
  id: "usr-rem-03",
  nome: "Mega Eletrônicos S/A",
  documento: "45.123.789/0002-55",
  email: "suporte@megaeletronicos.com",
  telefone: "(19) 3800-9000",
  endereco: "Rodovia Anhanguera, KM 104",
  cidade: "Campinas",
  uf: "SP",
};

const remLivrosCultura: User = {
  id: "usr-rem-04",
  nome: "Livros & Cultura Livraria",
  documento: "33.222.111/0001-88",
  email: "vendas@livroscultura.com.br",
  telefone: "(51) 3344-5566",
  endereco: "Rua dos Andradas, 900",
  cidade: "Porto Alegre",
  uf: "RS",
};

// ---------- Destinatários (3 usuários) ----------

const destCarlos: User = {
  id: "usr-dest-01",
  nome: "Carlos Eduardo Silva",
  documento: "321.654.987-00",
  email: "carlos.silva@email.com",
  telefone: "(21) 98765-4321",
  endereco: "Rua Barata Ribeiro, 450, Apto 302",
  cidade: "Rio de Janeiro",
  uf: "RJ",
};

const destMariana: User = {
  id: "usr-dest-02",
  nome: "Mariana Souza Santos",
  documento: "111.222.333-44",
  email: "mariana.souza@email.com",
  telefone: "(41) 99123-4567",
  endereco: "Av. Sete de Setembro, 3200",
  cidade: "Curitiba",
  uf: "PR",
};

const destFernanda: User = {
  id: "usr-dest-03",
  nome: "Fernanda Lima de Oliveira",
  documento: "444.555.666-77",
  email: "fernanda.lima@email.com",
  telefone: "(19) 98877-6655",
  endereco: "Rua Coronel Quirino, 1120",
  cidade: "Campinas",
  uf: "SP",
};

// ---------- Encomendas ----------

export const encomendas: Encomenda[] = [
  // ===== Carlos Eduardo Silva (RJ) =====
  {
    id: "BR987654321BR",
    nf: "NF-0019283",
    dataEnvio: "05/11/2026",
    previsaoEntrega: "12/11/2026",
    statusAtual: "Em Trânsito",
    remetente: remTechLog,
    destinatario: destCarlos,
    detalhesRastreamento: [
      {
        dataHora: "05/11/2026 09:30",
        local: "Centro de Distribuição - São Paulo / SP",
        descricao:
          "Objeto postado pelo remetente e recebido no centro de triagem.",
        status: "Postado",
      },
      {
        dataHora: "06/11/2026 14:15",
        local: "CTE Cajamar - Cajamar / SP",
        descricao:
          "Em transferência para o Centro de Distribuição do Rio de Janeiro.",
        status: "Em Trânsito",
      },
      {
        dataHora: "08/11/2026 08:40",
        local: "CDD Copacabana - Rio de Janeiro / RJ",
        descricao: "Objeto chegou à unidade de distribuição local.",
        status: "Em Trânsito",
      },
    ],
  },
  {
    id: "BR111222333BR",
    nf: "NF-0019290",
    dataEnvio: "02/11/2026",
    previsaoEntrega: "06/11/2026",
    statusAtual: "Entregue",
    remetente: remMegaEletronicos,
    destinatario: destCarlos,
    detalhesRastreamento: [
      {
        dataHora: "02/11/2026 10:20",
        local: "Hub Central - Campinas / SP",
        descricao: "Coleta efetuada e conferida no sistema.",
        status: "Postado",
      },
      {
        dataHora: "03/11/2026 16:00",
        local: "CTE Cajamar - Cajamar / SP",
        descricao:
          "Em transferência para o Centro de Distribuição do Rio de Janeiro.",
        status: "Em Trânsito",
      },
      {
        dataHora: "05/11/2026 08:10",
        local: "CDD Copacabana - Rio de Janeiro / RJ",
        descricao: "Objeto saiu para entrega ao destinatário.",
        status: "Saiu para Entrega",
      },
      {
        dataHora: "05/11/2026 16:30",
        local: "Rio de Janeiro / RJ",
        descricao: "Objeto entregue ao destinatário com sucesso.",
        status: "Entregue",
      },
    ],
  },
  {
    id: "BR445566778BR",
    nf: "NF-0019301",
    dataEnvio: "10/11/2026",
    previsaoEntrega: "18/11/2026",
    statusAtual: "Pendente",
    remetente: remLivrosCultura,
    destinatario: destCarlos,
    detalhesRastreamento: [
      {
        dataHora: "10/11/2026 08:15",
        local: "Agência dos Correios - Porto Alegre / RS",
        descricao:
          "Aguardando envio e processamento fiscal pela transportadora.",
        status: "Pendente",
      },
    ],
  },

  // ===== Mariana Souza Santos (Curitiba) =====
  {
    id: "BR123456789BR",
    nf: "NF-0023411",
    dataEnvio: "01/11/2026",
    previsaoEntrega: "08/11/2026",
    statusAtual: "Entregue",
    remetente: remModaEstilo,
    destinatario: destMariana,
    detalhesRastreamento: [
      {
        dataHora: "01/11/2026 10:00",
        local: "Centro de Coleta - Belo Horizonte / MG",
        descricao: "Mercadoria coletada e nota fiscal validada.",
        status: "Postado",
      },
      {
        dataHora: "03/11/2026 18:20",
        local: "CTE Campinas - Campinas / SP",
        descricao:
          "Objeto em trânsito para a unidade de tratamento de Curitiba.",
        status: "Em Trânsito",
      },
      {
        dataHora: "07/11/2026 07:15",
        local: "CDD Batel - Curitiba / PR",
        descricao: "Objeto saiu para entrega ao destinatário.",
        status: "Saiu para Entrega",
      },
      {
        dataHora: "07/11/2026 15:42",
        local: "Curitiba / PR",
        descricao: "Objeto entregue ao destinatário com sucesso.",
        status: "Entregue",
      },
    ],
  },
  {
    id: "BR223344556BR",
    nf: "NF-0023420",
    dataEnvio: "06/11/2026",
    previsaoEntrega: "12/11/2026",
    statusAtual: "Cancelado",
    remetente: remMegaEletronicos,
    destinatario: destMariana,
    detalhesRastreamento: [
      {
        dataHora: "06/11/2026 09:00",
        local: "Hub Central - Campinas / SP",
        descricao: "Coleta efetuada e conferida no sistema.",
        status: "Postado",
      },
      {
        dataHora: "07/11/2026 11:20",
        local: "Hub Central - Campinas / SP",
        descricao:
          "Envio cancelado a pedido do remetente. Objeto em devolução.",
        status: "Cancelado",
      },
    ],
  },
  {
    id: "BR334455667BR",
    nf: "NF-0023437",
    dataEnvio: "09/11/2026",
    previsaoEntrega: "14/11/2026",
    statusAtual: "Saiu para Entrega",
    remetente: remTechLog,
    destinatario: destMariana,
    detalhesRastreamento: [
      {
        dataHora: "09/11/2026 13:00",
        local: "Centro de Distribuição - São Paulo / SP",
        descricao:
          "Objeto postado pelo remetente e recebido no centro de triagem.",
        status: "Postado",
      },
      {
        dataHora: "10/11/2026 07:10",
        local: "CDD Batel - Curitiba / PR",
        descricao:
          "Objeto saiu para entrega ao destinatário. Motorista em rota.",
        status: "Saiu para Entrega",
      },
    ],
  },

  // ===== Fernanda Lima de Oliveira (Campinas) =====
  {
    id: "BR556677889BR",
    nf: "NF-0030094",
    dataEnvio: "09/11/2026",
    previsaoEntrega: "11/11/2026",
    statusAtual: "Saiu para Entrega",
    remetente: remMegaEletronicos,
    destinatario: destFernanda,
    detalhesRastreamento: [
      {
        dataHora: "09/11/2026 11:00",
        local: "Hub Central - Campinas / SP",
        descricao: "Coleta efetuada e conferida no sistema.",
        status: "Postado",
      },
      {
        dataHora: "10/11/2026 07:30",
        local: "Unidade de Distribuição - Campinas / SP",
        descricao:
          "Objeto saiu para entrega ao destinatário. Motorista em rota.",
        status: "Saiu para Entrega",
      },
    ],
  },
  {
    id: "BR778899001BR",
    nf: "NF-0030115",
    dataEnvio: "07/11/2026",
    previsaoEntrega: "11/11/2026",
    statusAtual: "Em Trânsito",
    remetente: remTechLog,
    destinatario: destFernanda,
    detalhesRastreamento: [
      {
        dataHora: "07/11/2026 09:40",
        local: "Centro de Distribuição - São Paulo / SP",
        descricao:
          "Objeto postado pelo remetente e recebido no centro de triagem.",
        status: "Postado",
      },
      {
        dataHora: "08/11/2026 15:10",
        local: "CTE Campinas - Campinas / SP",
        descricao:
          "Em transferência para a unidade de distribuição de Campinas.",
        status: "Em Trânsito",
      },
    ],
  },
  {
    id: "BR889900112BR",
    nf: "NF-0030127",
    dataEnvio: "03/11/2026",
    previsaoEntrega: "07/11/2026",
    statusAtual: "Cancelado",
    remetente: remModaEstilo,
    destinatario: destFernanda,
    detalhesRastreamento: [
      {
        dataHora: "03/11/2026 10:30",
        local: "Centro de Coleta - Belo Horizonte / MG",
        descricao: "Mercadoria coletada e nota fiscal validada.",
        status: "Postado",
      },
      {
        dataHora: "05/11/2026 12:00",
        local: "CTE Campinas - Campinas / SP",
        descricao:
          "Envio cancelado pelo remetente. Objeto retornando à origem.",
        status: "Cancelado",
      },
    ],
  },
];
