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

function cleanText(text?: string | null): string | null {
  if (!text) return null;
  const cleaned = text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Faz o parse do HTML da opção 100 de rastreamento de encomendas,
 * extraindo o código de rastreio, NF, status, remetente, destinatário e previsão de entrega.
 */
export function parseTrackingHtml(htmlContent: string): TrackingItem[] {
  if (!htmlContent) return [];

  const cardRegex = /<a\s+[^>]*href="\/encomendas\/([^"]+)"[\s\S]*?<\/a\s*>/g;
  const matches = [...htmlContent.matchAll(cardRegex)];

  return matches.map((match) => {
    const trackingCode = match[1];
    const block = match[0];

    // Nota Fiscal
    const invoiceMatch = block.match(/NF-[0-9A-Za-z]+/);
    const invoice = invoiceMatch ? invoiceMatch[0] : null;

    // Status (Em Trânsito, Entregue, Pendente, Cancelado, Saiu para Entrega, etc.)
    const statusMatch = block.match(
      /<span\s+class="w-1\.5\s+h-1\.5[^"]*"><\/span\s*>\s*<span>([^<]+)<\/span\s*>/,
    );
    const status = statusMatch ? cleanText(statusMatch[1]) : null;

    // Origem (Remetente)
    const originSectionMatch = block.match(
      /Origem \(Remetente\)[\s\S]*?(?=Destino \(Destinatário\)|$)/,
    );
    const originSection = originSectionMatch ? originSectionMatch[0] : '';
    const senderName = originSection.match(
      /<p\s+class="[^"]*font-bold[^"]*">([\s\S]*?)<\/p\s*>/,
    )?.[1];
    const senderDoc = originSection.match(
      /Doc:\s*(?:<!--[\s\S]*?-->)?\s*([0-9./-]+)/,
    )?.[1];
    const senderLocation = originSection.match(
      /<span\s+class="text-\[11px\][^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
    )?.[1];

    // Destino (Destinatário)
    const destSectionMatch = block.match(
      /Destino \(Destinatário\)[\s\S]*?(?=<div\s+class="mt-3\s+pt-2|$)/,
    );
    const destSection = destSectionMatch ? destSectionMatch[0] : '';
    const recipientName = destSection.match(
      /<p\s+class="[^"]*font-bold[^"]*">([\s\S]*?)<\/p\s*>/,
    )?.[1];
    const recipientDoc = destSection.match(
      /(?:CPF\/Doc|Doc):\s*(?:<!--[\s\S]*?-->)?\s*([0-9./-]+)/,
    )?.[1];
    const recipientLocation = destSection.match(
      /<span\s+class="text-\[11px\][^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
    )?.[1];

    // Previsão de Entrega
    const deliveryMatch = block.match(
      /Previsão:\s*<\/span\s*>[\s\S]*?<span\s+class="[^"]*font-mono[^"]*"[^>]*>([\s\S]*?)<\/span\s*>/,
    );
    const estimatedDelivery = deliveryMatch
      ? cleanText(deliveryMatch[1])
      : null;

    return {
      trackingCode,
      invoice,
      status,
      sender: {
        name: cleanText(senderName),
        document: cleanText(senderDoc),
        location: cleanText(senderLocation),
      },
      recipient: {
        name: cleanText(recipientName),
        document: cleanText(recipientDoc),
        location: cleanText(recipientLocation),
      },
      estimatedDelivery,
    };
  });
}
