import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "../helpers/response.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse(res, "Email atau password salah", 401);
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return errorResponse(res, "Email atau password salah", 401);
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Response
    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          telepon: user.telepon,
          alamat: user.alamat,
        },
      },
      "Login berhasil"
    );

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error");
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, telepon, alamat } = req.body;

    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return errorResponse(res, "Email sudah terdaftar", 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru (role = "user")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: "user",
        telepon,
        alamat,
      },
    });

    return successResponse(res, {
      id: user.id,
      nama: user.nama,
      email: user.email,
    }, "User berhasil didaftarkan", 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error");
  }
};
