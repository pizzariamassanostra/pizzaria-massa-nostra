export const ImageContainer = ({
  src,
  objectFit,
}: {
  src?: string;
  objectFit?: string;
}) => {
  if (!src) return null;
  return (
    <img
      className={`${objectFit ? `${objectFit}` : "object-cover"}h-auto sm:h-full rounded-xl`}
      src={src}
    />
  );
};
