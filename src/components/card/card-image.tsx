type Props = {
  className?: string;
  imageUrl: string;
  sideways?: boolean;
};

export function CardImage({ className, imageUrl, sideways }: Props) {
  return (
    <div className={className}>
      <img
        src={imageUrl}
        loading="lazy"
        width={sideways ? 420 : 300}
        height={sideways ? 300 : 420}
      />
    </div>
  );
}
