import { useRouter } from "next/router";
import React, { FormEvent } from "react";
import { toast } from "react-toastify";
import Api from "@/common/api";
import { toastError } from "@/lib/toastError";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

const LoginPage = () => {
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("email");
    const password = formData.get("password");

    try {
      const { data } = await Api.post("/auth/authenticate", {
        username,
        password,
      });
      toast.success("Login efetuado com sucesso");
      localStorage.setItem("user_token", data.access_token);
      router.push("/admin");
    } catch (error) {
      toastError(error);
    }
  }
  return (
    <div className="w-full h-full flex-col justify-center flex items-center p-8">
      <Card isBlurred className="p-8 space-y-6 max-w-md w-full">
        <span className="text-2xl">Painel Administrativo</span>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="email">Insira seu email</label>
            <Input type="email" name="email" id="email" required />
          </div>

          <div>
            <label htmlFor="password">Insira sua senha</label>
            <Input type="password" name="password" id="password" required />
          </div>
          <div className="flex flex-col w-fit space-y-2">
            <Button type="submit" className="w-min" color="success">
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
