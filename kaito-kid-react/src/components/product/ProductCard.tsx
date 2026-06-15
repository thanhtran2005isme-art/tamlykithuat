// ProductCard - IVY moda style: clean, minimal
// Áp dụng nguyên tắc Tâm lý học Kỹ thuật (TLHKT):
//  - Bài 2 (Lý thuyết phát hiện tín hiệu): cảnh báo tồn kho THẬT, tránh "báo động giả".
//  - Bài 4 (Định luật Fitts): nút bấm đủ lớn, dễ nhắm trúng.
//  - Bài 4 (Định luật Doherty): phản hồi thao tác tức thì (<400ms).
//  - Bài 5 (Dung sai cho lỗi): vô hiệu hoá thao tác khi hết hàng.

import { useState, useCallback } from 'react';
import { PiHeartStraight, PiHeartStraightFill, PiShoppingBagOpenFill, PiScalesBold, PiScales, PiCheckBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import ProductVariantModal from './ProductVariantModal';

// Ngưỡng tồn kho thấp để hiển thị "tín hiệu" cảnh báo (Bài 2 - Signal Detection)
const LOW_STOCK_THRESHOLD = 5;


interface ProductCardProps {
  product: Product;
  onToggleWishlist?: (id: number) => void;
  isWishlisted?: boolean;
}

function getWishlist(): number[] {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
  catch { return []; }
}

function toggleWishlistInStorage(id: number): boolean {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1); else list.push(id);
  localStorage.setItem('wishlist', JSON.stringify(list));
  return idx < 0;
}

function getCompare(): number[] {
  try { return JSON.parse(localStorage.getItem('kk_compare') || '[]'); }
  catch { return []; }
}

function toggleCompareInStorage(id: number): { added: boolean; full: boolean } {
  const list = getCompare();
  const idx = list.indexOf(id);
  if (idx >= 0) {
    list.splice(idx, 1);
    localStorage.setItem('kk_compare', JSON.stringify(list));
    return { added: false, full: false };
  }
  if (list.length >= 4) return { added: false, full: true };
  list.push(id);
  localStorage.setItem('kk_compare', JSON.stringify(list));
  return { added: true, full: false };
}

export default function ProductCard({ product, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(() => isWishlisted ?? getWishlist().includes(product.id));
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [compared, setCompared] = useState(() => getCompare().includes(product.id));
  // Bài 4 (Doherty): phản hồi tức thì - hiển thị trạng thái "đã thêm" sau khi bấm.
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  // Bài 2 (Phát hiện tín hiệu): xác định "tín hiệu" tồn kho dựa trên dữ liệu THẬT.
  const isOutOfStock = product.status === 'out-of-stock' || product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= LOW_STOCK_THRESHOLD;


  const handleWishlist = useCallback(() => {
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
      setWishlisted(prev => !prev);
    } else {
      setWishlisted(toggleWishlistInStorage(product.id));
    }
  }, [onToggleWishlist, product.id]);

  const handleCompare = useCallback(() => {
    const r = toggleCompareInStorage(product.id);
    if (r.full) {
      alert('Chỉ so sánh tối đa 4 sản phẩm. Vui lòng bỏ bớt trước.');
      return;
    }
    setCompared(r.added);
  }, [product.id]);

  // Mở modal chọn biến thể (size + màu + số lượng)
  const handleAddToCart = () => {
    setVariantModalOpen(true);
  };

  const handleConfirmAddCart = async (size: string, color: string, quantity: number) => {
    await addItem(product, size, color, quantity);
    // Bài 4 (Doherty): phản hồi tức thì để người dùng biết thao tác đã thành công.
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="ivy-product-card">
      {/* Image */}
      <div className="ivy-card-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {/* Badge */}
        {product.isNew && <span className="ivy-badge ivy-badge-new">NEW</span>}
        {product.isSale && !product.isNew && <span className="ivy-badge ivy-badge-sale">SALE</span>}
        {product.isBestSeller && !product.isNew && !product.isSale && <span className="ivy-badge ivy-badge-hot">HOT</span>}
        {/* Bài 2 (Phát hiện tín hiệu): cảnh báo HẾT HÀNG - tín hiệu rõ ràng, độ nổi bật cao */}
        {isOutOfStock && <span className="ivy-stock-overlay">Hết hàng</span>}
      </div>

      {/* Color dot + Wishlist row */}
      <div className="ivy-card-actions">
        <div className="ivy-color-dots">
          {product.colors && product.colors.length > 0 ? (
            product.colors.slice(0, 3).map((color, i) => (
              <span key={i} className="ivy-color-dot" style={{ background: mapColor(color) }} title={color}></span>
            ))
          ) : (
            <span className="ivy-color-dot" style={{ background: '#e8d44d' }}></span>
          )}
        </div>
        <button
          className={`ivy-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          type="button"
          aria-label={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          {wishlisted ? <PiHeartStraightFill aria-hidden="true" /> : <PiHeartStraight aria-hidden="true" />}
        </button>
        {/* Bài 5 (Linh hoạt trong sử dụng): cho phép thêm/bớt so sánh ngay tại thẻ */}
        <button
          className={`ivy-compare-btn ${compared ? 'active' : ''}`}
          onClick={handleCompare}
          type="button"
          aria-label={compared ? 'Bỏ so sánh' : 'Thêm vào so sánh'}
          title={compared ? 'Bỏ so sánh' : 'So sánh sản phẩm'}
        >
          {compared ? <PiScalesBold aria-hidden="true" /> : <PiScales aria-hidden="true" />}
        </button>
      </div>

      {/* Name */}
      <Link to={`/product/${product.id}`} className="ivy-card-name">{product.name}</Link>

      {/* Bài 2 (Phát hiện tín hiệu): cảnh báo tồn kho thấp dựa trên số liệu THẬT.
          Chỉ hiện khi thực sự sắp hết để tránh "báo động giả" làm khách mất tin tưởng. */}
      {isLowStock && (
        <p className="ivy-low-stock" role="status">Chỉ còn {product.stock} sản phẩm</p>
      )}

      {/* Price + Cart */}
      <div className="ivy-card-bottom">
        <div className="ivy-card-price">
          <span className="ivy-price-current">{formatCurrency(product.price)}</span>
          {product.oldPrice && <span className="ivy-price-old">{formatCurrency(product.oldPrice)}</span>}
        </div>
        {/* Bài 4 (Fitts): nút đủ lớn, dễ nhắm. Bài 4 (Doherty): phản hồi tức thì khi thêm.
            Bài 5 (Dung sai lỗi): vô hiệu hoá khi hết hàng để ngăn thao tác vô nghĩa. */}
        <button
          className={`ivy-cart-btn ${justAdded ? 'added' : ''}`}
          onClick={handleAddToCart}
          type="button"
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? 'Sản phẩm đã hết hàng' : justAdded ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
        >
          {justAdded ? <PiCheckBold aria-hidden="true" /> : <PiShoppingBagOpenFill aria-hidden="true" />}
        </button>
      </div>


      <ProductVariantModal
        product={product}
        open={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        onConfirm={handleConfirmAddCart}
      />
    </div>
  );
}

function mapColor(color: string): string {
  const map: Record<string, string> = {
    'Đen': '#1a1a1a', 'Trắng': '#f5f5f5', 'Đỏ': '#d32f2f', 'Xanh': '#1976d2',
    'Xanh dương': '#1976d2', 'Xanh lá': '#388e3c', 'Vàng': '#e8d44d',
    'Hồng': '#e91e8f', 'Tím': '#7b1fa2', 'Cam': '#f57c00', 'Nâu': '#5d4037',
    'Xám': '#9e9e9e', 'Be': '#d4b896', 'Kem': '#f5e6ca', 'Navy': '#1a237e',
  };
  return map[color] || '#ccc';
}
