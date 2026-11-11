import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CurriculumItem } from '@/shared/types/learning';
import { BottomSheet, BottomSheetContent } from '@/shared/components/ui/BottomSheet';
import { LearningCurriculumTree } from './LearningCurriculumTree';

interface CurriculumBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculum: CurriculumItem[];
  activeId: string;
  title: string;
}

/**
 * CurriculumBottomSheet - Mobile curriculum navigation
 * 
 * Displays the learning curriculum tree in a bottom sheet on mobile devices.
 * Opened from learning surfaces when curriculum context is needed.
 * 
 * Features:
 * - Full curriculum tree navigation
 * - Auto-closes after selecting an item
 * - Safe-area aware
 * - Touch-friendly sizing
 */
export function CurriculumBottomSheet({
  open,
  onOpenChange,
  curriculum,
  activeId,
  title,
}: CurriculumBottomSheetProps) {
  const navigate = useNavigate();

  // Wrapper to close sheet after navigation
  const handleItemSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
  };

  // Create a modified curriculum with wrapped navigation handlers
  const wrappedCurriculum = React.useMemo(() => {
    const wrapItem = (item: CurriculumItem): CurriculumItem => ({
      ...item,
      // Store original href for the wrapper
      href: item.href,
      children: item.children?.map(wrapItem),
    });
    
    return curriculum.map(wrapItem);
  }, [curriculum]);

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent ariaLabel={`${title} curriculum navigation`}>
        <div className="px-3 py-4 pb-8">
          {/* Title */}
          <div className="mb-4 border-b border-border-subtle pb-3">
            <p className="type-label mb-1 text-accent uppercase tracking-[0.12em]">
              <span aria-hidden="true">//&nbsp;</span>
              Curriculum
            </p>
            <h2 className="text-lg font-black text-text-primary">
              {title}
            </h2>
          </div>

          {/* Curriculum Tree */}
          <LearningCurriculumTree
            items={wrappedCurriculum}
            activeId={activeId}
            collapsed={false}
          />
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export default CurriculumBottomSheet;
