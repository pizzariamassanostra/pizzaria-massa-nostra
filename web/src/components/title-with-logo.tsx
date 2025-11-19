import { Card } from "@nextui-org/card";
import Link from "next/link";

export default function TitleWithLogo() {
  return (
    <Link href="/" className="bg-black/65 cursor-pointer rounded-xl">
      <Card
        isBlurred
        className="p-4 flex flex-col w-full justify-center items-center space-y-2"
      >
        <img src="/sortelancada-idea.svg" alt="sorte" />
      </Card>
    </Link>
  );
}
