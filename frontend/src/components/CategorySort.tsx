'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CategorySort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams?.get('sort') || 'recommended';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('sort', sort);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <select className="premium-sort-select" value={currentSort} onChange={handleSortChange}>
      <option value="recommended">Recommended</option>
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
}
