import { Key } from "react";

export default function translateSort(key: Key | undefined, array: any[]): any {
  if (typeof key == "string") {
    const index = parseInt(key.split(".")[1]);
    return array[index];
  }
  return array[0];
}
