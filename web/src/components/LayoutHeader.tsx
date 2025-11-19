import { useRouter } from "next/router";
import { CommonSidebarComponent } from "./common-sidebar";
import { useState } from "react";
import { CircleUser, Menu } from "lucide-react";
import { AdminSidebarComponent } from "./admin/admin-sidebar";

export default function LayoutHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = router.pathname.includes(`admin`);
  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleClickHome = () => {
    router.push(isAdmin ? `/admin` : `/`);
  };
  return (
    <div className="w-full h-[72px] bg-black sticky top-0 flex flex-row justify-between z-50">
      <div className="absolute">
        {isAdmin ? (
          <AdminSidebarComponent isOpen={isOpen} toggleIsOpen={toggleIsOpen} />
        ) : (
          <CommonSidebarComponent isOpen={isOpen} toggleIsOpen={toggleIsOpen} />
        )}
      </div>
      <div
        className="h-full flex items-center px-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </div>
      <span
        onClick={handleClickHome}
        className="max-md:text-tiny h-full flex items-center cursor-pointer"
      >
        AS MELHORES AÇÕES E PRÊMIOS 🍀
      </span>

      {isAdmin ? (
        <div
          className="p-4 flex items-center justify-center cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          <CircleUser />
        </div>
      ) : (
        <div
          onClick={handleClickHome}
          className="p-2 w-[70px] h-[70px] cursor-pointer"
        >
          <img src="/logo.svg" />
        </div>
      )}
    </div>
  );
}
