import { isValidElement } from 'react';
import { Search } from 'lucide-react';

// Reusable empty state component
export default function EmptyState({ icon: IconProp, title, hint, action }) {
  const renderIcon = () => {
    if (!IconProp) {
      return <Search className="w-8 h-8 text-zinc-400" />;
    }
    if (isValidElement(IconProp)) {
      return IconProp;
    }
    if (
      typeof IconProp === 'function' ||
      (typeof IconProp === 'object' && (typeof IconProp.render === 'function' || IconProp.$$typeof))
    ) {
      const Component = IconProp;
      return <Component className="w-8 h-8 text-zinc-500" />;
    }
    return <span className="text-2xl">{IconProp}</span>;
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center my-4 shadow-xs flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-3">
        {renderIcon()}
      </div>
      <h3 className="text-base md:text-lg font-bold text-zinc-900 m-0 mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-zinc-500 max-w-md mb-4">{hint}</p>
      {action}
    </div>
  );
}
