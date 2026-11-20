import { redirect } from "next/navigation";

interface EncomendasPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EncomendasRedirectPage({ searchParams }: EncomendasPageProps) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedParams)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        params.append(key, v);
      }
    } else {
      params.set(key, value);
    }
  }

  const query = params.toString();
  redirect(query ? `/ssw/100?${query}` : "/ssw/100");
}
