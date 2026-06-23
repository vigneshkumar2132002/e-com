import ProductDetail from '../../../views/ProductDetail';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`);
    if (res.ok) {
      const product = await res.json();
      return {
        title: `${product.name} | Bapuji Surgicals`,
        description: product.description || `Buy ${product.name} in bulk. Custom private-label options and wholesale pricing tables available.`,
        keywords: [product.name, product.category, "Bapuji Surgicals product", "medical supplies wholesale"],
      };
    }
  } catch (e) {
    // Fallback on connection issues
  }
  
  return {
    title: "Product Specifications | Bapuji Surgicals",
    description: "Detailed surgical supplies specifications, B2B price tiers, and OEM capabilities on Bapuji Surgicals.",
  };
}

export default function Page() {
  return <ProductDetail />;
}
