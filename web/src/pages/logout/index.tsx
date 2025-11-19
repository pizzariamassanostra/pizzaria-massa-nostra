import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { CircularProgress } from "@nextui-org/progress";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
    router.push("/login");
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <CircularProgress
        classNames={{
          svg: "w-24 h-24",
        }}
      />
    </div>
  );
};

export default LogoutPage;
