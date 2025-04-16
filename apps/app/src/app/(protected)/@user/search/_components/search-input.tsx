'use client';

import { InputWithIcon } from '@repo/design-system/components/shared/input-with-icon';
import { Button } from '@repo/design-system/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const SearchInput = () => {
  return (
    <div className="relative">
      <InputWithIcon
        icon={Search}
        placeholder="Search..."
        className="h-12 w-96 rounded-full ps-9"
        onFocus={() => console.log('Input focused')}
        onBlur={() => console.log('Input blurred')}
        onChange={(e) => console.log('Input changed:', e.target.value)}
      />
      <Button
        size="icon"
        variant="ghost"
        className="-translate-y-1/2 absolute end-2 top-1/2 rounded-full"
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

SearchInput.displayName = 'SearchInput';

export default SearchInput;
