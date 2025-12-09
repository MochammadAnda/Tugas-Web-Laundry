document.addEventListener("alpine:init", () => {
  Alpine.data("registerAuth", () => ({
    // State Data
    isLoading: false,
    errorMessage: "",
    form: {
      name: "", // Sesuai prisma: name
      email: "",
      password: "",
      phone: "", // Sesuai prisma: phone
      address: "", // Sesuai prisma: address
    },

    // Logic Submit
    async submitRegister() {
      this.isLoading = true;
      console.log("Data yang akan dikirim:", JSON.stringify(this.form));
      this.errorMessage = "";

      try {
        // Melakukan request ke Backend Express
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Mengirim data form sebagai JSON
          body: JSON.stringify(this.form),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mendaftar");
        }

        // Jika sukses, alert dan redirect ke halaman login (index.html di folder auth)
        alert("Registrasi berhasil! Silakan login.");
        window.location.href = "login.html";
      } catch (err) {
        // Menampilkan error di HTML
        this.errorMessage = err.message;
      } finally {
        this.isLoading = false;
      }
    },
  }));

  Alpine.data("authLogin", () => ({
    // State
    isLoading: false,
    errorMessage: "",
    successMessage: "",
    form: {
      email: "",
      password: "",
    },

    // Lifecycle: Cek jika user sudah login saat halaman dibuka
    init() {
      const token = localStorage.getItem("token");
      if (token) {
        // Jika token ada, lempar ke dashboard
        window.location.href = "../dashboard/index.html"; // Ganti sesuai halaman dashboard kamu
      }
    },

    // Logic Submit Login
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        // Request ke Backend Express (Port 3000)
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Email atau password salah");
        }

        // --- LOGIN SUKSES ---
        this.successMessage = "Login berhasil! Mengalihkan...";

        // 1. Simpan Token & User ke LocalStorage (sesuai return backend kamu)
        // 1. Mengambil token dari result.data.token
        localStorage.setItem("token", result.data.token);

        // 2. Mengambil user dari result.data.user
        let userData = result.data.user;

        // 3. Ubah ROLE jadi huruf kecil ("USER" -> "user") agar cocok dengan logika dashboard
        if (userData.role) {
          userData.role = userData.role.toLowerCase();
        }

        // Simpan user yang sudah diubah ke localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // 2. Redirect ke Dashboard setelah jeda singkat
        setTimeout(() => {
          // Pastikan folder '/dashboard/index.html' sudah ada
          window.location.href = "../dashboard/index.html";
        }, 1000);
      } catch (err) {
        this.errorMessage = err.message;
      } finally {
        this.isLoading = false;
      }
    },
  }));
});
