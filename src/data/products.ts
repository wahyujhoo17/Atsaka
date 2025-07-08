import { Product } from "../types";

// Define the slugify function
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/[^\w-]+/g, "") // Hapus karakter non-word atau non-hubung
    .replace(/--+/g, "-") // Ganti tanda hubung ganda dengan satu
    .replace(/^-+/, "") // Hapus tanda hubung di awal
    .replace(/-+$/, ""); // Hapus tanda hubung di akhir
};

export const products: Product[] = [
  {
    id: "1",
    name: "Atsaka Portable High Pressure Fire Floating Pump Honda GXV160",
    slug: slugify("Honda GXV160"),
    category: "pump",
    description:
      "KAIGUN Pro adalah produk lokal pompa apung ATSAKA dengan di perkuat dengan engine dari Honda GXV160 bertenaga 4,3 HP yang bersertifikat OEM. Pompa ini mampu mengeluarkan air bertejanan tinggi hingga 5 Bar yang mampu menhangkau hingga 32 meter. Pompa ini memiliki tanki tambahan yang mampu memperpanjang waktu operasional.",
    features: ["Fitur A", "Fitur B"],
    imageUrl:
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/10/21/f02dff17-be1e-405a-a681-58dd72a17c8e.jpg",
    imageUrls: [
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/10/21/f02dff17-be1e-405a-a681-58dd72a17c8e.jpg",
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/10/21/7688b57b-862c-48c4-accb-ec55893b0aec.jpg",
    ],
    specifications: {
      Model: "Honda GXV160",
      "Engine type": "Aircooled 4stroke OHV",
      "Bore x Stroke": "68 x 45 mm",
      Displacement: "163 cm3",
      "Net power output": "4.3 hp (3.2kW)@ 3.600 rpm",
      "Normal operating engine speed ": "2970 rpm",
    },
  },
  {
    id: "2",
    name: "ATSAKA Pompa Punggung / Backpack Jet Shooter",
    slug: slugify("ATSAKA Pompa Punggungk"),
    category: "aksesori",
    description:
      "Pompa punggung merupakan peralatan tangan (hand tools) yang digunakan untuk pemadaman kebakaran hutan dan lahan terutama untuk memadamkan jenis api permukaan sangat tinggi 1-1,5m dan akan lebih efektif jika digunakan bersinergi dengan alat lainnya seperti kepyok. Kompoen pompa punggung berbentuk seperti ransel yang berfungsi unruk menampung air",
    features: [
      "Bahan tahan api yang tahan lama",
      "Desain ergonomis dengan tali bahu berlapis busa",
      "Nozel yang dapat disesuaikan untuk kontrol pola semprotan",
      "Port pengisian cepat dengan filter",
      "Terlihat dalam kondisi cahaya redup",
    ],
    imageUrl:
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/4be6acd1-c610-4761-9def-08d3e5e5f149.jpg.webp?ect=4g",
    imageUrls: [
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/4be6acd1-c610-4761-9def-08d3e5e5f149.jpg.webp?ect=4g",
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/e48bda24-ec66-467c-baf7-d1273e75345f.jpg.webp?ect=4g",
    ],
    specifications: {
      Material: "Rubber body",
      Volume: "20 L",
      "Working pressure": "5 Bar",
      "Spray distance": "8 M",
      Colour: "Yellow",
      Transportation: "Tali dan Tangan", // Corrected typo: Transportasion -> Transportation
      "Min Width": "435 mm",
      "Max Width": "625 mm",
      Length: "665 mm", // Corrected typo: Leght -> Length
      Size: "62 x 32 x 68 mm",
    },
  },
  {
    id: "3",
    name: "Atsaka Engine ATS GX690", // Kept name, seems more appropriate than description title
    slug: slugify("Atsaka Engine ATS GX690"),
    category: "pump", // Updated category based on description
    description:
      "ATS GX690 adalah produk lokal ATSAKA dengan di perkuat dengan engine dari honda GX690 bertenaga 25 HP yang bersertifikat OEM. Pompa ini mampu mengisap air hanya dengan 12 detik dengan sistem priming 3 blade rotary dan mengeluarkan air bertekanan tinggi hingga 8 bar yang mampu mengeluarkan debit air hingga 6,7 liter per jam.", // New description
    features: [
      // Kept original features as none were provided
      "Jaket luar tahan abrasi dan panas",
      "Ringan untuk manuver yang mudah",
      "Kopling sambungan cepat",
      "Desain kehilangan gesekan rendah",
      "Tersedia dalam berbagai panjang",
    ],
    // Kept original image
    imageUrl:
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/8/21/bec80311-1eb6-42cd-9666-25d297af8ca7.jpg.webp?ect=4g",
    imageUrls: [
      // Kept original images
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/8/21/bec80311-1eb6-42cd-9666-25d297af8ca7.jpg.webp?ect=4g",
    ],
    specifications: {
      // New specifications from prompt
      Model: "Honda GX690",
      "Engine type": "4 store, overhead valve 90° vtwin cylinder",
      "Displacement (cm3)": "688 cm³",
      "Bore and stroke": "78.0 x 72 mm",
      "Compression ratio": "9.3",
      "Gross power (SAE J1995)": "18.75KW (25.0HP)/3600 rpm",
      "Max. net torque (SAE J1349)*": "48.3 Nm (4.93 kgfm)/2500 rpm",
      "Fuel tank capacity": "10 liter",
      "Fuel consumption (@rated power)": "6.7 L/h",
      "Recommended fuel": "unleaded gasoline (oktan 86 or higher)",
      "ignition system": "CDI type magneto ignition",
      outlet: 'camlock type A3"',
      "vacuum pump": "3 blade rotary system", // Corrected typo
      Suction: "priming system manual",
      "Tekanan max.": "116 psi (8 bar) *shut on",
      "Pump performance":
        "straight stream reach 46 meter (Gun Nozzle protek 368)",
      "Priming performance": "12 sec (5 meter)",
      "Total weight": "80 kg",
      Dimensions: "Length x width x height 730 x 600 x 730 mm",
    },
  },
];
