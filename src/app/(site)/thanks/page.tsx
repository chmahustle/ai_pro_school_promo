import { redirect } from "next/navigation";
import { GENERAL_PRODUCT, resolveLeadProduct } from "@/data/product-ids";

/** Старый адрес /thanks?interest=…: переводим на /thanks/<продукт> (закладки, письма) */
export default async function ThanksLegacyRedirect({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
  const { interest } = await searchParams;
  redirect(`/thanks/${resolveLeadProduct(interest) || GENERAL_PRODUCT}`);
}
