import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg"
  ];

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
      
      {/* Header Transparente */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
         <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light/80 dark:bg-black/40 backdrop-blur-md text-stone-900 dark:text-white border border-stone-200 dark:border-white/10"
        >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light/80 dark:bg-black/40 backdrop-blur-md text-stone-900 dark:text-white border border-stone-200 dark:border-white/10">
            <span className="material-symbols-outlined text-[22px]">favorite_border</span>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="relative w-full aspect-[3/4] bg-stone-100 dark:bg-[#101010]">
        <img 
            src={images[selectedImage]} 
            alt="Product Detail" 
            className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${selectedImage === idx ? 'bg-primary w-4' : 'bg-white/50'}`}
                />
            ))}
        </div>
      </div>

      <div className="flex flex-col px-6 pt-8 gap-6">
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-display text-stone-900 dark:text-white leading-tight">Colar Akoya Classic</h1>
                <span className="text-xl font-bold text-primary">R$ 4.500</span>
            </div>
            <p className="text-sm font-serif italic text-stone-500">Pérolas Cultivadas 7mm • Ouro 18k</p>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
            A quintessência da elegância. Nossas pérolas Akoya são selecionadas manualmente por seu lustre espelhado e formato perfeitamente redondo. O fecho em ouro 18k adiciona um toque final de luxo discreto.
        </p>

        <div className="h-px w-full bg-stone-200 dark:bg-white/10 my-2"></div>

        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">Comprimento</span>
                <span className="text-xs font-serif italic text-stone-500">Guia de Tamanhos</span>
            </div>
            <div className="flex gap-3">
                <button className="flex-1 py-2 border border-primary text-primary text-xs font-bold rounded-sm">40cm</button>
                <button className="flex-1 py-2 border border-stone-300 dark:border-white/20 text-stone-400 text-xs font-bold rounded-sm hover:border-stone-500">45cm</button>
                <button className="flex-1 py-2 border border-stone-300 dark:border-white/20 text-stone-400 text-xs font-bold rounded-sm hover:border-stone-500">50cm</button>
            </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
             <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="text-xs">Certificado de Autenticidade Incluso</span>
             </div>
             <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span className="text-xs">Frete Segurado Grátis</span>
             </div>
             <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span className="text-xs">Embalagem de Presente Signature</span>
             </div>
        </div>
      </div>

      {/* Sticky Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-stone-200 dark:border-white/10 z-20">
         <button className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all rounded-sm flex items-center justify-center gap-3">
            <span>Adicionar ao Carrinho</span>
            <span className="w-px h-4 bg-black/20"></span>
            <span>R$ 4.500</span>
         </button>
      </div>
    </div>
  );
};

export default ProductDetails;