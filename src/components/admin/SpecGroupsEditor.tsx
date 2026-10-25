import React from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, Star, Trash2, X } from "lucide-react";
import { MAX_HIGHLIGHTS, SpecGroup, SpecItem } from "../../lib/specGroups";

const inputClasses =
  "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const moveItem = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

interface SpecGroupsEditorProps {
  groups: SpecGroup[];
  onChange: (groups: SpecGroup[]) => void;
}

// Free-form grouped specifications: admins name each group (e.g. "Mesin", "Pompa") and add rows under it
const SpecGroupsEditor: React.FC<SpecGroupsEditorProps> = ({ groups, onChange }) => {
  const updateGroup = (index: number, patch: Partial<SpecGroup>) =>
    onChange(groups.map((group, i) => (i === index ? { ...group, ...patch } : group)));

  const updateItem = (groupIndex: number, itemIndex: number, patch: Partial<SpecItem>) =>
    updateGroup(groupIndex, {
      items: groups[groupIndex].items.map((item, i) => (i === itemIndex ? { ...item, ...patch } : item)),
    });

  const addItem = (groupIndex: number) =>
    updateGroup(groupIndex, { items: [...groups[groupIndex].items, { label: "", value: "" }] });

  const addGroup = () => onChange([...groups, { title: "", items: [{ label: "", value: "" }] }]);

  const highlightCount = groups.reduce(
    (count, group) => count + group.items.filter((item) => item.highlight).length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 px-4 py-3">
        <Star className="w-4 h-4 mt-0.5 shrink-0 fill-amber-400 text-amber-500" />
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          Klik <strong>★</strong> pada baris yang ingin ditonjolkan di kartu produk dan hero homepage
          (maks. {MAX_HIGHLIGHTS}, tampil sesuai urutan tabel).{" "}
          <span className="font-semibold tabular-nums">
            {highlightCount}/{MAX_HIGHLIGHTS} dipilih
          </span>
        </p>
      </div>

      {groups.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada spesifikasi.</p>
          <p className="text-xs text-gray-400 mt-1">
            Buat grup dengan sub judul, misalnya <em>Mesin</em>, <em>Pompa</em>, atau <em>Dimensi</em>.
          </p>
        </div>
      )}

      {groups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 overflow-hidden"
        >
          {/* Group header: sub title + controls */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
            <input
              type="text"
              value={group.title}
              onChange={(e) => updateGroup(groupIndex, { title: e.target.value })}
              placeholder={groups.length > 1 ? "Sub judul grup (mis. Mesin)" : "Sub judul (opsional, mis. Mesin)"}
              className="flex-1 min-w-0 px-2 py-1.5 text-sm font-semibold bg-transparent border border-transparent rounded-md text-gray-900 dark:text-white hover:border-gray-200 dark:hover:border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <span className="hidden sm:inline text-xs text-gray-400 shrink-0">{group.items.length} baris</span>
            <button
              type="button"
              onClick={() => onChange(moveItem(groups, groupIndex, groupIndex - 1))}
              disabled={groupIndex === 0}
              className="p-1.5 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
              aria-label="Naikkan grup"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange(moveItem(groups, groupIndex, groupIndex + 1))}
              disabled={groupIndex === groups.length - 1}
              className="p-1.5 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
              aria-label="Turunkan grup"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (group.items.some((item) => item.label || item.value) && !confirm("Hapus grup ini beserta isinya?")) return;
                onChange(groups.filter((_, i) => i !== groupIndex));
              }}
              className="p-1.5 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label="Hapus grup"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Rows */}
          <div className="p-3 space-y-2">
            <div className="hidden sm:grid grid-cols-[1fr_1.4fr_auto] gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              <span>Label</span>
              <span>Nilai</span>
              <span className="w-[6.5rem]" />
            </div>
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className={`grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-center rounded-lg ${item.highlight ? "bg-amber-50/70 dark:bg-amber-900/10 ring-1 ring-amber-200 dark:ring-amber-900/40 p-1.5 -mx-1.5" : ""}`}>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(groupIndex, itemIndex, { label: e.target.value })}
                  placeholder="mis. Engine Type"
                  className={inputClasses}
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateItem(groupIndex, itemIndex, { value: e.target.value })}
                  onKeyDown={(e) => {
                    // Enter on the last value adds a new row instead of submitting the form
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (itemIndex === group.items.length - 1) addItem(groupIndex);
                    }
                  }}
                  placeholder="mis. 4 stroke, OHV"
                  className={inputClasses}
                />
                <div className="flex justify-end gap-0.5">
                  <button
                    type="button"
                    onClick={() => updateItem(groupIndex, itemIndex, { highlight: !item.highlight })}
                    disabled={!item.highlight && highlightCount >= MAX_HIGHLIGHTS}
                    className={`p-1.5 rounded transition-colors disabled:opacity-30 ${
                      item.highlight
                        ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        : "text-gray-300 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    aria-label={item.highlight ? "Hapus dari kartu & hero" : "Tampilkan di kartu & hero"}
                    title={item.highlight ? "Tampil di kartu & hero" : "Tampilkan di kartu & hero"}
                  >
                    <Star className={`w-4 h-4 ${item.highlight ? "fill-amber-400" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateGroup(groupIndex, { items: moveItem(group.items, itemIndex, itemIndex - 1) })}
                    disabled={itemIndex === 0}
                    className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                    aria-label="Naikkan baris"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateGroup(groupIndex, { items: group.items.filter((_, i) => i !== itemIndex) })}
                    className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    aria-label="Hapus baris"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(groupIndex)}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Tambah baris
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Tambah grup spesifikasi
      </button>
    </div>
  );
};

export default SpecGroupsEditor;
