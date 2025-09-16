// product.ts - Reference file for product data structure
// This file contains examples of complete product data with technical specifications

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  specifications: { [key: string]: string };
  created_at?: string;
  updated_at?: string;
}

// Example product data with complete technical specifications
export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Atsaka Portable High Pressure Fire Floating Pump Honda GXV160",
    slug: "atsaka-portable-high-pressure-fire-floating-pump-honda-gxv160",
    category: "pump",
    description:
      "KAIGUN Pro adalah produk lokal pompa apung ATSAKA dengan di perkuat dengan engine dari Honda GXV160 bertenaga 4,3 HP yang bersertifikat OEM. Pompa ini mampu mengeluarkan air bertejanan tinggi hingga 5 Bar yang mampu menhangkau hingga 32 meter. Pompa ini memiliki tanki tambahan yang mampu memperpanjang waktu operasional.",
    features: [
      "Engine Honda GXV160 4.3 HP OEM certified",
      "High pressure output up to 5 Bar (72.5 PSI)",
      "Maximum reach up to 32 meters",
      "Additional tank for extended operation time",
      "Floating pump design for water surface operation",
      "Compact and portable construction",
    ],
    imageUrl:
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/10/21/f02dff17-be1e-405a-a681-58dd72a17c8e.jpg",
    imageUrls: [
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/10/21/f02dff17-be1e-405a-a681-58dd72a17c8e.jpg",
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/10/21/7688b57b-862c-48c4-accb-ec55893b0aec.jpg",
    ],
    specifications: {
      Model: "Honda GXV160",
      "Engine Type": "Aircooled 4stroke OHV",
      "Bore x Stroke": "68 x 45 mm",
      Displacement: "163 cm³",
      "Net Power Output": "4.3 hp (3.2kW) @ 3.600 rpm",
      "Normal Operating Engine Speed": "2970 rpm",
      "Maximum Pressure": "5 Bar (72.5 PSI)",
      "Maximum Reach": "32 meters",
      "Pump Type": "Floating Pump",
      "Additional Tank": "Yes",
      Weight: "25 kg",
      "Dimensions (L x W x H)": "600 x 400 x 450 mm",
      "Fuel Type": "Petrol",
      "Fuel Tank Capacity": "3.1 liters",
      "Oil Capacity": "0.6 liters",
      "Starting System": "Recoil Start",
      Certification: "OEM Honda",
    },
  },
  {
    id: "2",
    name: "ATSAKA Pompa Punggung / Backpack Jet Shooter",
    slug: "atsaka-pompa-punggung-backpack-jet-shooter",
    category: "aksesori",
    description:
      "Pompa punggung merupakan peralatan tangan (hand tools) yang digunakan untuk pemadaman kebakaran hutan dan lahan terutama untuk memadamkan jenis api permukaan sangat tinggi 1-1,5m dan akan lebih efektif jika digunakan bersinergi dengan alat lainnya seperti kepyok. Kompoen pompa punggung berbentuk seperti ransel yang berfungsi unruk menampung air",
    features: [
      "Bahan tahan api yang tahan lama",
      "Desain ergonomis dengan tali bahu berlapis busa",
      "Nozel yang dapat disesuaikan untuk kontrol pola semprotan",
      "Port pengisian cepat dengan filter",
      "Terlihat dalam kondisi cahaya redup",
      "Ringan dan mudah digerakkan",
    ],
    imageUrl:
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/4be6acd1-c610-4761-9def-08d3e5e5f149.jpg.webp?ect=4g",
    imageUrls: [
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/4be6acd1-c610-4761-9def-08d3e5e5f149.jpg.webp?ect=4g",
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/e48bda24-ec66-467c-baf7-d1273e75345f.jpg.webp?ect=4g",
    ],
    specifications: {
      Material: "Fire-resistant rubber body",
      Volume: "20 liters",
      "Working Pressure": "5 Bar (72.5 PSI)",
      "Spray Distance": "8 meters",
      Colour: "Yellow",
      Transportation: "Shoulder straps with foam padding",
      "Min Width": "435 mm",
      "Max Width": "625 mm",
      Length: "665 mm",
      Size: "62 x 32 x 68 cm",
      Weight: "8 kg (empty)",
      "Nozzle Type": "Adjustable spray pattern",
      "Filling Port": "Quick-fill with filter",
      Visibility: "Reflective strips for low light conditions",
      Compatibility: "Works with standard fire hoses",
    },
  },
  {
    id: "3",
    name: "Atsaka Engine ATS GX690",
    slug: "atsaka-engine-ats-gx690",
    category: "pump",
    description:
      "ATS GX690 adalah produk lokal ATSAKA dengan di perkuat dengan engine dari honda GX690 bertenaga 25 HP yang bersertifikat OEM. Pompa ini mampu mengisap air hanya dengan 12 detik dengan sistem priming 3 blade rotary dan mengeluarkan air bertekanan tinggi hingga 8 bar yang mampu mengeluarkan debit air hingga 6,7 liter per jam.",
    features: [
      "Honda GX690 engine 25 HP OEM certified",
      "3-blade rotary priming system",
      "12-second priming time",
      "High pressure output up to 8 Bar (116 PSI)",
      "Flow rate up to 6.7 liters per hour",
      "Durable construction for heavy-duty use",
      "Easy maintenance and service access",
    ],
    imageUrl:
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/8/21/bec80311-1eb6-42cd-9666-25d297af8ca7.jpg.webp?ect=4g",
    imageUrls: [
      "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/8/21/bec80311-1eb6-42cd-9666-25d297af8ca7.jpg.webp?ect=4g",
    ],
    specifications: {
      Model: "Honda GX690",
      "Engine Type": "4-stroke, overhead valve, 90° V-twin cylinder",
      "Displacement (cm³)": "688 cm³",
      "Bore and Stroke": "78.0 x 72 mm",
      "Compression Ratio": "9.3",
      "Gross Power (SAE J1995)": "18.75 kW (25.0 HP) @ 3600 rpm",
      "Max. Net Torque (SAE J1349)": "48.3 Nm (4.93 kgfm) @ 2500 rpm",
      "Fuel Tank Capacity": "10 liters",
      "Fuel Consumption (@rated power)": "6.7 L/h",
      "Recommended Fuel": "Unleaded gasoline (octane 86 or higher)",
      "Ignition System": "CDI type magneto ignition",
      Outlet: 'Camlock type A3"',
      "Vacuum Pump": "3-blade rotary system",
      Suction: "Manual priming system",
      "Maximum Pressure": "116 psi (8 bar) *shut on",
      "Pump Performance":
        "Straight stream reach 46 meter (Gun Nozzle protek 368)",
      "Priming Performance": "12 seconds (5 meters)",
      "Total Weight": "80 kg",
      Dimensions: "Length x Width x Height 730 x 600 x 730 mm",
      "Starting System": "Electric start with battery",
      "Oil Capacity": "2.1 liters",
      "Air Cleaner": "Dual element",
      "Lubrication System": "Pressure lubrication",
    },
  },
];

// Template for creating new products with specifications
export const createProductTemplate = (): Omit<
  Product,
  "id" | "slug" | "created_at" | "updated_at"
> => ({
  name: "",
  category: "",
  description: "",
  features: [],
  imageUrl: "",
  imageUrls: [],
  specifications: {
    // Engine Specifications
    Model: "",
    "Engine Type": "",
    Displacement: "",
    "Power Output": "",
    "Fuel Type": "",
    "Fuel Consumption": "",

    // Pump Specifications
    "Maximum Pressure": "",
    "Flow Rate": "",
    "Priming Time": "",
    "Maximum Reach": "",
    "Suction Height": "",

    // Physical Specifications
    Weight: "",
    Dimensions: "",
    Material: "",
    Colour: "",

    // Additional Specifications
    "Working Temperature": "",
    "Storage Temperature": "",
    Warranty: "",
    Certification: "",
  },
});

// Helper function to validate product specifications
export const validateProductSpecifications = (specifications: {
  [key: string]: string;
}): boolean => {
  // Check if at least basic specifications are filled
  const requiredKeys = ["Model", "Engine Type", "Maximum Pressure"];
  return requiredKeys.every(
    (key) => specifications[key] && specifications[key].trim() !== ""
  );
};

// Helper function to format specifications for display
export const formatSpecifications = (specifications: {
  [key: string]: string;
}): Array<{ key: string; value: string }> => {
  return Object.entries(specifications)
    .filter(([_, value]) => value && value.trim() !== "")
    .map(([key, value]) => ({ key, value }));
};
