export interface Localidade {
  cidade: string;
  uf: string;
  cep: string;
  endereco?: string;
  contatoNome: string;
  documento?: string;
}

export interface VolumeCarga {
  quantidade: number;
  tipo: "Caixa" | "Palete" | "Envelope" | "Fardo";
  pesoKg: number;
  comprimentoCm: number;
  larguraCm: number;
  alturaCm: number;
}

export interface CotacaoItem {
  id: string; // Ex: "1", "2", ... ou "10"
  slug: string; // "1", "2", etc para a rota /102/[id]
  numeroCotacao: string;
  dataCriacao: string;
  solicitante: {
    nome: string;
    email: string;
    telefone: string;
    empresa?: string;
  };
  origem: Localidade;
  destino: Localidade;
  prazoEstimadoDias: number;
  previsaoEntrega: string;
  volumes: VolumeCarga[];
  pesoTotalKg: number;
  valorDeclarado: number;
  composicaoFrete: {
    fretePeso: number;
    freteValorAdValorem: number; // percentual sobre valor declarado
    taxaColetaEntrega: number;
    gris: number; // Gerenciamento de Risco
    pedagio: number;
    valorTotal: number;
  };
}

export const cotacoesCadastradas: CotacaoItem[] = [
  {
    id: "1",
    slug: "1",
    numeroCotacao: "COT-2026-001",
    dataCriacao: "10/11/2026",
    solicitante: {
      nome: "Carlos Eduardo Silva",
      email: "carlos.silva@email.com",
      telefone: "(21) 98765-4321",
      empresa: "Silva Representações",
    },
    origem: {
      cidade: "São Paulo",
      uf: "SP",
      cep: "04578-000",
      endereco: "Av. das Nações Unidas, 12901",
      contatoNome: "Tech Log Distribuidora",
      documento: "12.345.678/0001-90",
    },
    destino: {
      cidade: "Rio de Janeiro",
      uf: "RJ",
      cep: "22041-010",
      endereco: "Rua Barata Ribeiro, 450",
      contatoNome: "Carlos Eduardo Silva",
      documento: "321.654.987-00",
    },
    prazoEstimadoDias: 3,
    previsaoEntrega: "13/11/2026",
    volumes: [
      {
        quantidade: 2,
        tipo: "Caixa",
        pesoKg: 14.5,
        comprimentoCm: 45,
        larguraCm: 35,
        alturaCm: 30,
      },
    ],
    pesoTotalKg: 29.0,
    valorDeclarado: 4500.0,
    composicaoFrete: {
      fretePeso: 142.5,
      freteValorAdValorem: 18.0,
      taxaColetaEntrega: 35.0,
      gris: 13.5,
      pedagio: 16.8,
      valorTotal: 225.8,
    },
  },
  {
    id: "2",
    slug: "2",
    numeroCotacao: "COT-2026-002",
    dataCriacao: "09/11/2026",
    solicitante: {
      nome: "Mariana Souza Santos",
      email: "mariana.souza@email.com",
      telefone: "(41) 99123-4567",
      empresa: "Batel Modas ME",
    },
    origem: {
      cidade: "Belo Horizonte",
      uf: "MG",
      cep: "30140-120",
      endereco: "Rua dos Inconfidentes, 780",
      contatoNome: "Moda & Estilo E-commerce",
      documento: "98.765.432/0001-11",
    },
    destino: {
      cidade: "Curitiba",
      uf: "PR",
      cep: "80240-000",
      endereco: "Av. Sete de Setembro, 3200",
      contatoNome: "Mariana Souza Santos",
      documento: "111.222.333-44",
    },
    prazoEstimadoDias: 5,
    previsaoEntrega: "14/11/2026",
    volumes: [
      {
        quantidade: 4,
        tipo: "Caixa",
        pesoKg: 8.0,
        comprimentoCm: 40,
        larguraCm: 30,
        alturaCm: 25,
      },
      {
        quantidade: 1,
        tipo: "Fardo",
        pesoKg: 12.0,
        comprimentoCm: 60,
        larguraCm: 40,
        alturaCm: 40,
      },
    ],
    pesoTotalKg: 44.0,
    valorDeclarado: 7800.0,
    composicaoFrete: {
      fretePeso: 210.0,
      freteValorAdValorem: 31.2,
      taxaColetaEntrega: 45.0,
      gris: 23.4,
      pedagio: 28.5,
      valorTotal: 338.1,
    },
  },
  {
    id: "3",
    slug: "3",
    numeroCotacao: "COT-2026-003",
    dataCriacao: "08/11/2026",
    solicitante: {
      nome: "Fernanda Lima de Oliveira",
      email: "fernanda.lima@email.com",
      telefone: "(19) 98877-6655",
      empresa: "Lima Componentes",
    },
    origem: {
      cidade: "Campinas",
      uf: "SP",
      cep: "13060-000",
      endereco: "Rodovia Anhanguera, KM 104",
      contatoNome: "Mega Eletrônicos S/A",
      documento: "45.123.789/0002-55",
    },
    destino: {
      cidade: "Rio de Janeiro",
      uf: "RJ",
      cep: "22041-010",
      endereco: "Rua Barata Ribeiro, 450",
      contatoNome: "Carlos Eduardo Silva",
      documento: "321.654.987-00",
    },
    prazoEstimadoDias: 4,
    previsaoEntrega: "12/11/2026",
    volumes: [
      {
        quantidade: 1,
        tipo: "Palete",
        pesoKg: 120.0,
        comprimentoCm: 120,
        larguraCm: 100,
        alturaCm: 140,
      },
    ],
    pesoTotalKg: 120.0,
    valorDeclarado: 19500.0,
    composicaoFrete: {
      fretePeso: 430.0,
      freteValorAdValorem: 78.0,
      taxaColetaEntrega: 65.0,
      gris: 58.5,
      pedagio: 42.0,
      valorTotal: 673.5,
    },
  },
  {
    id: "4",
    slug: "4",
    numeroCotacao: "COT-2026-004",
    dataCriacao: "07/11/2026",
    solicitante: {
      nome: "Lucas Alencar",
      email: "lucas.alencar@editora.com",
      telefone: "(51) 3344-5566",
      empresa: "Livros & Cultura Livraria",
    },
    origem: {
      cidade: "Porto Alegre",
      uf: "RS",
      cep: "90020-000",
      endereco: "Rua dos Andradas, 900",
      contatoNome: "Livros & Cultura Livraria",
      documento: "33.222.111/0001-88",
    },
    destino: {
      cidade: "Rio de Janeiro",
      uf: "RJ",
      cep: "22041-010",
      endereco: "Rua Barata Ribeiro, 450",
      contatoNome: "Carlos Eduardo Silva",
      documento: "321.654.987-00",
    },
    prazoEstimadoDias: 7,
    previsaoEntrega: "14/11/2026",
    volumes: [
      {
        quantidade: 3,
        tipo: "Caixa",
        pesoKg: 15.0,
        comprimentoCm: 50,
        larguraCm: 40,
        alturaCm: 30,
      },
    ],
    pesoTotalKg: 45.0,
    valorDeclarado: 3200.0,
    composicaoFrete: {
      fretePeso: 260.0,
      freteValorAdValorem: 12.8,
      taxaColetaEntrega: 40.0,
      gris: 9.6,
      pedagio: 34.0,
      valorTotal: 356.4,
    },
  },
  {
    id: "10",
    slug: "10",
    numeroCotacao: "COT-2026-010",
    dataCriacao: "11/11/2026",
    solicitante: {
      nome: "Renato Silveira",
      email: "renato@silveiraimport.com.br",
      telefone: "(11) 97722-1188",
      empresa: "Silveira Importadora LTDA",
    },
    origem: {
      cidade: "Santos",
      uf: "SP",
      cep: "11010-010",
      endereco: "Av. Cândido Gaffrée, s/n - Porto",
      contatoNome: "Terminal Portuário Santos",
      documento: "11.222.333/0001-44",
    },
    destino: {
      cidade: "Campinas",
      uf: "SP",
      cep: "13025-001",
      endereco: "Rua Coronel Quirino, 1120",
      contatoNome: "Fernanda Lima de Oliveira",
      documento: "444.555.666-77",
    },
    prazoEstimadoDias: 2,
    previsaoEntrega: "13/11/2026",
    volumes: [
      {
        quantidade: 2,
        tipo: "Palete",
        pesoKg: 180.0,
        comprimentoCm: 120,
        larguraCm: 100,
        alturaCm: 160,
      },
      {
        quantidade: 3,
        tipo: "Caixa",
        pesoKg: 10.0,
        comprimentoCm: 40,
        larguraCm: 30,
        alturaCm: 25,
      },
    ],
    pesoTotalKg: 390.0,
    valorDeclarado: 38500.0,
    composicaoFrete: {
      fretePeso: 540.0,
      freteValorAdValorem: 154.0,
      taxaColetaEntrega: 90.0,
      gris: 115.5,
      pedagio: 48.0,
      valorTotal: 947.5,
    },
  },
];
