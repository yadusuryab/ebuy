import { Bebas_Neue } from "next/font/google";

const babs = Bebas_Neue({
  weight:["400"],
  subsets:["latin"]
})
export default function Brand({ className }: any) {
  const brandName = process.env.NEXT_PUBLIC_APP_NAME || 'WATCHZ';

  return (
    <div className={`${className} flex items-center gap-3`}>
      {/* Vertical accent bar */}

      <div className="flex flex-col justify-center">
        <span
      
          className={`text-2xl uppercase text-stone-100 ${babs.className} `}
        >
          {brandName}
        </span>
        {/* <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '0.6em',
            fontWeight: 300,
          }}
          className="text-[8px] text-gray-400 uppercase"
        >
          Precision Timepieces
        </span> */}
      </div>
    </div>
  );
}