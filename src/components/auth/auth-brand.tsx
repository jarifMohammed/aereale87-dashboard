import Image from "next/image";

export function AuthBrand() {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <div className="mb-3 overflow-hidden rounded-[18px] border border-[#e7dfd2] bg-white px-3 py-2 shadow-[0_10px_30px_-20px_rgba(58,44,10,0.35)]">
        <Image
          src="/logo.svg"
          alt="Wonder Emporium logo"
          width={150}
          height={90}
          className="h-auto w-[132px]"
          priority
        />
      </div>
      <p className="text-[13px] font-semibold text-[#5b4e12]">
        Wonder Emporium
      </p>
    </div>
  );
}
