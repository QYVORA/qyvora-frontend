import { ImageOff } from 'lucide-react';

const StepPlaceholder: React.FC<{ stepNum: number }> = ({ stepNum }) => (
  <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl py-8 text-text-muted bg-transparent">
    <ImageOff className="h-5 w-5 opacity-25" />
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-35">
      Step {stepNum} — image coming soon
    </span>
  </div>
);

export default StepPlaceholder;
