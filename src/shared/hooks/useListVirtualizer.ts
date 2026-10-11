
import { useVirtualizer, type ReactVirtualizer, type VirtualItem } from "@tanstack/react-virtual";

interface IListVirtualizer {
  parentRef: React.RefObject<HTMLDivElement | null>;
  list: object[];
  estimateSize?: (value: number) => number;
  directDomUpdates?: boolean;
  overscan?: number;
}

interface ReturnListVirtualizerParams {
  virtualizer: ReactVirtualizer<HTMLDivElement, Element>;
  virtualItems: VirtualItem[];
}


export const useListVirtualizer = ({
  parentRef,
  list,
  estimateSize,
  overscan = 5,
  directDomUpdates = false,
}: IListVirtualizer): ReturnListVirtualizerParams => {
  const virtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize ? estimateSize : () => 80,
    getItemKey: (i) => (list[i] as { id: string }).id,
    directDomUpdates: directDomUpdates,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return { virtualizer, virtualItems };
};