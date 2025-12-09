document.addEventListener("alpine:init", () => {
  Alpine.data("packageAdminPage", () => ({
    // --- CONFIG ---
    // Endpoint untuk mengambil list transaksi paket (GET)
    apiListUrl: "http://localhost:3000/api/admin-package",

    // Endpoint untuk update status (POST ke /set-status)
    apiUpdateUrl: "http://localhost:3000/api/admin-package/set-status",

    // --- STATE ---
    username: "Admin",
    user_role: "admin",
    isSidebarOpen: false,
    isLoading: false,

    // Data List
    transactions: [],

    // State Submenu Sidebar
    submenu: {
      admin: true,
      master: false,
    },

    init() {
      this.checkAuth();
      this.fetchTransactions();
    },

    // --- AUTH ---
    checkAuth() {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        window.location.href = "../../index.html";
        return;
      }
      try {
        const user = JSON.parse(userStr);
        this.username = user.username || user.name || "Admin";
        this.user_role = user.role;

        if (this.user_role !== "admin") {
          alert("Akses Ditolak. Halaman ini khusus Admin.");
          window.location.href = "../../index.html";
        }
      } catch (e) {
        this.logout();
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../../index.html";
    },

    // --- FETCH DATA ---
    async fetchTransactions() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(this.apiListUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        if (result.status) {
          this.transactions = result.data;
        } else {
          this.transactions = [];
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // --- UPDATE STATUS (PERBAIKAN UTAMA DISINI) ---
    async updateStatus(id, newStatus) {
      const actionText = newStatus === "SUCCESS" ? "menyetujui" : "menolak";
      if (!confirm(`Apakah Anda yakin ingin ${actionText} transaksi ini?`)) return;

      const token = localStorage.getItem("token");

      // Payload sesuai Postman Request Anda:
      // { "transaction_id": 1, "status": "SUCCESS" }
      const payload = {
        transaction_id: id,
        status: newStatus,
      };

      try {
        // Method POST ke .../set-status
        const response = await fetch(this.apiUpdateUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.status) {
          alert(`Transaksi berhasil di-update menjadi ${newStatus}`);
          this.fetchTransactions(); // Refresh data
        } else {
          alert("Gagal update: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Update error:", error);
        alert("Terjadi kesalahan jaringan.");
      }
    },

    // --- HELPERS ---
    formatRupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    },
  }));
});
