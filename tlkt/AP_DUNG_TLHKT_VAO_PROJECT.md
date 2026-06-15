# Ứng dụng Tâm lý học Kỹ thuật (TLHKT) vào dự án KaitoKid Shop

Tài liệu này ánh xạ các lý thuyết/định luật trong giáo trình TLHKT vào mã nguồn thực tế
của website bán quần áo trẻ em **KaitoKid** (frontend React + TypeScript: `kaito-kid-react/`).

---

## 1. Tổng quan dự án

- **Frontend:** React + TypeScript + Vite (`kaito-kid-react/`)
- **Backend:** .NET microservices (Auth, Customer, Admin, Gateway)
- **Loại tương tác người–máy:** Giao diện đồ họa GUI (interface-based interaction — Bài 9)

---

## 2. Bảng ánh xạ Lý thuyết → Mã nguồn

| Bài | Lý thuyết / Định luật | Áp dụng cụ thể | File |
|-----|----------------------|----------------|------|
| Bài 2 | **Lý thuyết phát hiện tín hiệu** (Signal Detection) | Cảnh báo "Chỉ còn X sản phẩm" và overlay "Hết hàng" dựa trên tồn kho **thật** (`product.stock`, `product.status`) — tránh "báo động giả" làm khách mất tin tưởng (giống ví dụ hệ thống cảnh báo bị tắt vì báo sai nhiều lần) | `components/product/ProductCard.tsx` |
| Bài 2 | **Độ nổi bật (Salience) - SEEV** | Overlay "Hết hàng" và cảnh báo tồn kho dùng màu tương phản cao (đỏ) để thu hút chú ý tự động | `styles/product-card-ivy.css` (`.ivy-stock-overlay`, `.ivy-low-stock`) |
| Bài 4 | **Định luật Fitts** | Tăng vùng chạm của nút (yêu thích, so sánh ≥36px; nút giỏ 38px) để dễ nhắm trúng, nhất là trên màn hình cảm ứng | `styles/product-card-ivy.css` (`.ivy-wishlist-btn`, `.ivy-compare-btn`, `.ivy-cart-btn`) |
| Bài 4 | **Định luật Doherty** (<400ms) | Sau khi thêm giỏ, nút đổi sang dấu ✓ màu xanh trong 1.5s → phản hồi tức thì, người dùng biết thao tác thành công | `ProductCard.tsx` (`justAdded`), CSS `.ivy-cart-btn.added` |
| Bài 4 | **Luật Gestalt** (gần nhau / cùng vùng) | Thẻ sản phẩm gom ảnh + tên + giá + nút thành 1 khối thống nhất; lưới sản phẩm cách đều | `ProductCard.tsx`, `.products-grid` |
| Bài 5 | **Nguyên tắc Dung sai cho lỗi** (Tolerance for Error) | Nút "Thêm giỏ" bị **vô hiệu hoá** khi hết hàng → ngăn thao tác vô nghĩa; xác nhận trước khi xoá (giỏ/địa chỉ) | `ProductCard.tsx` (`disabled={isOutOfStock}`) |
| Bài 5 | **Nguyên tắc Linh hoạt trong sử dụng** | Cho phép thêm/bớt so sánh ngay trên thẻ sản phẩm (nhiều cách mua sắm) | `ProductCard.tsx` (nút so sánh) |
| Bài 5 | **Thông tin có thể cảm nhận được** | Mọi nút đều có `aria-label` rõ ràng (hỗ trợ người khiếm thị / screen reader) | `ProductCard.tsx` |

---

## 3. Chi tiết các thay đổi đã thực hiện (nhánh `feature/tlhkt-ux-improvements`)

### 3.1. `components/product/ProductCard.tsx`
- Thêm hằng `LOW_STOCK_THRESHOLD = 5` — ngưỡng phát "tín hiệu" tồn kho thấp.
- `isOutOfStock`, `isLowStock`: tính từ dữ liệu thật → đúng nguyên lý phát hiện tín hiệu (Bài 2).
- `justAdded`: state phản hồi tức thì (Bài 4 – Doherty).
- Overlay "Hết hàng" + dòng "Chỉ còn X sản phẩm".
- Nút giỏ `disabled` khi hết hàng (Bài 5 – dung sai lỗi).
- Kích hoạt nút **So sánh** (trước đây import nhưng chưa dùng).

### 3.2. `styles/product-card-ivy.css`
- Tăng vùng chạm các nút (Định luật Fitts).
- Thêm style trạng thái `.added` (xanh), `:disabled` (xám), overlay hết hàng, cảnh báo tồn kho thấp.

---

## 4. Gợi ý mở rộng tiếp theo (cho báo cáo)

- **Bài 3 – Chunking / Tải nhận thức:** Checkout nhiều bước (`components/checkout/`) + thanh tiến trình "Bước 2/4".
- **Bài 4 – Hick:** Giới hạn số mục menu chính trong `layout/Header.tsx`.
- **Bài 4 – Zeigarnik:** Nhắc giỏ hàng còn sản phẩm chưa thanh toán.
- **Bài 7 – Tối ưu giao diện cảm ứng:** Tăng kích thước nút chọn size/màu trong `VariantPickerModal.tsx`.
- **Bài 9 – AI hỗ trợ:** `components/chat/ChatWidget.tsx` minh hoạ xu hướng tương tác người–máy bằng AI.

---

*Tài liệu phục vụ môn Tâm lý học Kỹ thuật — minh hoạ ứng dụng thực tế trên dự án KaitoKid Shop.*
