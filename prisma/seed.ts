import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Categories
  console.log("📁 Seeding categories...");

  // Parent Categories
  const alatPemadam = await prisma.category.upsert({
    where: { slug: "alat-pemadam-kebakaran" },
    update: {},
    create: {
      name: "Alat Pemadam Kebakaran",
      slug: "alat-pemadam-kebakaran",
      description: "Peralatan pemadam kebakaran lengkap",
    },
  });

  const alatPeraga = await prisma.category.upsert({
    where: { slug: "alat-peraga-pendidikan" },
    update: {},
    create: {
      name: "Alat Peraga Pendidikan",
      slug: "alat-peraga-pendidikan",
      description: "Alat peraga untuk pendidikan",
    },
  });

  const kimiaLab = await prisma.category.upsert({
    where: { slug: "kimia-laboratorium" },
    update: {},
    create: {
      name: "Kimia Laboratorium",
      slug: "kimia-laboratorium",
      description: "Peralatan dan bahan kimia laboratorium",
    },
  });

  // Sub Categories
  const subcategories = await Promise.all([
    // Sub for Alat Pemadam Kebakaran
    prisma.category.upsert({
      where: { slug: "pompa" },
      update: {},
      create: {
        name: "Pompa",
        slug: "pompa",
        description: "Pompa pemadam kebakaran",
        parentId: alatPemadam.id,
      },
    }),

    // Sub for Alat Peraga Pendidikan
    prisma.category.upsert({
      where: { slug: "peralatan-tangan" },
      update: {},
      create: {
        name: "Peralatan Tangan",
        slug: "peralatan-tangan",
        description: "Peralatan tangan untuk peraga",
        parentId: alatPeraga.id,
      },
    }),

    // Sub for Kimia Laboratorium
    prisma.category.upsert({
      where: { slug: "aksesoris" },
      update: {},
      create: {
        name: "Aksesoris",
        slug: "aksesoris",
        description: "Aksesoris laboratorium",
        parentId: kimiaLab.id,
      },
    }),
  ]);

  console.log(
    `✅ Created 3 parent categories and ${subcategories.length} subcategories`,
  );

  // Seed Products
  console.log("📦 Seeding products...");
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Atsaka Portable High Pressure Fire Floating Pump Honda GXV160",
          slug: "honda-gxv160",
          category: "pompa",
          description:
            "KAIGUN Pro adalah produk lokal pompa apung ATSAKA dengan di perkuat dengan engine dari Honda GXV160 bertenaga 4,3 HP yang bersertifikat OEM. Pompa ini mampu mengeluarkan air bertejanan tinggi hingga 5 Bar yang mampu menhangkau hingga 32 meter. Pompa ini memiliki tanki tambahan yang mampu memperpanjang waktu operasional.",
          features: [
            "Engine Honda GXV160 4.3 HP",
            "Tekanan tinggi hingga 5 Bar",
            "Jangkauan semprot 32 meter",
            "Tanki tambahan untuk operasional lebih lama",
            "Floating pump system",
          ],
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
            "Normal operating engine speed": "2970 rpm",
          },
        },
        {
          name: "ATSAKA Pompa Punggung / Backpack Jet Shooter",
          slug: "atsaka-pompa-punggung",
          category: "aksesoris",
          description:
            "Pompa punggung merupakan peralatan tangan (hand tools) yang digunakan untuk pemadaman kebakaran hutan dan lahan terutama untuk memadamkan jenis api permukaan sangat tinggi 1-1,5m dan akan lebih efektif jika digunakan bersinergi dengan alat lainnya seperti kepyok. Komponen pompa punggung berbentuk seperti ransel yang berfungsi untuk menampung air",
          features: [
            "Bahan tahan api yang tahan lama",
            "Desain ergonomis dengan tali bahu berlapis busa",
            "Nozel yang dapat disesuaikan untuk kontrol pola semprotan",
            "Port pengisian cepat dengan filter",
            "Terlihat dalam kondisi cahaya redup",
          ],
          imageUrl:
            "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/4be6acd1-c610-4761-9def-08d3e5e5f149.jpg.webp",
          imageUrls: [
            "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/4be6acd1-c610-4761-9def-08d3e5e5f149.jpg.webp",
            "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/7/26/e48bda24-ec66-467c-baf7-d1273e75345f.jpg.webp",
          ],
          specifications: {
            Material: "Rubber body",
            Volume: "20 L",
            "Working pressure": "5 Bar",
            "Spray distance": "8 M",
            Colour: "Yellow",
            Transportation: "Tali dan Tangan",
            "Min Width": "435 mm",
            "Max Width": "625 mm",
            Length: "665 mm",
            Size: "62 x 32 x 68 mm",
          },
        },
        {
          name: "Atsaka Engine ATS GX690",
          slug: "atsaka-engine-ats-gx690",
          category: "pompa",
          description:
            "ATS GX690 adalah produk lokal ATSAKA dengan di perkuat dengan engine dari honda GX690 bertenaga 25 HP yang bersertifikat OEM. Pompa ini mampu mengisap air hanya dengan 12 detik dengan sistem priming 3 blade rotary dan mengeluarkan air bertekanan tinggi hingga 8 bar yang mampu mengeluarkan debit air hingga 6,7 liter per jam.",
          features: [
            "Engine Honda GX690 25 HP",
            "Tekanan tinggi hingga 8 Bar",
            "Priming cepat 12 detik",
            "3 blade rotary system",
            "Jangkauan semprot 46 meter",
          ],
          imageUrl:
            "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/8/21/bec80311-1eb6-42cd-9666-25d297af8ca7.jpg.webp",
          imageUrls: [
            "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/8/21/bec80311-1eb6-42cd-9666-25d297af8ca7.jpg.webp",
          ],
          specifications: {
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
            "vacuum pump": "3 blade rotary system",
            Suction: "priming system manual",
            "Tekanan max.": "116 psi (8 bar) *shut on",
            "Pump performance":
              "straight stream reach 46 meter (Gun Nozzle protek 368)",
            "Priming performance": "12 sec (5 meter)",
            "Total weight": "80 kg",
            Dimensions: "Length x width x height 730 x 600 x 730 mm",
          },
        },
      ],
    });
    console.log("✅ Created 3 products");
  } else {
    console.log("⏭️  Products already seeded, skipping...");
  }

  // Seed Gallery
  console.log("🖼️  Seeding gallery...");
  const galleryCount = await prisma.gallery.count();
  if (galleryCount === 0) {
    await prisma.gallery.createMany({
      data: [
        {
          title: "Pemadam Kebakaran Hutan",
          description:
            "Demonstrasi penggunaan alat pemadam kebakaran di area hutan",
          type: "video",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          category: "product",
        },
        {
          title: "Tim Rescue ATS",
          description: "Tim rescue ATS dalam aksi penyelamatan",
          type: "photo",
          imageUrl:
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
          category: "training",
        },
        {
          title: "Pelatihan Pemadam Kebakaran",
          description:
            "Sesi pelatihan intensif untuk anggota pemadam kebakaran",
          type: "video",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          category: "training",
        },
        {
          title: "Equipment Showcase",
          description: "Koleksi peralatan pemadam kebakaran ATS lengkap",
          type: "photo",
          imageUrl:
            "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800",
          category: "product",
        },
        {
          title: "Simulasi Kebakaran",
          description: "Latihan simulasi penanganan kebakaran hutan",
          type: "video",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          category: "training",
        },
        {
          title: "Base Camp Operation",
          description: "Operasi base camp dalam penanganan kebakaran besar",
          type: "photo",
          imageUrl:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          category: "field",
        },
      ],
    });
    console.log("✅ Created 6 gallery items");
  } else {
    console.log("⏭️  Gallery already seeded, skipping...");
  }

  // Seed Admin User
  console.log("👤 Seeding admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@atsaka.com" },
    update: {},
    create: {
      name: "Admin ATS",
      email: "admin@atsaka.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("✅ Created admin user:");
  console.log("   Email: admin@atsaka.com");
  console.log("   Password: admin123");
  console.log("   ⚠️  PENTING: Ganti password ini setelah login pertama!");

  console.log("");
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
