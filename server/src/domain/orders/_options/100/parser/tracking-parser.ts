// src/domain/orders/parser/tracking-parser.ts

export interface PartyInfo {
  name: string | null;
  document: string | null;
  location: string | null;
}

export interface TrackingItem {
  trackingCode: string;
  invoice: string | null;
  status: string | null;
  sender: PartyInfo;
  recipient: PartyInfo;
  estimatedDelivery: string | null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanText(text?: string | null): string | null {
  if (!text) return null;
  const cleaned = decodeEntities(text.replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

// Conteúdo do primeiro elemento com o padrão informado
function captureFirst(source: string, pattern: RegExp): string | null {
  const match = source.match(pattern);
  return match ? cleanText(match[1]) : null;
}

function parseParty(section: string): PartyInfo {
  // Nome: primeiro <p> em negrito dentro da seção
  const name = captureFirst(
    section,
    /<p[^>]*class="[^"]*font-bold[^"]*"[^>]*>([\s\S]*?)<\/p\s*>/,
  );

  // Documento: <p> que começa com "Doc:" ou "CPF/Doc:"
  const docBlock = captureFirst(
    section,
    /<p[^>]*class="[^"]*font-mono[^"]*"[^>]*>\s*((?:CPF\/Doc|Doc):[\s\S]*?)<\/p\s*>/,
  );
  const document = docBlock
    ? docBlock.replace(/^(?:CPF\/Doc|Doc):\s*/, '')
    : null;

  // Localização: <span> de 11px com cidade e UF
  const location = captureFirst(
    section,
    /<span[^>]*class="[^"]*text-\[11px\][^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
  );

  return { name, document, location };
}

/**
 * Faz o parse da página /ssw/100 já renderizada pelo servidor.
 * Retorna uma lista vazia se o HTML não contiver cards.
 */
export function parseTrackingHtml(html: string): TrackingItem[] {
  if (!html) return [];

  // Remove comentários do React (<!-- -->) que quebram os padrões de texto
  const source = html.replace(/<!--[\s\S]*?-->/g, '');

  // Quebra o HTML em blocos, um por card, a partir de cada href de remessa
  const cardStarts = [...source.matchAll(/href="\/ssw\/100\/([^"]+)"/g)];

  const items: TrackingItem[] = [];

  cardStarts.forEach((start, index) => {
    const trackingCode = start[1];
    const blockStart = start.index ?? 0;
    const blockEnd =
      index + 1 < cardStarts.length
        ? (cardStarts[index + 1].index ?? source.length)
        : source.length;

    // Recorta a partir do <a> que contém o href até o próximo card
    const aOpen = source.lastIndexOf('<a', blockStart);
    const block = source.slice(aOpen >= 0 ? aOpen : blockStart, blockEnd);

    const invoice = captureFirst(
      block,
      /<span[^>]*class="[^"]*font-mono[^"]*text-\[11px\][^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
    );

    // Status: texto do <span> logo após o marcador colorido
    const status = captureFirst(
      block,
      /<span[^>]*class="[^"]*w-1\.5[^"]*h-1\.5[^"]*"[^>]*><\/span\s*>\s*<span\s*>([\s\S]*?)<\/span\s*>/,
    );

    // Seções do remetente e destinatário, delimitadas pelos rótulos
    const senderStart = block.indexOf('Origem (Remetente)');
    const recipientStart = block.indexOf('Destino (Destinatário)');
    const previsaoStart = block.indexOf('Previsão:');

    const senderSection =
      senderStart >= 0
        ? block.slice(
            senderStart,
            recipientStart > senderStart ? recipientStart : undefined,
          )
        : '';
    const recipientSection =
      recipientStart >= 0
        ? block.slice(
            recipientStart,
            previsaoStart > recipientStart ? previsaoStart : undefined,
          )
        : '';

    const estimatedDelivery = captureFirst(
      block,
      /Previsão:\s*<\/span\s*>\s*<span[^>]*class="[^"]*font-mono[^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
    );

    items.push({
      trackingCode,
      invoice,
      status,
      sender: parseParty(senderSection),
      recipient: parseParty(recipientSection),
      estimatedDelivery,
    });
  });

  return items;
}

function normalizarTermoNotaFiscal(termo: string): string {
  return termo.trim().replace(/^nf[-\s:]*/i, '').replace(/\D/g, '');
}

export function filterTrackingItemsByChave(
  items: TrackingItem[],
  chave: string,
): TrackingItem[] {
  const trimmed = chave.trim();
  if (!trimmed) return items;

  if (/^nf/i.test(trimmed)) {
    const nfBuscada = normalizarTermoNotaFiscal(trimmed);
    return items.filter((item) => {
      const nfItem = normalizarTermoNotaFiscal(item.invoice ?? '');
      return nfItem === nfBuscada;
    });
  }

  const codigo = trimmed.toLowerCase();
  return items.filter((item) => item.trackingCode.toLowerCase() === codigo);
}

/**
 * Parse da página de detalhe /ssw/100/:chave (um único pedido).
 */
export function parseTrackingDetailHtml(html: string): TrackingItem[] {
  if (!html) return [];

  const source = html.replace(/<!--[\s\S]*?-->/g, '');

  const trackingCode = captureFirst(
    source,
    /<h1[^>]*class="[^"]*text-2xl[^"]*font-mono[^"]*"[^>]*>([\s\S]*?)<\/h1\s*>/,
  );
  if (!trackingCode) return [];

  const invoiceDigits = captureFirst(
    source,
    /Nota Fiscal:\s*<\/span\s*>\s*<strong[^>]*class="[^"]*font-mono[^"]*"[^>]*>([\s\S]*?)<\/strong\s*>/,
  );
  const invoice = invoiceDigits ? `NF: ${invoiceDigits}` : null;

  const status = captureFirst(
    source,
    /<span[^>]*class="[^"]*w-2[^"]*h-2[^"]*"[^>]*><\/span\s*>\s*<span\s*>([\s\S]*?)<\/span\s*>/,
  );

  const estimatedDelivery = captureFirst(
    source,
    /Previsão:\s*<\/span\s*>\s*<span[^>]*class="[^"]*font-mono[^"]*font-bold[^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
  );

  const remetenteStart = source.indexOf('>Remetente<');
  const destinatarioStart = source.indexOf('>Destinatário<');
  const timelineStart = source.indexOf('Linha do Tempo');

  const senderSection =
    remetenteStart >= 0
      ? source.slice(
          remetenteStart,
          destinatarioStart > remetenteStart ? destinatarioStart : undefined,
        )
      : '';
  const recipientSection =
    destinatarioStart >= 0
      ? source.slice(
          destinatarioStart,
          timelineStart > destinatarioStart ? timelineStart : undefined,
        )
      : '';

  const sender = parseDetailParty(senderSection);
  const recipient = parseDetailParty(recipientSection);

  return [
    {
      trackingCode,
      invoice,
      status,
      sender,
      recipient,
      estimatedDelivery,
    },
  ];
}

function parseDetailParty(section: string): PartyInfo {
  const name = captureFirst(
    section,
    /<p[^>]*class="[^"]*font-bold[^"]*text-sm[^"]*"[^>]*>([\s\S]*?)<\/p\s*>/,
  );

  const document = captureFirst(
    section,
    /<span[^>]*class="[^"]*text-\[10px\][^"]*font-mono[^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
  );

  const locationRaw = captureFirst(
    section,
    /<p[^>]*class="[^"]*text-xs[^"]*text-\[#404040\][^"]*mt-0\.5[^"]*"[^>]*>([\s\S]*?)<\/p\s*>/,
  );
  const location = locationRaw
    ? locationRaw.replace(/\s*-\s*/g, ', ').trim()
    : null;

  return { name, document, location };
}
