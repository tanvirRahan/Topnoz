"use client";

import Image from 'next/image';
import { CartItem } from '@/hooks/useCart';

interface CartItemCardProps {
  item: CartItem;
  updateQuantity: (item: CartItem, action: 'increase' | 'decrease') => void;
}

export default function CartItemCard({ item, updateQuantity }: CartItemCardProps) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  return (
    <div style={{ display: 'flex', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid #EAEAEA' }}>
      <div style={{ width: '120px', height: '150px', position: 'relative', backgroundColor: '#F5F5F5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
        <Image 
          src={item.image_url ? `${backendUrl}${item.image_url}` : 'https://placehold.co/150x200'} 
          alt={item.product_title}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{item.product_title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {item.discount_price ? (
              <>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#D32F2F' }}>৳{item.discount_price}</span>
                <del style={{ fontSize: '13px', color: '#888' }}>৳{item.price}</del>
              </>
            ) : (
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>৳{item.price}</span>
            )}
          </div>
          {item.size && <div style={{ fontSize: '13px', color: '#666' }}>Size: {item.size}</div>}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <button 
              onClick={() => updateQuantity(item, 'decrease')}
              style={{ padding: '8px 12px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >-</button>
            <span style={{ padding: '8px 16px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', fontSize: '14px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(item, 'increase')}
              style={{ padding: '8px 12px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >+</button>
          </div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            ৳{item.total_price}
          </div>
        </div>
      </div>
    </div>
  );
}
