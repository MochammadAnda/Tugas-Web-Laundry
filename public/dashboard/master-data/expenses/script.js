document.addEventListener("alpine:init", () => {
  Alpine.data("expensePage", () => ({
    // --- CONFIG ---
    // Sesuaikan URL ini dengan backend kamu (Port 8000 sesuai request API sebelumnya)
    apiUrl: "http://localhost:3000/api/master/expense",

    // --- STATE USER & SIDEBAR ---
    username: "Admin",
    user_role: "admin",
    isSidebarOpen: false,

    // State Submenu
    submenu: {
      admin: false,
      master: true, // Default terbuka
      user: false,
    },

    // --- MENU DATA ---
    // URL disesuaikan agar navigasi antar folder berjalan lancar
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
      { label: "Assets", url: "/dashboard/master-data/assets/index.html", active: false },
      { label: "Expense", url: "#", active: true }, // Halaman ini (Aktif)
      { label: "Package", url: "/dashboard/master-data/packages/index.html", active: false },
      { label: "Service", url: "/dashboard/master-data/services/index.html", active: false },
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

    // --- STATE CRUD EXPENSE ---
    expensesList: [],
    isLoading: false,
    isModalOpen: false,
    isEditing: false,
    // Form field sesuai API Expense
    form: {
      id: null,
      name: "",
      category: "OPERATIONAL",
      amount: "",
      due_date: "",
    },

    init() {
      this.checkAuth();
      this.fetchExpenses();
    },

    // --- AUTH & NAVIGATION ---
    checkAuth() {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        window.location.href = "../../../login.html";
        return;
      }
      const user = JSON.parse(userStr);
      this.username = user.username || user.name;
      this.user_role = user.role || "user";

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

    // --- CRUD LOGIC ---
    async fetchExpenses() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(this.apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.status) this.expensesList = result.data;
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async saveExpense() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      const url = this.isEditing ? `${this.apiUrl}/${this.form.id}` : this.apiUrl;
      const method = this.isEditing ? "PUT" : "POST";

      const payload = {
        name: this.form.name,
        category: this.form.category,
        amount: Number(this.form.amount),
        due_date: new Date(this.form.due_date).toISOString(),
      };

      try {
        const response = await fetch(url, {
          method: method,
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.status) {
          alert(this.isEditing ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!");
          this.closeModal();
          this.fetchExpenses();
        } else {
          alert("Gagal: " + (result.message || "Terjadi kesalahan"));
        }
      } catch (error) {
        console.error("Error saving:", error);
        alert("Terjadi kesalahan jaringan/server");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteExpense(id) {
      if (!confirm("Hapus data pengeluaran ini?")) return;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) this.fetchExpenses();
      } catch (error) {
        console.error(error);
      }
    },

    // --- FITUR KHUSUS: SET DONE ---
    async markAsDone(id) {
      if (!confirm("Apakah yakin ingin mengubah status menjadi DONE?")) return;

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${this.apiUrl}/${id}/done`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.status) {
          alert(result.message);
          this.fetchExpenses();
        } else {
          alert("Gagal update status: " + result.message);
        }
      } catch (error) {
        console.error("Error setting done:", error);
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
      this.form = {
        id: null,
        name: "",
        category: "OPERATIONAL",
        amount: "",
        due_date: new Date().toISOString().split("T")[0],
      };
    },
    editExpense(item) {
      this.isEditing = true;
      this.form = {
        id: item.id,
        name: item.name,
        category: item.category,
        amount: item.amount,
        due_date: item.due_date ? item.due_date.split("T")[0] : "",
      };
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
