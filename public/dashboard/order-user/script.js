document.addEventListener("alpine:init", () => {
  Alpine.data("orderPage", () => ({
    // ==========================
    // API ENDPOINT
    // ==========================
    apiGetService: "http://localhost:3000/api/user-order/get-service",
    apiGetPackage: "http://localhost:3000/api/user-order/get-user-package",
    apiCreateOrder: "http://localhost:3000/api/user-order",
    apiGetMyOrders: "http://localhost:3000/api/user-order",


    // ==========================
    // AUTH STATE
    // ==========================
    token: null,
    user: null,
    username: "Guest",
    user_role: "user",

    myOrders: [],
    isLogModalOpen: false,
    logOrderId: null,
    orderLogs: [],


    // ==========================
    // DATA & FORM
    // ==========================
    services: [],
    myPackages: [],
    isProcessing: false,

    totalPrice: 0,
    selectedServicePrice: 0,
    trxPending: [],
    apiGetPending: "http://localhost:3000/api/user-order/get-trx-pending",



    form: {
      service_id: "",
      quantity_kg: "",
      delivery_method: "PICKUP_DROP",
      address: "",
      payment_method: "cash",
      user_package_id: "",
    },

    // ==========================
    // INIT
    // ==========================
    init() {
      this.checkAuth();
      this.fetchServices();
      this.fetchMyOrders();
      this.fetchPendingTrx();
    },

    // ==========================
    // AUTH CHECK
    // ==========================
    checkAuth() {
      this.token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!this.token || !userStr) {
        this.logout();
        return;
      }

      // Decode JWT
      const payload = this.parseJwt(this.token);
      if (!payload || payload.exp * 1000 < Date.now()) {
        this.logout();
        return;
      }

      // Simpan user
      this.user = JSON.parse(userStr);
      this.username = this.user.username || this.user.name || "User";
      this.user_role = this.user.role || "user";
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
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (err) {
        return null;
      }
    },

    // ==========================
    // GET SERVICES
    // ==========================
    async fetchServices() {
      try {
        const res = await fetch(this.apiGetService, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        const json = await res.json();
        if (json.status) this.services = json.data;
      } catch (err) {
        console.error("ERR SERVICE:", err);
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
    // ==========================
    // GET PACKAGES
    // ==========================
    async fetchUserPackages() {
      const qty = this.form.quantity_kg;
      if (!qty) return;

      try {
        const res = await fetch(`${this.apiGetPackage}/${qty}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        const json = await res.json();
        this.myPackages = json.status ? json.data : [];
      } catch (err) {
        console.error("ERR PACKAGE:", err);
      }
    },

    async fetchMyOrders() {
      try {
        const res = await fetch(this.apiGetMyOrders, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const json = await res.json();
        if (json.status) {
          this.myOrders = json.data.orders || [];
        }
      } catch (err) {
        console.error("ERR FETCH MY ORDERS:", err);
      }
    },

    async viewLog(orderId) {
      this.isLogModalOpen = true;
      this.logOrderId = orderId;
      this.orderLogs = [];

      try {
        const res = await fetch(`http://localhost:3000/api/user-order/${orderId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const json = await res.json();
        if (json.status) {
          this.orderLogs = json.data.orderLogs || [];
        }
      } catch (err) {
        console.error("ERR FETCH ORDER LOG:", err);
        alert("Gagal mengambil log order.");
      }
    },

    watchQuantity() {
      if (this.form.payment_method === "package") {
        this.fetchUserPackages();
      }
    },

    watchPayment() {
      if (this.form.payment_method === "package" && this.form.quantity_kg) {
        this.fetchUserPackages();
      }
    },
    updatePrice() {
      const svc = this.services.find(s => s.id == this.form.service_id);
      if (!svc) {
        this.selectedServicePrice = 0;
        this.totalPrice = 0;
        return;
      }

      this.selectedServicePrice = Number(svc.price_per_unit);
      this.totalPrice = this.selectedServicePrice * Number(this.form.quantity_kg || 0);
    },

    async fetchPendingTrx() {
      try {
        const res = await fetch(this.apiGetPending, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        const json = await res.json();
        this.trxPending = json.status ? json.data : [];
      } catch (err) {
        console.error("ERR PENDING:", err);
      }
    },

    // ==========================
    // SUBMIT ORDER
    // ==========================
    async submitOrder() {
      if (!this.form.service_id || !this.form.quantity_kg) {
        alert("Harap lengkapi layanan & jumlah.");
        return;
      }

      if (this.form.payment_method === "package" && !this.form.user_package_id) {
        alert("Harap pilih paket kuota.");
        return;
      }

      let payload = {
        service_id: Number(this.form.service_id),
        quantity_kg: Number(this.form.quantity_kg),
        delivery_method: this.form.delivery_method,
        address: this.form.address,
      };

      if (this.form.payment_method === "package") {
        payload.user_package_id = Number(this.form.user_package_id);
      }

      this.isProcessing = true;

      try {
        const res = await fetch(this.apiCreateOrder, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (json.status) {
          alert("Pesanan berhasil dibuat!");
          window.location.reload();
        } else {
          alert(json.message || "Gagal membuat order");
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan jaringan.");
      }

      this.isProcessing = false;
    },

    getPackageName(pkg) {
      return `Paket ID ${pkg.package_id || pkg.id}`;
    },

    getPackageQuota(pkg) {
      return pkg.quota;
    },
  }));
});
