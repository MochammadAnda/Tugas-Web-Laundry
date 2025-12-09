document.addEventListener("alpine:init", () => {
  Alpine.data("orderPage", () => ({
    // --- CONFIG ---
    apiServiceUrl: "http://localhost:3000/api/master/service", // Get List Layanan
    apiUserPackageUrl: "http://localhost:3000/api/user-package", // Get Paket yg dimiliki User
    apiTransactionUrl: "http://localhost:3000/api/user-order", // Post Order

    // --- STATE ---
    username: "User",
    user_role: "user",
    isSidebarOpen: false,
    isLoading: false,
    isProcessing: false,

    // Data Lists
    services: [],
    myPackages: [],

    // Form Data
    form: {
      service_id: "",
      qty: "",
      payment_method: "cash", // 'cash' atau 'package'
      user_package_id: "", // Diisi jika payment_method = 'package'
    },

    // Sidebar Configuration
    submenu: { user: true }, // Menu user terbuka

    init() {
      this.checkAuth();
      this.fetchServices();
      this.fetchMyPackages();
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
        this.username = user.username || user.name || "Member";
        this.user_role = user.role;
        if (this.user_role === "admin") window.location.href = "../../admin/index.html";
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
    async fetchServices() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(this.apiServiceUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.status) this.services = result.data;
      } catch (error) {
        console.error("Error services", error);
      }
    },

    async fetchMyPackages() {
      const token = localStorage.getItem("token");
      try {
        // Mengambil daftar paket yang SUDAH DIBELI oleh user
        const response = await fetch(this.apiUserPackageUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        // Asumsi: result.data mengembalikan array paket milik user
        if (result.status) {
          // Cek struktur: apakah result.data array? atau result.data.userPackages?
          // Menggunakan fallback aman:
          this.myPackages = Array.isArray(result.data) ? result.data : result.data.userPackages || [];
        }
      } catch (error) {
        console.error("Error user packages", error);
      }
    },

    // --- SUBMIT ORDER ---
    async submitOrder() {
      // Validasi Input
      if (!this.form.service_id || !this.form.qty) {
        alert("Harap lengkapi layanan dan jumlah laundry.");
        return;
      }

      // Validasi Khusus Paket
      if (this.form.payment_method === "package" && !this.form.user_package_id) {
        alert("Harap pilih paket kuota yang ingin digunakan.");
        return;
      }

      this.isProcessing = true;
      const token = localStorage.getItem("token");

      // Persiapan Payload
      const payload = {
        type: "ORDER",
        service_id: parseInt(this.form.service_id),
        qty: parseFloat(this.form.qty),
      };

      // Jika pakai paket, tambahkan user_package_id agar backend memotong kuota
      if (this.form.payment_method === "package") {
        payload.user_package_id = parseInt(this.form.user_package_id);
      }

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

        if (result.status) {
          const data = result.data;

          // SKENARIO 1: Potong Kuota (Status SUCCESS)
          if (data.status === "SUCCESS" && parseInt(data.total_price) === 0) {
            alert(`✅ Order Berhasil!\nKuota paket telah dikurangi.\nID Order: ${data.id}`);
          }
          // SKENARIO 2: Bayar Normal (Status PENDING)
          else {
            const harga = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(data.total_price);
            alert(`📝 Order Dibuat (Pending)\nSilakan lakukan pembayaran sebesar: ${harga}\nID Order: ${data.id}`);
          }

          // Reset Form
          this.form = { service_id: "", qty: "", payment_method: "cash", user_package_id: "" };
          // Opsional: Redirect ke riwayat
          // window.location.href = "../history/index.html";
        } else {
          alert("Gagal: " + (result.message || "Kesalahan sistem"));
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan jaringan.");
      } finally {
        this.isProcessing = false;
      }
    },

    // Helper untuk menampilkan detail paket di dropdown
    getPackageName(pkg) {
      // Sesuaikan properti ini dengan response API user-package Anda
      // Misal: pkg.package.name atau pkg.name
      return pkg.name || pkg.package?.name || "Paket Laundry";
    },

    getPackageQuota(pkg) {
      return pkg.remaining_quota || pkg.quota || 0;
    },
  }));
});
