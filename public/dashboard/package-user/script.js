document.addEventListener("alpine:init", () => {
  Alpine.data("dashboardPage", () => ({
    // --- STATE UTAMA ---
    username: "Guest",
    user_role: "guest",
    currentPage: "dashboard",
    isSidebarOpen: false,

    // State Submenu Sidebar
    submenu: {
      admin: false,
      master: false,
      user: false,
    },

    // --- STATE TRANSAKSI PAKET (BARU) ---
    isLoadingPackages: false,
    isProcessing: false,
    packageList: [],
    selectedPackage: null,
    isModalOpen: false,

    // --- MENU DATA CONFIGURATION ---

    // Menu User: Pemesanan
    userPesananMenu: [
      { label: "Buat Pesanan Baru", page: "buat_pesanan" },
      { label: "Status Pesanan", page: "status_pesanan" },
      { label: "Riwayat Pesanan", page: "riwayat_pesanan" },
    ],

    // Menu User: Transaksi (BARU)
    userTransactionMenu: [
      {
        label: "Beli Paket",
        page: "user_transaksi_paket",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />',
      },
    ],

    // Menu Admin
    adminPesananMenu: [
      { label: "Pesanan Baru", page: "admin_pesanan_baru" },
      { label: "Dalam Proses", page: "admin_pesanan_proses" },
      { label: "Pesanan Selesai", page: "admin_pesanan_selesai" },
    ],

    adminMasterMenu: [
      { label: "Assets", page: "admin_assets", url: "/dashboard/master-data/assets/index.html" },
      { label: "Expense", page: "admin_expense", url: "/dashboard/master-data/expenses/index.html" },
      { label: "Package", page: "admin_package", url: "/dashboard/master-data/packages/index.html" },
      { label: "Service", page: "admin_service", url: "/dashboard/master-data/services/index.html" },
    ],

    adminStaticMenu: [
      { label: "Layanan & Harga", page: "admin_layanan", icon: "..." }, // Icon disingkat agar rapi
      { label: "Riwayat Transaksi", page: "admin_riwayat", icon: "..." },
      { label: "Laporan", page: "admin_laporan", icon: "..." },
      { label: "Kelola Pengguna", page: "kelola_pengguna", icon: "..." },
    ],

    // --- LIFECYCLE ---
    init() {
      this.checkAuth();

      console.log("Role saat ini:", this.user_role);
      console.log("Menu Transaksi:", this.userTransactionMenu);

      // Watcher: Jika pindah ke halaman paket, ambil datanya
      this.$watch("currentPage", (value) => {
        if (value === "user_transaksi_paket") {
          this.fetchPackages();
        }
      });

      // Auto open submenu logic
      if (this.user_role === "user" && this.isUserPesananActive) this.submenu.user = true;
      if (this.user_role === "admin" && this.isAdminPesananActive) this.submenu.admin = true;
    },

    // --- COMPUTED ---
    get isUserPesananActive() {
      return this.userPesananMenu.some((i) => i.page === this.currentPage);
    },
    get isAdminPesananActive() {
      return this.adminPesananMenu.some((i) => i.page === this.currentPage);
    },
    get isMasterDataActive() {
      return this.adminMasterMenu.some((i) => i.page === this.currentPage);
    },

    // --- METHODS AUTH ---
    checkAuth() {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        this.logout();
        return;
      }

      const payload = this.parseJwt(token);
      if (!payload || payload.exp * 1000 < Date.now()) {
        this.logout();
        return;
      }

      const user = JSON.parse(userStr);
      this.username = user.username || user.name || "Pelanggan";
      this.user_role = user.role || "user";
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../index.html";
    },

    parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(
          decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          )
        );
      } catch (e) {
        return null;
      }
    },

    // --- METHODS TRANSAKSI PAKET (LOGIC DISATUKAN) ---
    async fetchPackages() {
      this.isLoadingPackages = true;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/user-package", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.status) this.packageList = result.data;
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        this.isLoadingPackages = false;
      }
    },

    openPackageModal(pkg) {
      this.selectedPackage = pkg;
      this.isModalOpen = true;
    },

    async processTransaction() {
      if (!this.selectedPackage) return;
      this.isProcessing = true;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/user-package", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ package_id: this.selectedPackage.id }),
        });
        const result = await response.json();

        if (result.status) {
          alert("Pembelian Berhasil!");
          this.isModalOpen = false;
          // Redirect ke riwayat atau refresh jika perlu
        } else {
          alert("Gagal: " + result.message);
        }
      } catch (error) {
        alert("Terjadi kesalahan jaringan.");
      } finally {
        this.isProcessing = false;
      }
    },

    formatRupiah(number) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
    },
  }));
});
