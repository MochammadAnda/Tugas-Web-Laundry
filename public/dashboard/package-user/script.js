document.addEventListener("alpine:init", () => {
  Alpine.data("packageUserPage", () => ({
    // --- CONFIG ---
    // Endpoint untuk mengambil daftar paket
    apiPackageUrl: "http://localhost:3000/api/user-package",
    // Endpoint untuk transaksi pembelian paket (sesuai request user)
    apiTransactionUrl: "http://localhost:3000/api/transaction/package",
    apiGetPackage: "http://localhost:3000/api/user-package/get-package",
    apiGetTrxPending: "http://localhost:3000/api/user-package/get-trx-pending",


    pendingTransactions: [],

    // --- STATE ---
    username: "User",
    user_role: "user",
    isSidebarOpen: false,
    isLoading: false,
    isProcessing: false,

    // Data
    packages: [],
    selectedPackage: null,
    isModalOpen: false,

    // State Submenu (Untuk Sidebar agar konsisten)
    submenu: {
      user: true, // Menu user default terbuka di halaman ini
    },

    init() {
      this.checkAuth();
      this.fetchPackages();
      this.fetchPendingTransactions();
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
        this.username = user.username || user.name || "User";
        this.user_role = user.role || "user";

        // Security: Jika Admin masuk ke sini, tendang keluar
        if (this.user_role === "admin") {
          alert("Halaman ini khusus Member.");
          window.location.href = "../../index.html";
        }
      } catch (e) {
        console.error("Auth Error", e);
        this.logout();
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../../index.html";
    },

    async fetchPendingTransactions() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(this.apiGetTrxPending, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (result.status) {
          this.pendingTransactions = result.data;
        } else {
          this.pendingTransactions = [];
          console.error("Gagal mengambil trx pending:", result.message);
        }
      } catch (error) {
        console.error("Error network:", error);
        alert("Gagal terhubung ke server.");
      }
    },


    // --- DATA FETCHING ---
    async fetchPackages() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(this.apiPackageUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        if (result.status) {
          this.packages = result.data.userPackages;
        } else {
          this.packages = [];
          console.error("Gagal mengambil data paket:", result.message);
        }
      } catch (error) {
        console.error("Error network:", error);
        alert("Gagal terhubung ke server.");
      } finally {
        this.isLoading = false;
      }
    },

    // --- TRANSAKSI (STORE) ---
    openConfirmModal(pkg) {
      this.selectedPackage = pkg;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedPackage = null;
    },

    async processTransaction() {
      if (!this.selectedPackage) return;

      this.isProcessing = true;
      const token = localStorage.getItem("token");

      // Payload sesuai dokumentasi API yang Anda berikan (hanya butuh ID Paket biasanya, backend handle sisanya)
      const payload = {
        package_id: this.selectedPackage.id,
      };

      try {
        const response = await fetch(this.apiTransactionUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Sesuai respon sukses: { status: true, message: "Success store data", data: {...} }
        if (result.status) {
          alert("Transaksi Berhasil! Silakan lakukan pembayaran.");
          console.log("Transaksi Created:", result.data);
          this.closeModal();
          // Opsional: Redirect ke halaman riwayat
          // window.location.href = "../history/index.html";
        } else {
          alert("Gagal transaksi: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Transaction error:", error);
        alert("Terjadi kesalahan jaringan.");
      } finally {
        this.isProcessing = false;
      }
    },

    // --- HELPER ---
    formatRupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },
  }));

  Alpine.data("purchaseForm", () => ({
    packageList: [],
    selectedId: "",
    price: "",

    apiGetPackage: "http://localhost:3000/api/user-package/get-package",
    apiStorePackage: "http://localhost:3000/api/user-package",

    init() {
      this.fetchPackageList();
    },

    async fetchPackageList() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(this.apiGetPackage, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (result.status) {
          this.packageList = result.data;
        } else {
          alert("Gagal mengambil data paket.");
        }
      } catch (err) {
        console.error(err);
        alert("Gagal terhubung ke server.");
      }
    },

    updatePrice() {
      const selected = this.packageList.find((p) => p.id == this.selectedId);
      this.price = selected ? selected.price : "";
    },

    async buyPackage() {
      if (!this.selectedId) {
        alert("Silakan pilih paket terlebih dahulu.");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(this.apiStorePackage, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package_id: Number(this.selectedId)
          }),
        });

        const result = await response.json();

        if (response.status === 200 || result.status === true) {
          alert("Pembelian paket berhasil!");
          window.location.reload();
        } else {
          alert("Gagal membeli paket: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat membeli paket.");
      }
    }
  }));
});
