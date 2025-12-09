document.addEventListener("alpine:init", () => {
  Alpine.data("assetsPage", () => ({
    // --- CONFIG ---
    apiUrl: "http://localhost:3000/api/master/asset",

    // --- STATE USER & SIDEBAR ---
    username: "Admin", // Nanti diisi dari localStorage
    user_role: "admin",
    isSidebarOpen: false,

    // State Submenu (Samakan dengan Dashboard)
    submenu: {
      admin: false,
      master: true, // Default terbuka karena kita di page Master
      user: false,
    },

    // --- MENU DATA (Diubah URL-nya agar kembali ke Dashboard) ---
    userPesananMenu: [
      { label: "Buat Pesanan Baru", url: "../../index.html" },
      { label: "Status Pesanan", url: "../../index.html" },
      { label: "Riwayat Pesanan", url: "../../index.html" },
    ],

    adminPesananMenu: [
      { label: "Pesanan Baru", url: "../../index.html" },
      { label: "Dalam Proses", url: "../../index.html" },
      { label: "Pesanan Selesai", url: "../../index.html" },
    ],

    // Menu Master Data
    adminMasterMenu: [
      { label: "Assets", url: "#", active: true }, // Halaman ini (Aktif)
      { label: "Expense", url: "/dashboard/master-data/expenses/index.html" }, // Balik ke dashboard
      { label: "Package", url: "/dashboard/master-data/packages/index.html" },
      { label: "Service", url: "/dashboard/master-data/services/index.html" },
    ],

    adminStaticMenu: [
      {
        label: "Layanan & Harga",
        url: "../../index.html",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />',
      },
      {
        label: "Transaksi Paket",
        page: "admin_paket",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />',
        url: "/dashboard/package-admin/index.html",
      },
      {
        label: "Riwayat Transaksi",
        url: "../../index.html",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />',
      },
      {
        label: "Laporan",
        url: "../../index.html",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
      },
      {
        label: "Kelola Pengguna",
        url: "../../index.html",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />',
      },
    ],

    // --- STATE CRUD ASSETS ---
    assetsList: [],
    isLoading: false,
    isModalOpen: false,
    isEditing: false,
    form: { id: null, name: "", buy_price: "", nilai_sisa: "", umur_ekonomis: "", buy_date: "" },

    init() {
      this.checkAuth();
      this.fetchAssets();
    },

    // --- AUTH & NAVIGATION ---
    checkAuth() {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        window.location.href = "../../../login.html"; // Naik 3 level
        return;
      }
      const user = JSON.parse(userStr);
      this.username = user.username || user.name;
      this.user_role = user.role || "user";

      // Security: Jika bukan admin, tendang keluar
      if (this.user_role !== "admin") {
        alert("Akses ditolak!");
        window.location.href = "../../index.html";
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../index.html";
    },

    // --- CRUD LOGIC (Sama seperti sebelumnya) ---
    async fetchAssets() {
      this.isLoading = true;
      try {
        // Simulasi data dummy jika API belum siap (HAPUS JIKA API SUDAH JALAN)
        // this.assetsList = [{id:1, name:'Mesin Cuci LG', buy_date:'2024-01-01', buy_price:5000000, nilai_sisa:1000000, umur_ekonomis:5}];

        const token = localStorage.getItem("token");
        const response = await fetch(this.apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.status) this.assetsList = result.data;
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async saveAsset() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      const url = this.isEditing ? `${this.apiUrl}/${this.form.id}` : this.apiUrl;
      const method = this.isEditing ? "PUT" : "POST";

      const cleanNumber = (val) => {
        if (!val) return 0;
        let strVal = String(val);

        // Jika ada koma (format 20.000,00), buang bagian belakang koma
        if (strVal.includes(",")) {
          strVal = strVal.split(",")[0];
        }

        // Ambil angkanya saja (buang titik, Rp, spasi)
        return Number(strVal.replace(/[^0-9]/g, ""));
      };
      // --- PERBAIKAN DISINI ---
      // Kita buat object baru (payload) untuk konversi tipe data
      const payload = {
        name: this.form.name,
        // Konversi string ke number
        buy_price: Number(this.form.buy_price),
        nilai_sisa: Number(this.form.nilai_sisa),
        umur_ekonomis: Number(this.form.umur_ekonomis),
        // Konversi tanggal string (YYYY-MM-DD) ke ISO-8601 DateTime
        buy_date: new Date(this.form.buy_date).toISOString(),
      };

      // Jika sedang edit, kita butuh ID (tapi biasanya ID tidak dikirim di body, tergantung backend)
      // jika backend butuh id di body, uncomment baris bawah:
      // if (this.isEditing) payload.id = this.form.id;

      try {
        const response = await fetch(url, {
          method: method,
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Kirim payload yang sudah dikonversi
        });

        const result = await response.json();

        if (result.status) {
          // Pastikan backend mengembalikan { status: true }
          alert("Berhasil disimpan!");
          this.closeModal();
          this.fetchAssets();
        } else {
          // Tampilkan pesan error detail dari backend jika ada
          alert("Gagal: " + (result.message || "Terjadi kesalahan"));
          console.error(result); // Cek console untuk debug
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan/server");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAsset(id) {
      if (!confirm("Hapus data ini?")) return;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) this.fetchAssets();
      } catch (error) {
        console.error(error);
      }
    },

    // --- HELPERS ---
    openModal() {
      this.resetForm();
      this.isEditing = false;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    resetForm() {
      this.form = { id: null, name: "", buy_price: "", nilai_sisa: "", umur_ekonomis: "", buy_date: new Date().toISOString().split("T")[0] };
    },
    editAsset(item) {
      this.isEditing = true;
      // Pastikan format tanggal benar untuk input type="date"
      this.form = { ...item, buy_date: item.buy_date ? item.buy_date.split("T")[0] : "" };
      this.isModalOpen = true;
    },
    formatRupiah(number) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    },
  }));
});
