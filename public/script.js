document.addEventListener("alpine:init", () => {
  Alpine.data("landingPage", () => ({
    // --- STATE ---
    isLoggedIn: false,
    userName: "Guest",
    notificationCount: 0,
    flashMessage: "",
    isMobileMenuOpen: false,
    currentTime: "",
    currentTimeShort: "",
    storeStatus: { isOpen: false, text: "TUTUP" },
    typewriterText: "",

    // State Internal untuk Typewriter
    phrases: ["Kami Jemput Gratis!", "Wangi Tahan Lama.", "Rapi Seperti Baru.", "Express 6 Jam Selesai."],
    phraseIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typeTimeout: null,

    // --- LIFECYCLE (Mirip onMounted) ---
    init() {
      this.checkAuth();
      this.startClock();
      this.startTypewriter();
      this.startBubbles();
    },

    // --- AUTH CHECKER ---
    checkAuth() {
      // Cek apakah ada token di LocalStorage (dari Login sebelumnya)
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        this.isLoggedIn = true;
        const user = JSON.parse(userStr);
        this.userName = user.username || user.name || "Pelanggan"; // Sesuaikan dengan format JSON user kamu

        // Simulasi notifikasi (bisa diganti fetch ke API backend nanti)
        this.notificationCount = 2;
      }
    },

    logout() {
      // Hapus data login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      this.isLoggedIn = false;
      this.userName = "Guest";
      this.flashMessage = "Anda berhasil logout.";

      // Hilangkan pesan setelah 3 detik
      setTimeout(() => {
        this.flashMessage = "";
        window.location.reload(); // Refresh halaman agar state bersih
      }, 1500);
    },

    // --- COMPUTED (Dibuat sebagai Getter) ---
    get greetingText() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) return "Selamat Pagi,";
      if (hour >= 11 && hour < 15) return "Selamat Siang,";
      if (hour >= 15 && hour < 18) return "Selamat Sore,";
      return "Selamat Malam,";
    },

    // --- CLOCK LOGIC ---
    startClock() {
      const update = () => {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString("id-ID", { hour12: false });
        this.currentTimeShort = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

        const hour = now.getHours();
        const isOpen = hour >= 8 && hour < 20;
        this.storeStatus = isOpen ? { isOpen: true, text: "BUKA" } : { isOpen: false, text: "TUTUP" };
      };
      update();
      setInterval(update, 1000);
    },

    // --- TYPEWRITER LOGIC ---
    startTypewriter() {
      const type = () => {
        const currentPhrase = this.phrases[this.phraseIndex];
        let typeSpeed = 100;

        if (this.isDeleting) {
          this.typewriterText = currentPhrase.substring(0, this.charIndex - 1);
          this.charIndex--;
          typeSpeed = 50;
        } else {
          this.typewriterText = currentPhrase.substring(0, this.charIndex + 1);
          this.charIndex++;
        }

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
          this.isDeleting = true;
          typeSpeed = 2000; // Tunggu sebelum hapus
        } else if (this.isDeleting && this.charIndex === 0) {
          this.isDeleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
          typeSpeed = 500;
        }

        this.typeTimeout = setTimeout(type, typeSpeed);
      };
      type();
    },

    // --- BUBBLE ANIMATION ---
    startBubbles() {
      // Akses element menggunakan $refs (karena kita pakai x-ref="bubbleContainer")
      const container = this.$refs.bubbleContainer;

      setInterval(() => {
        if (!container) return;

        const bubble = document.createElement("div");
        bubble.classList.add("bubble");

        // Random size & position
        const size = Math.random() * 40 + 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 5 + 5;
        bubble.style.animationDuration = `${duration}s`;

        container.appendChild(bubble);

        // Hapus element setelah animasi selesai
        setTimeout(() => {
          bubble.remove();
        }, duration * 1000);
      }, 600);
    },
  }));
});
