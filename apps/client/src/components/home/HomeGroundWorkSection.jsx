import React from "react";
import groundOne from "../../assets/marketing/g1.jpeg";
import groundTwo from "../../assets/marketing/g2.jpeg";
import groundThree from "../../assets/marketing/g3.JPG";
import marketingOne from "../../assets/marketing/1.jpeg";
import marketingTwo from "../../assets/marketing/2.png";
import marketingThree from "../../assets/marketing/3.jpeg";

const groundImages = [
  { src: groundTwo, alt: "OnIT flyers used during ground work" },
  { src: marketingOne, alt: "OnIT ground work showcase" },
  { src: groundOne, alt: "OnIT ground work with local outreach" },
  { src: groundThree, alt: "OnIT campus presentation" },
  { src: marketingTwo, alt: "OnIT ground work showcase" },
  { src: marketingThree, alt: "OnIT ground work showcase" },
  { src: "/assets/1.png", alt: "OnIT ground work showcase" },
  { src: "/assets/2.png", alt: "OnIT ground work showcase" },
  { src: "/assets/3.png", alt: "OnIT ground work showcase" },
];

export default function HomeGroundWorkSection() {
  return (
    <section className="overflow-hidden bg-white py-[55px] max-md:px-4">
      <div className="ml-[61px] flex h-[294px] w-[2167px] items-center gap-[50px] max-lg:ml-6 max-md:ml-0 max-md:h-auto max-md:w-full max-md:flex-col max-md:items-start max-md:gap-8">
        <h2 className="flex h-[96px] w-[255px] shrink-0 flex-col justify-center font-['Inter'] text-[40px] font-semibold leading-[48px] tracking-normal text-black">
          <span className="block h-12 w-[87px]">OUR</span>
          <span className="block h-12 w-[255px] whitespace-nowrap">Ground Work</span>
        </h2>

        <div className="flex h-[294px] w-[1862px] flex-1 items-center gap-[15px] overflow-x-auto pr-[150px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:w-full max-md:pr-8">
          {groundImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="group h-[294px] w-[120px] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#F3F4F6] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-[width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[294px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)] max-md:hover:w-[220px]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
