"use client";

import Link from "next/link";
import Route from "../constants/Route";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const NavLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  const pathname = usePathname();
  const Router = useRouter();

  return (
    <nav
      className="
        sticky top-0 z-50 w-full 
        bg-[#D35A0F]/90 backdrop-blur-sm
        border-b border-white/10
      "
    >
      <div className="flex justify-between items-center py-6 px-6">
        <Link href={Route.HOME}>
          <Image src="/logo.png" alt="Logo" width={150} height={50} />
        </Link>

        <ul className="flex gap-6">
          {NavLinks.map((item) => (
            <Link key={item.name} href={item.href}>
              <li
                className={clsx(
                  "transition",
                  item.href === "/" && pathname === "/"
                    ? "text-white font-semibold underline underline-offset-8"
                    : "text-gray-200 hover:text-white"
                )}
              >
                {item.name}
              </li>
            </Link>
          ))}
        </ul>

        <div className="flex gap-4">
          <Button
            onClick={() => Router.push(Route.LOGINPAGE)}
            className="bg-transparent border border-gray-200 text-white px-4 py-2  hover:bg-gray-200 hover:text-[#D35A0F] transition-colors"
          >
            Login
          </Button>

          <Button
            onClick={() => Router.push(Route.SIGNUPAGE)}
            className="bg-white text-[#D35A0F] px-4 py-2 hover:bg-gray-100 transition-colors "
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
