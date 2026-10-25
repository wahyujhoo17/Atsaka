import React from "react";
import { IconSelect, ImageInput, ListEditor, TextInput } from "./HomepageEditor";
import { ProductDetails, toProductDetails } from "../../lib/productDetails";

interface ProductDetailsEditorProps {
  details: unknown;
  onChange: (details: ProductDetails) => void;
}

// Detail-page extras for a product: tagline, certification strip and "Mengapa memilih" cards
const ProductDetailsEditor: React.FC<ProductDetailsEditorProps> = ({ details, onChange }) => {
  const value = toProductDetails(details);
  const update = (patch: Partial<ProductDetails>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-6">
      <TextInput
        label="Tagline"
        hint="Satu kalimat di bawah nama produk. Kosong = kalimat pertama deskripsi."
        value={value.tagline || ""}
        onChange={(tagline) => update({ tagline })}
      />

      <ListEditor
        label="Badge Sertifikasi & Garansi"
        items={value.badges || []}
        onChange={(badges) => update({ badges })}
        createItem={() => ({ icon: "award", label: "" })}
        itemTitle={(item) => item.label.split("\n")[0] || "(baru)"}
        renderItem={(item, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <IconSelect value={item.icon} onChange={(icon) => updateItem({ icon })} />
            <TextInput
              label="Label"
              multiline
              hint="Enter untuk pindah baris"
              value={item.label}
              onChange={(label) => updateItem({ label })}
            />
          </div>
        )}
      />

      <ListEditor
        label="Kartu “Mengapa Memilih”"
        items={value.reasons || []}
        onChange={(reasons) => update({ reasons })}
        createItem={() => ({ title: "", description: "", image: "" })}
        itemTitle={(item) => item.title || "(baru)"}
        renderItem={(item, updateItem) => (
          <>
            <TextInput label="Judul" value={item.title} onChange={(title) => updateItem({ title })} />
            <TextInput
              label="Deskripsi"
              multiline
              value={item.description}
              onChange={(description) => updateItem({ description })}
            />
            <ImageInput label="Gambar" value={item.image} onChange={(image) => updateItem({ image })} />
          </>
        )}
      />
    </div>
  );
};

export default ProductDetailsEditor;
