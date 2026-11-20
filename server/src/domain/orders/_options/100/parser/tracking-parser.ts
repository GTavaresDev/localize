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
  const cardStarts = [...source.matchAll(/href="\/encomendas\/([^"]+)"/g)];

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
