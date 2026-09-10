
import { useVirtualizer, type ReactVirtualizer, type VirtualItem } from "@tanstack/react-virtual";

interface IListVirtualizer {
  parentRef: React.RefObject<HTMLDivElement | null>;
  list: object[];
  overscan?: number;
}

interface ReturnListVirtualizerParams {
  virtualizer: ReactVirtualizer<HTMLDivElement, Element>;
  virtualItems: VirtualItem[];
}


export const useListVirtualizer = ({
  parentRef,
  list,
  overscan = 5,
}: IListVirtualizer): ReturnListVirtualizerParams => {
  const virtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return { virtualizer, virtualItems };
};