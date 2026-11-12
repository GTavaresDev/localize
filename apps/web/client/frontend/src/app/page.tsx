import { Suspense } from "react";
import { orderGateway } from "@/core/domain/orders/gateways/order.gateway";

async function OrderContent() {
  const result = await orderGateway.getOrder();

  if (result.isFailure()) {
    return (
      <p style={{ color: "red" }}>
        Erro: {result.value.message} (status: {result.value.status})
      </p>
    );
  }

  return (
    <p>
      Mensagem recebida do Nest: <strong>{result.value}</strong>
    </p>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<p>Carregando dados do pedido...</p>}>
        <OrderContent />
      </Suspense>
    </main>
  );
}
