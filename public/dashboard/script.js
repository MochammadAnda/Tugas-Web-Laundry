document.addEventListener("alpine:init", () => {
  Alpine.data("dashboardPage", () => ({
    // --- STATE ---
    username: "Guest",
    user_role: "guest", // 'admin' atau 'user'
    currentPage: "dashboard",
    isSidebarOpen: false,

    // State Submenu Sidebar
    submenu: {
      admin: false,
      master: false,
      user: false,
    },

    // --- MENU DATA CONFIGURATION ---
    userPesananMenu: [
      { label: "Buat Pesanan Baru", page: "buat_pesanan" },
      { label: "Status Pesanan", page: "status_pesanan" },
      { label: "Riwayat Pesanan", page: "riwayat_pesanan" },
    ],

    userTransactionMenu: [
      {
        label: "Beli Paket",
        page: "user_transaksi_paket",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />',
        url: "/dashboard/package-user/index.html",
      },
      {
        label: "Order Laundry",
        page: "user_order_laundry",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-14 7h14"/>',
        url: "/dashboard/order-user/index.html",
      },
    ],

    adminPesananMenu: [
      { label: "Pesanan Baru", page: "admin_pesanan_baru" },
      { label: "Dalam Proses", page: "admin_pesanan_proses" },
      { label: "Pesanan Selesai", page: "admin_pesanan_selesai" },
    ],

    // [BARU] Menu Admin: Master Data
    adminMasterMenu: [
      {
        label: "Assets",
        page: "admin_assets",
        url: "/dashboard/master-data/assets/index.html", // TAMBAHKAN INI (Path ke file baru)
      },
      //   { label: "Assets", page: "admin_assets", url: "/master-data/assets/" },
      { label: "Expense", page: "admin_expense", url: "/dashboard/master-data/expenses/index.html" },
      { label: "Package", page: "admin_package", url: "/dashboard/master-data/packages/index.html" },
      { label: "Service", page: "admin_service", url: "/dashboard/master-data/services/index.html" },
    ],

    adminStaticMenu: [
      {
        label: "Layanan & Harga",
        page: "admin_layanan",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />',
      },
      {
        label: "Riwayat Transaksi",
        page: "admin_riwayat",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />',
      },
      {
        label: "Laporan",
        page: "admin_laporan",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
      },
      {
        label: "Kelola Pengguna",
        page: "kelola_pengguna",
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />',
      },
    ],

    // --- LIFECYCLE ---
    init() {
      this.checkAuth();

      // Auto open submenu jika current page ada di dalam sub-menu
      if (this.user_role === "user" && this.isUserPesananActive) {
        this.submenu.user = true;
      }
      if (this.user_role === "admin" && this.isAdminPesananActive) {
        this.submenu.admin = true;
      }
    },

    // --- COMPUTED (Dibuat sebagai Getter) ---
    get isUserPesananActive() {
      return this.userPesananMenu.some((i) => i.page === this.currentPage);
    },

    get isAdminPesananActive() {
      return this.adminPesananMenu.some((i) => i.page === this.currentPage);
    },

    get isMasterDataActive() {
      return this.adminMasterMenu.some((i) => i.page === this.currentPage);
    },

    // --- METHODS ---
    checkAuth() {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // DEBUGGING: Cek apa isi storage
      console.log("Token:", token);
      console.log("User:", userStr);

      if (!token || !userStr) {
        console.log("Data kosong, melakukan logout..."); // Debug
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

      // Mengambil role dari localStorage (pastikan saat login role disimpan)
      // Jika tidak ada, default ke 'user' demi keamanan
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
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    },
  }));
});
