import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  EyeOff,
  Loader,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { api } from "../../lib/api";
import {
  DbProduct,
  defaultHomepageContent,
  HomepageContent,
  IconItem,
  mergeHomepageContent,
  ProductCardContent,
} from "../../data/homepageContent";
import { contentIcons } from "../../lib/contentIcons";

const inputClasses =
  "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

// ---------- Small field components ----------

export const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
    {children}
    {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
  </label>
);

export const TextInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
}> = ({ label, value, onChange, multiline, hint }) => (
  <Field label={label} hint={hint}>
    {multiline ? (
      <textarea
        className={inputClasses}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input className={inputClasses} value={value} onChange={(e) => onChange(e.target.value)} />
    )}
  </Field>
);

export const IconSelect: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange,
}) => {
  const Icon = contentIcons[value];
  return (
    <Field label="Ikon">
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {Icon && <Icon className="w-5 h-5 text-red-600" />}
        </span>
        <select className={inputClasses} value={value} onChange={(e) => onChange(e.target.value)}>
          {Object.keys(contentIcons).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
};

export const ImageInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await api.uploadImage(file);
      onChange(result.url);
      toast.success(`Gambar berhasil diupload (${result.size}KB)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex gap-3 items-start">
        <div className="w-24 h-24 shrink-0 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">Kosong</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className={inputClasses}
            value={value}
            placeholder="URL gambar atau upload"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Mengupload..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>
    </Field>
  );
};

// Editable list with add / remove / reorder
export function ListEditor<T>({
  label,
  items,
  onChange,
  createItem,
  itemTitle,
  renderItem,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label} ({items.length})
        </span>
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {index + 1}. {itemTitle(item, index)}
            </span>
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => move(index, index - 1)} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Naikkan">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => move(index, index + 1)} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Turunkan">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="p-1.5 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                aria-label="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {renderItem(item, (patch) =>
            onChange(items.map((current, i) => (i === index ? { ...current, ...patch } : current))),
          )}
        </div>
      ))}
    </div>
  );
}

const IconItemFields: React.FC<{
  item: IconItem;
  update: (patch: Partial<IconItem>) => void;
  descriptionLabel?: string;
}> = ({ item, update, descriptionLabel = "Deskripsi" }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <IconSelect value={item.icon} onChange={(icon) => update({ icon })} />
    <TextInput label="Judul" value={item.title} onChange={(title) => update({ title })} />
    <div className="md:col-span-2">
      <TextInput label={descriptionLabel} value={item.description} onChange={(description) => update({ description })} />
    </div>
  </div>
);

const createProductCard = (): ProductCardContent => ({
  name: "",
  subtitle: "",
  image: "",
  link: "/products",
  specs: [
    { label: "Berat", value: "" },
    { label: "Debit Air", value: "" },
    { label: "Max Pressure", value: "" },
    { label: "Straight Stream Reach", value: "" },
    { label: "Engine Power", value: "" },
  ],
});

const ProductCardFields: React.FC<{
  item: ProductCardContent;
  update: (patch: Partial<ProductCardContent>) => void;
  imageHint?: string;
}> = ({ item, update, imageHint }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <TextInput label="Nama Produk" value={item.name} onChange={(name) => update({ name })} />
      <TextInput label="Sub Judul" value={item.subtitle} onChange={(subtitle) => update({ subtitle })} />
      <div className="md:col-span-2">
        <TextInput label="Link Jelajahi Produk" value={item.link} onChange={(link) => update({ link })} />
      </div>
    </div>
    <ImageInput label="Gambar Produk" value={item.image} onChange={(image) => update({ image })} />
    {imageHint && <p className="text-xs text-gray-500 -mt-2">{imageHint}</p>}
    <ListEditor
      label="Spesifikasi"
      items={item.specs}
      onChange={(specs) => update({ specs })}
      createItem={() => ({ label: "", value: "" })}
      itemTitle={(spec) => spec.label || "(baru)"}
      renderItem={(spec, updateSpec) => (
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Label" value={spec.label} onChange={(label) => updateSpec({ label })} />
          <TextInput label="Nilai" value={spec.value} onChange={(value) => updateSpec({ value })} />
        </div>
      )}
    />
  </>
);

const Section: React.FC<{
  title: string;
  visible?: boolean;
  onToggleVisible?: () => void;
  children: React.ReactNode;
}> = ({ title, visible, onToggleVisible, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between px-5 py-4">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 text-left flex-1">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </button>
        {onToggleVisible && (
          <button
            type="button"
            onClick={onToggleVisible}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${
              visible
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {visible ? "Tampil" : "Disembunyikan"}
          </button>
        )}
      </div>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">{children}</div>}
    </div>
  );
};

// Choose which Products-table items appear in the slider, in order
const PICKER_PAGE_SIZE = 8;

const ProductPicker: React.FC<{
  products: DbProduct[] | null;
  selected: string[];
  onChange: (slugs: string[]) => void;
}> = ({ products, selected, onChange }) => {
  const [query, setQuery] = useState("");
  const [pickerPage, setPickerPage] = useState(0);

  if (products === null) {
    return <Loader className="w-5 h-5 animate-spin text-blue-600" />;
  }
  if (products.length === 0) {
    return (
      <p className="text-sm text-amber-600">
        Belum ada data di menu Products. Slider akan memakai kartu manual sampai produk ditambahkan.
      </p>
    );
  }

  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const unselected = products.filter(
    (product) =>
      !selected.includes(product.slug) &&
      `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const pickerPageCount = Math.max(1, Math.ceil(unselected.length / PICKER_PAGE_SIZE));
  const currentPickerPage = Math.min(pickerPage, pickerPageCount - 1);
  const visibleUnselected = unselected.slice(
    currentPickerPage * PICKER_PAGE_SIZE,
    (currentPickerPage + 1) * PICKER_PAGE_SIZE,
  );
  const move = (from: number, to: number) => {
    if (to < 0 || to >= selected.length) return;
    const next = [...selected];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Nama, sub judul, gambar utama, dan spesifikasi berbintang (★) diambil langsung dari menu Products.
        Jika tidak ada yang dipilih, slider menampilkan semua produk kategori <code>pompa</code>.
      </p>
      <div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Ditampilkan ({selected.length})
        </span>
        <div className="mt-2 space-y-2">
          {selected.length === 0 && (
            <p className="text-sm text-gray-500 italic">Belum dipilih: menampilkan semua produk kategori pompa.</p>
          )}
          {selected.map((slug, index) => {
            const product = bySlug.get(slug);
            return (
              <div key={slug} className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span className="text-xs text-gray-400 w-5">{index + 1}</span>
                {product?.imageUrl && <img src={product.imageUrl} alt="" className="w-10 h-10 object-contain rounded bg-gray-50" />}
                <span className="flex-1 text-sm text-gray-900 dark:text-white truncate">
                  {product?.name || `${slug} (produk sudah dihapus)`}
                </span>
                <button type="button" onClick={() => move(index, index - 1)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Naikkan">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => move(index, index + 1)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Turunkan">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(selected.filter((s) => s !== slug))}
                  className="p-1.5 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  aria-label="Hapus dari slider"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tambahkan produk</span>
          <input
            className={`${inputClasses} sm:max-w-xs`}
            placeholder="Cari nama atau kategori..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPickerPage(0);
            }}
          />
        </div>
        {unselected.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500 italic">Tidak ada produk lain yang cocok.</p>
        ) : (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {visibleUnselected.map((product) => (
              <button
                key={product.slug}
                type="button"
                onClick={() => onChange([...selected, product.slug])}
                className="flex items-center gap-3 p-2 text-left border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Plus className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{product.name}</span>
                <span className="ml-auto text-xs text-gray-400 shrink-0">{product.category}</span>
              </button>
            ))}
          </div>
        )}
        {pickerPageCount > 1 && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {currentPickerPage * PICKER_PAGE_SIZE + 1}–
              {Math.min((currentPickerPage + 1) * PICKER_PAGE_SIZE, unselected.length)} dari {unselected.length} produk
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPickerPage(currentPickerPage - 1)}
                disabled={currentPickerPage === 0}
                className="p-1.5 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pickerPageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPickerPage(index)}
                  className={`min-w-[2rem] px-2 py-1 rounded ${
                    index === currentPickerPage
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPickerPage(currentPickerPage + 1)}
                disabled={currentPickerPage >= pickerPageCount - 1}
                className="p-1.5 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SourceToggle: React.FC<{
  label: string;
  databaseLabel: string;
  value: "database" | "manual";
  onChange: (value: "database" | "manual") => void;
}> = ({ label, databaseLabel, value, onChange }) => (
  <Field label={label}>
    <div className="flex flex-col sm:flex-row gap-2">
      {[
        { value: "database" as const, label: databaseLabel },
        { value: "manual" as const, label: "Isi manual di sini" },
      ].map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm rounded-lg border ${
            value === option.value
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </Field>
);

// Source switch shared by the hero slides and the solutions slider
const ProductSourceFields: React.FC<{
  label: string;
  source: "database" | "manual";
  onSourceChange: (source: "database" | "manual") => void;
  dbProducts: DbProduct[] | null;
  slugs: string[];
  onSlugsChange: (slugs: string[]) => void;
  manualCards: ProductCardContent[];
  onManualCardsChange: (cards: ProductCardContent[]) => void;
  imageHint?: string;
}> = ({ label, source, onSourceChange, dbProducts, slugs, onSlugsChange, manualCards, onManualCardsChange, imageHint }) => (
  <>
    <SourceToggle
      label={`Sumber ${label}`}
      databaseLabel="Otomatis dari menu Products"
      value={source}
      onChange={onSourceChange}
    />
    {source === "manual" ? (
      <ListEditor<ProductCardContent>
        label={label}
        items={manualCards}
        onChange={onManualCardsChange}
        createItem={createProductCard}
        itemTitle={(item) => item.name || "(baru)"}
        renderItem={(item, update) => <ProductCardFields item={item} update={update} imageHint={imageHint} />}
      />
    ) : (
      <ProductPicker products={dbProducts} selected={slugs} onChange={onSlugsChange} />
    )}
  </>
);

// ---------- Editor ----------

const HomepageEditor: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [dbProducts, setDbProducts] = useState<DbProduct[] | null>(null);

  useEffect(() => {
    api
      .getProducts()
      .then((data) => setDbProducts(data || []))
      .catch(() => setDbProducts([]));
    api
      .getContent("homepage")
      .then((result) => setContent(mergeHomepageContent(result.data)))
      .catch(() => {
        toast.error("Gagal memuat konten homepage, menampilkan konten default");
        setContent(mergeHomepageContent(null));
      });
  }, []);

  if (!content) {
    return (
      <div className="py-16 flex justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const updateSection = <K extends keyof HomepageContent>(
    key: K,
    patch: Partial<HomepageContent[K]>,
  ) => {
    setContent({ ...content, [key]: { ...(content[key] as object), ...patch } });
  };

  const toggle = (key: Exclude<keyof HomepageContent, "whatsappNumber">) => ({
    visible: content[key].visible,
    onToggleVisible: () => updateSection(key, { visible: !content[key].visible }),
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateContent("homepage", content);
      toast.success("Konten homepage berhasil disimpan");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan konten");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Kembalikan semua isian ke konten default? Perubahan baru tersimpan setelah klik Simpan.")) {
      setContent(defaultHomepageContent);
    }
  };

  const { hero, certification, features, applications, partners, solutions, cta } = content;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="sticky top-[72px] z-[5] flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tips: tulis <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">*teks*</code> untuk membuat teks
          berwarna merah, tekan Enter untuk baris baru.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" /> Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>

      <Section title="Umum">
        <TextInput
          label="Nomor WhatsApp"
          hint="Format internasional tanpa + atau spasi, contoh: 628176454312"
          value={content.whatsappNumber}
          onChange={(whatsappNumber) => setContent({ ...content, whatsappNumber })}
        />
      </Section>

      <Section title="1. Hero" {...toggle("hero")}>
        <ImageInput label="Gambar Background" value={hero.backgroundImage} onChange={(backgroundImage) => updateSection("hero", { backgroundImage })} />
        <TextInput label="Headline" multiline value={hero.headline} onChange={(headline) => updateSection("hero", { headline })} />
        <TextInput label="Sub Headline" multiline value={hero.subheadline} onChange={(subheadline) => updateSection("hero", { subheadline })} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput label="Tombol Jelajahi Produk" value={hero.primaryCtaLabel} onChange={(primaryCtaLabel) => updateSection("hero", { primaryCtaLabel })} />
          <TextInput label="Tombol WhatsApp" value={hero.secondaryCtaLabel} onChange={(secondaryCtaLabel) => updateSection("hero", { secondaryCtaLabel })} />
          <Field label="Ganti slide otomatis (detik)" hint="Isi 0 untuk mematikan">
            <input
              type="number"
              min={0}
              className={inputClasses}
              value={hero.autoplaySeconds}
              onChange={(e) => updateSection("hero", { autoplaySeconds: Math.max(0, Number(e.target.value) || 0) })}
            />
          </Field>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Posisi Produk di Background (desktop)
          </span>
          <p className="text-xs text-gray-500 mb-3">
            Dalam persen terhadap gambar background. Sesuaikan jika background diganti agar produk berdiri tepat di
            sorotan lampu.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { key: "productLeft" as const, label: "Tengah produk dari kiri (%)", min: 0, max: 100, step: 0.5, unit: "%" },
              { key: "productBottom" as const, label: "Dasar produk dari bawah (%)", min: 0, max: 100, step: 0.5, unit: "%" },
              { key: "productHeight" as const, label: "Tinggi produk (%)", min: 5, max: 80, step: 0.5, unit: "%" },
              { key: "bgZoom" as const, label: "Zoom background (produk ikut membesar)", min: 1, max: 2, step: 0.05, unit: "x" },
              { key: "bgFocusY" as const, label: "Titik fokus zoom dari atas (%)", min: 0, max: 100, step: 0.5, unit: "%" },
            ].map(({ key, label, min, max, step, unit }) => (
              <Field key={key} label={label}>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={hero[key]}
                    onChange={(e) => updateSection("hero", { [key]: Number(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="w-12 text-right text-sm tabular-nums text-gray-700 dark:text-gray-300">
                    {hero[key]}
                    {unit}
                  </span>
                </div>
              </Field>
            ))}
          </div>
        </div>
        <ProductSourceFields
          label="Slide Produk"
          source={hero.productSource}
          onSourceChange={(productSource) => updateSection("hero", { productSource })}
          dbProducts={dbProducts}
          slugs={hero.productSlugs}
          onSlugsChange={(productSlugs) => updateSection("hero", { productSlugs })}
          manualCards={hero.slides}
          onManualCardsChange={(slides) => updateSection("hero", { slides })}
          imageHint="Gunakan gambar produk tanpa background (PNG transparan) agar menyatu dengan latar"
        />
      </Section>

      <Section title="2. Teruji & Tersertifikasi" {...toggle("certification")}>
        <TextInput label="Headline" multiline value={certification.headline} onChange={(headline) => updateSection("certification", { headline })} />
        <ImageInput label="Gambar Produk" value={certification.image} onChange={(image) => updateSection("certification", { image })} />
        <ListEditor
          label="Badge Sertifikasi"
          items={certification.badges}
          onChange={(badges) => updateSection("certification", { badges })}
          createItem={() => ({ icon: "award", label: "" })}
          itemTitle={(item) => item.label || "(baru)"}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <IconSelect value={item.icon} onChange={(icon) => update({ icon })} />
              <TextInput label="Label" multiline hint="Tekan Enter untuk pindah baris" value={item.label} onChange={(label) => update({ label })} />
            </div>
          )}
        />
      </Section>

      <Section title="3. Dirancang untuk Performa Nyata" {...toggle("features")}>
        <TextInput label="Headline" value={features.headline} onChange={(headline) => updateSection("features", { headline })} />
        <TextInput label="Sub Headline" multiline value={features.subheadline} onChange={(subheadline) => updateSection("features", { subheadline })} />
        <ListEditor
          label="Poin Keunggulan"
          items={features.items}
          onChange={(items) => updateSection("features", { items })}
          createItem={() => ({ icon: "zap", title: "", description: "" })}
          itemTitle={(item) => item.title || "(baru)"}
          renderItem={(item, update) => <IconItemFields item={item} update={update} />}
        />
      </Section>

      <Section title="4. Satu Solusi. Beragam Aplikasi." {...toggle("applications")}>
        <TextInput label="Headline" value={applications.headline} onChange={(headline) => updateSection("applications", { headline })} />
        <ListEditor
          label="Kartu Aplikasi"
          items={applications.items}
          onChange={(items) => updateSection("applications", { items })}
          createItem={() => ({ icon: "flame", title: "", description: "", image: "" })}
          itemTitle={(item) => item.title || "(baru)"}
          renderItem={(item, update) => (
            <>
              <IconItemFields item={item} update={update} />
              <ImageInput label="Gambar" value={item.image} onChange={(image) => update({ image })} />
            </>
          )}
        />
      </Section>

      <Section title="5. Mitra / Dipercaya oleh" {...toggle("partners")}>
        <TextInput label="Headline" value={partners.headline} onChange={(headline) => updateSection("partners", { headline })} />
        <ListEditor
          label="Mitra"
          items={partners.items}
          onChange={(items) => updateSection("partners", { items })}
          createItem={() => ({ name: "", logo: "" })}
          itemTitle={(item) => item.name || "(baru)"}
          renderItem={(item, update) => (
            <>
              <TextInput label="Nama" hint="Ditampilkan sebagai teks bila logo kosong" value={item.name} onChange={(name) => update({ name })} />
              <ImageInput label="Logo" value={item.logo} onChange={(logo) => update({ logo })} />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={!!item.showName}
                  onChange={(e) => update({ showName: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Tampilkan nama di samping logo (untuk logo kotak/bulat)
              </label>
            </>
          )}
        />
      </Section>

      <Section title="6. Solusi & Slider Produk" {...toggle("solutions")}>
        <TextInput label="Headline" value={solutions.headline} onChange={(headline) => updateSection("solutions", { headline })} />
        <TextInput label="Sub Headline" multiline value={solutions.subheadline} onChange={(subheadline) => updateSection("solutions", { subheadline })} />
        <SourceToggle
          label="Sumber Tombol Kategori"
          databaseLabel="Otomatis dari kategori produk"
          value={solutions.categorySource}
          onChange={(categorySource) => updateSection("solutions", { categorySource })}
        />
        {solutions.categorySource === "database" ? (
          <p className="text-xs text-gray-500 -mt-2">
            Menampilkan setiap kategori di menu Categories yang memiliki produk, menuju halaman Produk dengan filter
            kategori tersebut. Deskripsi kategori muncul saat kursor diarahkan.
          </p>
        ) : (
        <ListEditor
          label="Tombol Kategori"
          items={solutions.categories}
          onChange={(categories) => updateSection("solutions", { categories })}
          createItem={() => ({ title: "", description: "", link: "/products" })}
          itemTitle={(item) => item.title || "(baru)"}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextInput label="Judul" value={item.title} onChange={(title) => update({ title })} />
              <TextInput label="Link" value={item.link} onChange={(link) => update({ link })} />
              <div className="md:col-span-2">
                <TextInput label="Deskripsi (muncul saat kursor diarahkan)" value={item.description} onChange={(description) => update({ description })} />
              </div>
            </div>
          )}
        />
        )}
        <Field label="Kartu per halaman slider (desktop)" hint="Tablet menampilkan 2 kartu, HP 1 kartu per halaman">
          <select
            className={inputClasses}
            value={solutions.cardsPerView}
            onChange={(e) => updateSection("solutions", { cardsPerView: Number(e.target.value) })}
          >
            {[2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} kartu
              </option>
            ))}
          </select>
        </Field>
        <ProductSourceFields
          label="Kartu Produk (slider)"
          source={solutions.productSource}
          onSourceChange={(productSource) => updateSection("solutions", { productSource })}
          dbProducts={dbProducts}
          slugs={solutions.productSlugs}
          onSlugsChange={(productSlugs) => updateSection("solutions", { productSlugs })}
          manualCards={solutions.products}
          onManualCardsChange={(products) => updateSection("solutions", { products })}
        />
      </Section>

      <Section title="7. Call to Action (penutup)" {...toggle("cta")}>
        <TextInput label="Headline" hint="Teks *bertanda bintang* tampil hitam karena latarnya merah" value={cta.headline} onChange={(headline) => updateSection("cta", { headline })} />
        <TextInput label="Deskripsi" multiline value={cta.description} onChange={(description) => updateSection("cta", { description })} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput label="Tombol WhatsApp" value={cta.primaryLabel} onChange={(primaryLabel) => updateSection("cta", { primaryLabel })} />
          <TextInput label="Tombol Kedua" value={cta.secondaryLabel} onChange={(secondaryLabel) => updateSection("cta", { secondaryLabel })} />
          <TextInput label="Link Tombol Kedua" value={cta.secondaryLink} onChange={(secondaryLink) => updateSection("cta", { secondaryLink })} />
        </div>
      </Section>
    </div>
  );
};

export default HomepageEditor;
