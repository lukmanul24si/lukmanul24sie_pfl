/**
 * Helper untuk mengonversi data pesanan JSON menjadi file Excel (CSV)
 * @param {Array} ordersData - Array berisi list objek pesanan dari global state/context
 */
export const exportToExcel = (ordersData) => {
  // 1. Cek validasi, kalau datanya kosong, batalkan proses
  if (!ordersData || ordersData.length === 0) {
    alert("Waduh bro, belum ada data pesanan hari ini yang bisa direkap!");
    return;
  }

  // 2. Definisikan Header / Judul Kolom paling atas di Excel
  // Menggunakan separator titik koma (;) agar kompatibel langsung dengan Excel region Indonesia
  const headers = [
    "ID Transaksi",
    "Waktu & Tanggal",
    "Nama Pelanggan",
    "Item yang Dibeli (Detail Menu)",
    "Total Item",
    "Total Omzet (Rp)"
  ];

  // 3. Gabungkan header menjadi baris pertama CSV
  let csvContent = headers.join(";") + "\n";

  // 4. Looping data pesanan untuk diubah jadi baris-baris Excel
  ordersData.forEach((order) => {
    // A. Olah data item/menu rapi agar tidak merusak struktur kolom Excel
    // Hasilnya akan seperti: "2x Kopi Susu Bogeng, 1x Croissant"
    const detailItems = order.items
      ? order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")
      : "Tidak ada detail";

    // B. Hitung total kuantitas barang yang dibeli di satu invoice
    const totalQty = order.items
      ? order.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    // C. Ambil data dasar (Gunakan nilai fallback/default " - " jika data kosong)
    const id = order.id || "-";
    const date = order.date || new Date().toLocaleString("id-ID");
    const customer = order.customer || "General Customer";
    const totalAmount = order.total || 0;

    // D. Satukan semua data ke dalam satu baris, bungkus string dengan tanda kutip "" 
    // supaya jika ada karakter koma/titik koma di nama pelanggan tidak mengacak-acak kolom Excel
    const row = [
      `"${id}"`,
      `"${date}"`,
      `"${customer.replace(/"/g, '""')}"`, // escape tanda kutip kalau nama pelanggan aneh-aneh
      `"${detailItems.replace(/"/g, '""')}"`,
      totalQty,
      totalAmount
    ];

    // E. Masukkan baris ke dalam akumulator content csv
    csvContent += row.join(";") + "\n";
  });

  // 5. Proses Ajaib Browser: Ubah String menjadi Blob data berbentuk file spreadsheet
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  // 6. Jalankan Trigger Auto-Download tersembunyi
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  // Format nama file rekap: Rekap_POS_Bogeng_TANGGAL_HARI_INI.csv
  const formatTanggal = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `Rekap_POS_Bogeng_${formatTanggal}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click(); // Klik otomatis via code
  document.body.removeChild(link); // Hapus elemen sampah setelah sukses download
};