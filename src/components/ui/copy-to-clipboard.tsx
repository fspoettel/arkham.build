import { useCopyToClipboard } from "@/utils/use-copy-to-clipboard";
import { CheckIcon, ClipboardCopyIcon } from "lucide-react";
import { useCallback } from "react";
import { Button } from "./button";
import css from "./copy-to-clipboard.module.css";

type Props = {
  text: string;
};

export function CopyToClipboard(props: Props) {
  const { text } = props;

  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const onClick = useCallback(() => {
    copyToClipboard(text);
  }, [copyToClipboard, text]);

  return (
    <Button
      className={css["button"]}
      iconOnly
      variant="bare"
      onClick={onClick}
      tooltip={isCopied ? "Copied!" : "Copy to clipboard"}
    >
      {isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
    </Button>
  );
}
