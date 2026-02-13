# Deploy ke EasyPanel (Vite + React)

Project ini sudah disiapkan untuk deploy via Docker (`Dockerfile` + `nginx.conf`).

## 1. Buat Service baru di EasyPanel

1. Pilih `Create Service` -> `App`.
2. Source: repo Git project ini.
3. Branch: pilih branch yang ingin dideploy.

## 2. Build Configuration

1. Build type: `Dockerfile`.
2. Dockerfile path: `./Dockerfile`.
3. Tambahkan **Build Args**:
   - `VITE_SUPABASE_URL` = URL project Supabase kamu
   - `VITE_SUPABASE_ANON_KEY` = anon/publishable key Supabase kamu

Catatan: Vite membaca env saat **build time**, jadi wajib diisi sebagai build args.

## 3. Runtime Configuration

1. Port app: `80`.
2. Healthcheck (opsional): path `/`.
3. Domain: pasang domain kamu di menu domain EasyPanel.

## 4. Deploy

1. Klik `Deploy`.
2. Tunggu build selesai.
3. Buka domain service dan pastikan halaman tampil.

## 5. Jika ganti URL/key Supabase

Karena nilainya di-embed saat build, lakukan:
1. Update Build Args di EasyPanel.
2. Trigger `Redeploy` (full rebuild), bukan restart container saja.
