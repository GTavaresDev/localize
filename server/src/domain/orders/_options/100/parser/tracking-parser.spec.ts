import * as fs from 'fs';
import * as path from 'path';
import { parseTrackingHtml } from './tracking-parser';

describe('TrackingParser', () => {
  it('should parse all trackings from option-100.html fixture correctly', () => {
    const fixturePath = path.resolve(__dirname, '__fixtures__/option-100.html');
    const html = fs.readFileSync(fixturePath, 'utf-8');

    const result = parseTrackingHtml(html);

    expect(result).toHaveLength(9);

    expect(result[0]).toEqual({
      trackingCode: 'BR987654321BR',
      invoice: 'NF-0019283',
      status: 'Em Trânsito',
      sender: {
        name: 'Tech Log Distribuidora LTDA',
        document: '12.345.678/0001-90',
        location: 'São Paulo, SP',
      },
      recipient: {
        name: 'Carlos Eduardo Silva',
        document: '321.654.987-00',
        location: 'Rio de Janeiro, RJ',
      },
      estimatedDelivery: '12/11/2026',
    });

    expect(result[1]).toEqual({
      trackingCode: 'BR111222333BR',
      invoice: 'NF-0019290',
      status: 'Entregue',
      sender: {
        name: 'Mega Eletrônicos S/A',
        document: '45.123.789/0002-55',
        location: 'Campinas, SP',
      },
      recipient: {
        name: 'Carlos Eduardo Silva',
        document: '321.654.987-00',
        location: 'Rio de Janeiro, RJ',
      },
      estimatedDelivery: '06/11/2026',
    });

    expect(result[2]).toEqual({
      trackingCode: 'BR445566778BR',
      invoice: 'NF-0019301',
      status: 'Pendente',
      sender: {
        name: 'Livros & Cultura Livraria',
        document: '33.222.111/0001-88',
        location: 'Porto Alegre, RS',
      },
      recipient: {
        name: 'Carlos Eduardo Silva',
        document: '321.654.987-00',
        location: 'Rio de Janeiro, RJ',
      },
      estimatedDelivery: '18/11/2026',
    });

    expect(result[4].status).toBe('Cancelado');
    expect(result[5].status).toBe('Saiu para Entrega');
  });

  it('should return empty array if html is empty', () => {
    expect(parseTrackingHtml('')).toEqual([]);
  });
});
