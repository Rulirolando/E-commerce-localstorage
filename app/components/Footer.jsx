export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-5">
        {/* Grid utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">MyShop</h2>
            <p className="text-sm">
              Marketplace sederhana untuk membeli dan menjual produk.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Kategori</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Elektronik</li>
              <li className="hover:text-white cursor-pointer">Fashion</li>
              <li className="hover:text-white cursor-pointer">
                Handphone & Aksesoris
              </li>
              <li className="hover:text-white cursor-pointer">Olahraga</li>
              <li className="hover:text-white cursor-pointer">Lainnya</li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Bantuan</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Cara Belanja</li>
              <li className="hover:text-white cursor-pointer">Pembayaran</li>
              <li className="hover:text-white cursor-pointer">Pengiriman</li>
              <li className="hover:text-white cursor-pointer">
                Customer Service
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Kontak Kami
            </h3>
            <ul className="text-sm space-y-2">
              <li>Email: rulirolandobaan@gmail.com</li>
              <li>WhatsApp: 0856-9664-6980</li>
              <li>Alamat: Palu, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm">
          © {new Date().getFullYear()} MyShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
