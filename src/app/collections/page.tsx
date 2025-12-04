import Image from "next/image";
import Link from "next/link";
import { shopifyFetch } from "@/lib/shopify";
import { COLLECTION_MENU_QUERY } from "@/lib/queries";

export const metadata = {
  title: "Collections | Factory Mall",
  description: "Browse curated product collections.",
};

export default async function CollectionsPage() {
  const data = await shopifyFetch<any>(COLLECTION_MENU_QUERY, {}, 60);

  const items = data.data.metaobjects.edges
    .map((edge: any) => {
      let col: any = {
        collection: null,
        title: "",
        image: "",
        order: 999,
      };

      edge.node.fields.forEach((field: any) => {
        // Shopify collection reference
        if (field.key === "collection") {
          col.collection = field.reference;
        }

        // Image (either image reference or URL)
        else if (field.key === "image") {
          col.image =
            field.reference?.image?.url || // MediaImage reference
            field.value || // If URL manually added
            "";
        }

        // Custom Title
        else if (field.key === "title") {
          col.title = field.value;
        }

        // Sorting (Integer field)
        else if (field.key === "order") {
          col.order = Number(field.value);
        }
      });

      return col;
    })
    .filter((c: any) => c.collection?.handle) // Only valid collections
    .sort((a: any, b: any) => a.order - b.order); // Manual sorting

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-6">Collections</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item: any, i: number) => (
          <Link
            key={i}
            href={`/collections/${item.collection.handle}`}
            className="group block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* IMAGE */}
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
              <Image
                src={
                  item.image ||
                  item.collection.image?.url ||
                  "/placeholder-collection.jpg"
                }
                alt={item.title || item.collection.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* TITLE */}
            <div className="p-3 text-center">
              <h3 className="text-sm font-medium text-gray-800 group-hover:text-black">
                {item.title || item.collection.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
