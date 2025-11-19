import { ReactElement, useEffect } from "react";
import {
  Banknote,
  ChevronLeft,
  CircleUser,
  HomeIcon,
  LogOut,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem: React.FC<{
  label: string;
  icon: ReactElement;
  url: string;
  isSelected?: boolean;
}> = ({ icon, label, url, isSelected }) => {
  return (
    <Link
      href={url}
      className={`flex flex-row items-center transition-colors duration-300 mx-3 my-1 rounded-lg justify-start p-2  pl-3 ${
        isSelected
          ? "bg-white text-black"
          : "text-white hover:bg-black hover:bg-opacity-20"
      }`}
    >
      {icon}
      <span className={`ml-2 transition-all`}>{label}</span>
    </Link>
  );
};

export const AdminSidebarComponent = ({
  isOpen,
  toggleIsOpen,
}: {
  isOpen: boolean;
  toggleIsOpen: () => void;
}) => {
  const location = usePathname();

  useEffect(() => {
    if (isOpen) toggleIsOpen();
  }, [location]);

  return (
    <>
      <div
        className={`${
          isOpen ? "absolute left-0" : "absolute -left-52"
        } transition-all`}
      >
        <div
          className={`relative z-30 flex flex-col h-screen justify-between bg-secondary shadow-lg md:w-[68px]`}
          style={{
            transition: `width ease-in-out 0.2s`,
            width: isOpen ? 224 : 0,
          }}
        >
          <div className={`flex flex-col h-full mb-10 justify-between`}>
            <div className="space-y-4">
              <div className="flex items-center flex-row align-center justify-evenly my-3 p-0 shadow pb-[11px]">
                <img
                  src="/moneyedolar.gif"
                  style={{ height: 100, width: 100 }}
                />
                <div className="cursor-pointer" onClick={toggleIsOpen}>
                  <ChevronLeft color="white" />
                </div>
              </div>

              <SidebarItem
                isSelected={location === "/admin"}
                label="Início Painel"
                icon={<HomeIcon />}
                url="/admin"
              />
              <SidebarItem
                isSelected={location === "/admin/pagamentos"}
                label="Pagamentos"
                icon={<Banknote />}
                url="/admin/pagamentos"
              />
              <SidebarItem
                isSelected={location === "/admin/usuarios"}
                label="Usuários"
                icon={<CircleUser />}
                url="/admin/usuarios"
              />
            </div>
            <div className="">
              <SidebarItem
                isSelected={location === "/logout"}
                label="Sair"
                icon={<LogOut />}
                url="/logout"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={toggleIsOpen}
        className={`absolute top-0 left-0 z-10 ${
          isOpen ? "w-screen opacity-80" : "w-0 opacity-0 invisible"
        } h-screen bg-secondary transition-opacity`}
      />
    </>
  );
};
