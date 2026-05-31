/**
 * Global Sound Effects Helper untuk Bogeng Coffee POS
 * Menggunakan URL audio open-source gratis yang ringan dan responsif
 */

const sounds = {
  // 1. Suara pas klik menu / nambah item ke keranjang (Suara klik premium digital)
  addToCart: "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav",
  
  // 2. Suara pas hapus item dari keranjang (Suara soft swoosh/click)
  deleteItem: "https://assets.mixkit.co/active_storage/sfx/2560/2560-84.wav",
  
  // 3. Suara pas sukses bayar / checkout / rekap excel (Suara mesin kasir kuno "Ching!")
  checkoutSuccess: "https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav",
  
  // 4. Suara eror atau peringatan modal (Suara bleep pendek)
  error: "https://assets.mixkit.co/active_storage/sfx/922/922-84.wav"
};

export const playSound = (type) => {
  try {
    if (sounds[type]) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.4; // Set volume 40% biar gak ngagetin pelanggan di kedai
      audio.play();
    }
  } catch (error) {
    console.log("Browser memblokir pemutaran audio otomatis:", error);
  }
};