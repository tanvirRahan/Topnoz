"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { DELIVERY_FEES } from '@/constants/config';

export default function Checkout() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    payment_method: 'cod',
    delivery_location: 'inside', // 'inside' or 'outside'
    bkash_number: '',
    bkash_transaction: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const deliveryFee = formData.delivery_location === 'inside' ? DELIVERY_FEES.INSIDE_DHAKA : DELIVERY_FEES.OUTSIDE_DHAKA;
  const subtotal = cart?.subtotal || 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          payment_method: formData.payment_method,
          bkash_number: formData.bkash_number || '',
          bkash_transaction: formData.bkash_transaction || ''
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/thanks');
      } else {
        // Handle Django Ninja Validation Errors
        if (data.detail && Array.isArray(data.detail)) {
          setError(`Validation Error: ${data.detail.map((d: any) => d.msg).join(', ')}`);
        } else if (typeof data.detail === 'string') {
          setError(data.detail);
        } else {
          setError(data.message || `Error processing checkout: ${JSON.stringify(data)}`);
        }
      }
    } catch (err: any) {
      setError(`Network error: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>Loading checkout...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="template-container" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '60vh', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>Please add some items to your cart before proceeding to checkout.</p>
        <button 
          onClick={() => router.push('/cart')}
          style={{ padding: '16px 32px', backgroundColor: '#111', color: '#fff', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', border: 'none', borderRadius: '4px' }}
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-element {
          opacity: 0;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-d-1 { animation-delay: 0.1s; }
        .anim-d-2 { animation-delay: 0.2s; }
        .anim-d-3 { animation-delay: 0.3s; }
        .anim-d-4 { animation-delay: 0.4s; }
        
        .checkout-input {
          width: 100%;
          padding: 16px;
          border: 1px solid #EAEAEA;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
          background: #fff;
        }
        .checkout-input:focus {
          border-color: #111;
          box-shadow: 0 0 0 1px #111;
        }
        .checkout-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          color: #555;
        }
        .radio-card {
          display: flex;
          align-items: center;
          padding: 16px;
          border: 1px solid #EAEAEA;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fff;
          margin-bottom: 12px;
        }
        .radio-card:hover {
          border-color: #999;
        }
        .radio-card.active {
          border-color: #111;
          background: #F9F9F9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .radio-circle {
          width: 18px;
          height: 18px;
          border: 2px solid #CCC;
          border-radius: 50%;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .radio-card.active .radio-circle {
          border-color: #111;
        }
        .radio-circle-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #111;
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s ease;
        }
        .radio-card.active .radio-circle-inner {
          opacity: 1;
          transform: scale(1);
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 991px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}} />

      <h1 className="anim-element" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '40px' }}>Checkout</h1>
      
      {error && (
        <div className="anim-element" style={{ padding: '16px', backgroundColor: '#FFEBEE', color: '#C62828', fontSize: '14px', borderRadius: '4px', marginBottom: '30px' }}>
          {error}
        </div>
      )}

      <div className="checkout-grid">
        {/* Left Column: Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="anim-element anim-d-1" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="checkout-label">Full Name</label>
                  <input type="text" className="checkout-input" name="name" required onChange={handleChange} placeholder="John Doe" />
                </div>
                <div>
                  <label className="checkout-label">Email Address</label>
                  <input type="email" className="checkout-input" name="email" required onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="checkout-label">Phone Number</label>
                  <input type="text" className="checkout-input" name="phone" required onChange={handleChange} placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="checkout-label">City</label>
                  <input type="text" className="checkout-input" name="city" required onChange={handleChange} placeholder="Dhaka" />
                </div>
              </div>
            </div>

            <div className="anim-element anim-d-2" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Address</h2>
              <div>
                <label className="checkout-label">Full Address</label>
                <input type="text" className="checkout-input" name="address" required onChange={handleChange} placeholder="House, Road, Area..." />
              </div>
            </div>

            <div className="anim-element anim-d-3" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Location</h2>
              
              <label className={`radio-card ${formData.delivery_location === 'inside' ? 'active' : ''}`}>
                <input type="radio" name="delivery_location" value="inside" checked={formData.delivery_location === 'inside'} onChange={handleChange} style={{ display: 'none' }} />
                <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Inside Dhaka</span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>৳{DELIVERY_FEES.INSIDE_DHAKA}</span>
                </div>
              </label>

              <label className={`radio-card ${formData.delivery_location === 'outside' ? 'active' : ''}`}>
                <input type="radio" name="delivery_location" value="outside" checked={formData.delivery_location === 'outside'} onChange={handleChange} style={{ display: 'none' }} />
                <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Outside Dhaka</span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>৳{DELIVERY_FEES.OUTSIDE_DHAKA}</span>
                </div>
              </label>
            </div>

            <div className="anim-element anim-d-4" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Method</h2>
              
              <label className={`radio-card ${formData.payment_method === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="payment_method" value="cod" checked={formData.payment_method === 'cod'} onChange={handleChange} style={{ display: 'none' }} />
                <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Advance Delivery Charge required</div>
                  </div>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </label>

              <label className={`radio-card ${formData.payment_method === 'bkash' ? 'active' : ''}`}>
                <input type="radio" name="payment_method" value="bkash" checked={formData.payment_method === 'bkash'} onChange={handleChange} style={{ display: 'none' }} />
                <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>bKash Payment</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Send Money (Personal)</div>
                  </div>
                  <div style={{ padding: '4px 8px', backgroundColor: '#E91E63', color: '#fff', fontSize: '10px', fontWeight: '800', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>bKash</div>
                </div>
              </label>

              <label className={`radio-card ${formData.payment_method === 'nagad' ? 'active' : ''}`}>
                <input type="radio" name="payment_method" value="nagad" checked={formData.payment_method === 'nagad'} onChange={handleChange} style={{ display: 'none' }} />
                <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Nagad Payment</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Send Money (Personal)</div>
                  </div>
                  <div style={{ padding: '4px 8px', backgroundColor: '#FF5722', color: '#fff', fontSize: '10px', fontWeight: '800', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nagad</div>
                </div>
              </label>

              {(formData.payment_method === 'bkash' || formData.payment_method === 'nagad' || formData.payment_method === 'cod') && (
                <div style={{ marginTop: '20px', padding: '24px', backgroundColor: '#F9F9F9', borderLeft: `3px solid ${formData.payment_method === 'bkash' ? '#E91E63' : formData.payment_method === 'nagad' ? '#FF5722' : '#111'}`, borderRadius: '0 4px 4px 0' }}>
                  
                  {formData.payment_method === 'cod' ? (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '13px', color: '#333', marginBottom: '8px', lineHeight: '1.5' }}>
                        <strong>Note:</strong> To confirm your Cash on Delivery order, please send the <strong>Delivery Fee (৳{deliveryFee})</strong> in advance.
                      </p>
                      <div style={{ padding: '12px', backgroundColor: '#fff', border: '1px dashed #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#777', fontWeight: '700', letterSpacing: '1px', display: 'block' }}>Send Money (Personal) To:</span>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#111', letterSpacing: '2px' }}>01709219473</span>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#E91E63' }}>bKash / Nagad</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '13px', color: '#333', marginBottom: '8px', lineHeight: '1.5' }}>
                        Please send your payment of <strong>৳{total}</strong> to the following number:
                      </p>
                      <div style={{ padding: '12px', backgroundColor: '#fff', border: '1px dashed #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#777', fontWeight: '700', letterSpacing: '1px', display: 'block' }}>Send Money (Personal) To:</span>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#111', letterSpacing: '2px' }}>01709219473</span>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: formData.payment_method === 'bkash' ? '#E91E63' : '#FF5722' }}>
                          {formData.payment_method.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="checkout-label">Sender Number</label>
                      <input type="text" className="checkout-input" name="bkash_number" required onChange={handleChange} placeholder="01XXXXXXXXX" />
                    </div>
                    <div>
                      <label className="checkout-label">Transaction ID</label>
                      <input type="text" className="checkout-input" name="bkash_transaction" required onChange={handleChange} placeholder="TRX..." />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Submit Button (Visible only on mobile, hidden on desktop by standard means, but let's just keep it simple) */}
            <div className="anim-element anim-d-4" style={{ display: 'block' }}>
              <style dangerouslySetInnerHTML={{__html: `
                .mobile-submit-btn { display: none; }
                @media (max-width: 991px) {
                  .mobile-submit-btn { display: block; margin-top: 40px; }
                }
              `}} />
              <button 
                type="submit" 
                className="mobile-submit-btn"
                disabled={loading} 
                style={{ 
                  width: '100%', padding: '16px', backgroundColor: '#111', color: '#fff', 
                  border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '700', 
                  textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="anim-element anim-d-2">
          <div style={{ position: 'sticky', top: '120px', backgroundColor: '#F9F9F9', padding: '32px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Summary</h3>
            
            <div style={{ marginBottom: '24px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
              {cart?.items.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
                  <div style={{ color: '#555', flex: 1, paddingRight: '16px' }}>
                    <span style={{ fontWeight: '600', color: '#111' }}>{item.quantity}x</span> {item.product_title}
                  </div>
                  <div style={{ fontWeight: '600' }}>৳{item.total_price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#555' }}>
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#555' }}>
                <span>Delivery Fee</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '18px', fontWeight: '800', color: '#111' }}>
                <span>Total</span>
                <span>৳{total}</span>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
              .desktop-submit-btn { display: block; }
              @media (max-width: 991px) {
                .desktop-submit-btn { display: none; }
              }
            `}} />
            <button 
              onClick={handleSubmit} 
              className="desktop-submit-btn"
              disabled={loading} 
              style={{ 
                width: '100%', padding: '16px', backgroundColor: '#111', color: '#fff', 
                border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '700', 
                textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
