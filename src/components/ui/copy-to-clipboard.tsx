import { useCopyToClipboard } from "@/utils/use-copy-to-clipboard";
import { CheckIcon, ClipboardCopyIcon } from "lucide-react";
import { useCallback } from "react";
import { Button, type Props as ButtonProps } from "./button";

type Props = {
  text: string;
  tooltip?: string;
} & Omit<ButtonProps<"button">, "children" | "onClick">;

export function CopyToClipboard(props: Props) {
  const { text, tooltip, ...rest } = props;

  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const onClick = useCallback(() => {
    copyToClipboard(text);
  }, [copyToClipboard, text]);

  return (
    <Button
      tooltip={isCopied ? "Copied!" : (tooltip ?? "Copy to clipboard")}
      {...rest}
      iconOnly
      onClick={onClick}
    >
      {isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
    </Button>
  );
}
