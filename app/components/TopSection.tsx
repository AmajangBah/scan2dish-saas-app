import { Button } from "@/components/ui/button";
import Image from "next/image";

const TopSection = () => {
  return (
    <main className="flex flex-col md:flex-row items-center justify-between relative px-6 md:px-20 py-10">
      <div className="gap-4 flex flex-col justify-between text-center md:text-left md:max-w-lg">
        <h1 className="text-4xl sm:text-5xl text-white font-bold mb-6 md:mb-10">
          Let Guests Order Without Waiting for a Waiter..
        </h1>
        <p className="text-xl sm:text-2xl text-white mb-6 md:mb-4">
          <span className="font-bold">Scan. Order. Eat.</span> The modern way to
          dine — faster, smarter, and built for restaurants that actually get
          it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-6 md:pt-10 justify-center md:justify-start">
          <Button className="bg-white rounded-md text-black hover:text-[#D35A0F] px-6 py-4">
            Get Started Now
          </Button>
          <Button className="bg-transparent border border-white text-white rounded-md hover:text-[#D35A0F] px-6 py-4">
            See how it works
          </Button>
        </div>
      </div>

      <div className="mt-10 md:mt-0 md:ml-10 flex justify-center md:justify-end w-full md:w-auto">
        <Image
          alt="hero-image"
          src={"/hero-img.png"}
          width={600}
          height={200}
          className="w-full max-w-sm md:max-w-none"
        />
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-[-100px] left-0 right-0 w-full">
        <Image
          src="/wave1.svg"
          alt="Decorative wave"
          width={1480}
          height={30}
          className="w-full"
        />
      </div>
    </main>
  );
};

export default TopSection;
