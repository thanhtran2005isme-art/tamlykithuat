# PHÂN TÍCH ỨNG DỤNG TÂM LÝ HỌC KỸ THUẬT (TLHKT) — CHƯƠNG 2 → 10

> Tài liệu này được viết **sau khi đọc toàn bộ giáo trình từ Bài 2 đến Bài 10**
> (các file PDF trong thư mục `tlkt/`). Mỗi chương gồm 3 phần:
> **(A) Tóm tắt lý thuyết cốt lõi** đúng theo giáo trình →
> **(B) Áp dụng vào đâu trong project** (gắn file thật) →
> **(C) Việc cần làm cụ thể**.
>
> Dự án: **KaitoKid Shop** — website bán quần áo (chủ yếu đồ trẻ em + nam/nữ).
> - Frontend: `kaito-kid-react/` (React + TypeScript + Vite)
> - Backend: .NET microservices (`API.Auth`, `API.Admin`, Customer, Gateway)
> - Loại tương tác người–máy: **giao diện đồ họa GUI (interface-based)** — xem Bài 9.

---

## 0. Bản đồ định vị (file thật trong dự án)

| Khu vực | File / thư mục thật | Vai trò với người dùng |
|---|---|---|
| Trang chủ | `src/pages/Home.tsx` | Điểm tiếp xúc đầu tiên |
| Danh sách SP + lọc | `src/pages/Products.tsx`, `components/ProductListPage.tsx` | Duyệt & lọc |
| Thẻ sản phẩm | `components/product/ProductCard.tsx` + `styles/product-card-ivy.css` | Hiển thị mỗi SP |
| Chọn biến thể | `components/product/ProductVariantModal.tsx`, `components/VariantPickerModal.tsx` | Chọn size/màu |
| Chi tiết SP | `src/pages/ProductDetail.tsx` | Xem kỹ, quyết định mua |
| Giỏ hàng | `src/pages/Cart.tsx` | Xem lại trước khi mua |
| Thanh toán | `src/pages/Checkout.tsx` + `components/checkout/*` | Đặt hàng nhiều bước |
| Header / điều hướng | `components/layout/Header.tsx`, `HeaderSearch.tsx` | Menu, tìm kiếm |
| Nhắc nhở | `components/layout/NotificationBell.tsx`, `RecentlyViewedStrip.tsx` | Thông báo, SP vừa xem |
| Flash sale | `components/FlashSaleCountdown.tsx` | Đếm ngược deal |
| Tài khoản / bảo mật | `src/pages/Login.tsx`, backend `API.Auth` | Đăng nhập |
| Chat hỗ trợ | `components/chat/*`, `context/ChatContext.tsx` | Hỗ trợ người dùng |
| Đa ngôn ngữ / accessibility | `src/i18n/`, `components/Image.tsx`, `hooks/useFocusTrap.ts` | Tiếp cận công bằng |
| Xử lý lỗi | `components/ErrorBoundary.tsx` | Dung sai lỗi |
| Tìm bằng giọng nói/ảnh | `hooks/useVoiceSearch.ts`, `hooks/useImageSearch.ts` | Đầu vào đa phương thức |
| Admin (môi trường nhân viên) | `src/admin/*`, `API.Admin` | Quản trị, vận hành |

> **Lưu ý quan trọng cho báo cáo:** Bài 2–7 hướng về **khách hàng** (người dùng cuối của storefront). Bài 8–10 hướng về **người vận hành/nhân viên** → áp dụng cho **trang Admin** và backend.

---

# CHƯƠNG 2 (Bài 2) — Nhận thức & Xử lý thông tin

## (A) Lý thuyết cốt lõi
- **Lý thuyết phát hiện tín hiệu** (Signal Detection): tín hiệu / nhiễu / tiêu chuẩn phản ứng / phản hồi. 4 khả năng: **hit / miss / false alarm / correct rejection**. **Độ nhạy (d)** = khả năng phân biệt tín hiệu với nhiễu.
  - Bài học kinh điển trong giáo trình: **báo động sai (false alarm) nhiều lần → con người bỏ qua cảnh báo** (vụ kiểm soát không lưu Guam 2001 tắt cảnh báo độ cao vì báo sai quá nhiều → tai nạn >100 người chết).
  - Kỹ thuật tăng độ nhạy: hiển thị ví dụ/hình minh họa (giảm tải nhớ); **tăng độ nổi bật của mục tiêu**; giảm số lượt phải kiểm tra; đào tạo người quan sát.
- **Mô hình xử lý thông tin** 4 giai đoạn: **Nhận thức → Nhận dạng → Quyết định → Thực hiện**.
- **Chú ý** (thị giác/thính giác); **vùng quan sát AOI**; **mô hình SEEV** (Salience – độ nổi bật, Effort – nỗ lực, Expectancy – kỳ vọng, Value – giá trị) để dự đoán mắt nhìn vào đâu.
- **Mù không chú ý**: nhìn mà không thấy khi đang bận việc khác.
- **Giảm lộn xộn** (clutter) và áp **luật Gestalt** để tổ chức màn hình → xử lý toàn diện thay vì cục bộ.

## (B) Áp dụng vào đâu
| Nơi áp dụng (file thật) | Lý thuyết | Việc cần làm (C) |
|---|---|---|
| `components/product/ProductCard.tsx` + `styles/product-card-ivy.css` | Phát hiện tín hiệu, độ nhạy | Badge **"Hết hàng"**, **"Chỉ còn X sản phẩm"** dựa trên `stock` **thật**. Tránh báo sai (ví dụ luôn hiện "sắp hết" khi còn nhiều) → khách mất tin như vụ Guam. **(Đã làm)** |
| `components/FlashSaleCountdown.tsx`, `Home.tsx` | SEEV – Salience + Expectancy | Đồng hồ đếm ngược + nút "Mua ngay" màu tương phản cao, có chuyển động → thu hút chú ý tự động, tạo kỳ vọng "deal sắp hết". |
| `components/layout/Header.tsx` | SEEV – Salience | Badge số lượng giỏ hàng nổi bật (màu, số đếm) đặt ở **AOI** mắt hay quét (góc phải trên). |
| `src/pages/ProductDetail.tsx` | Nhận thức không gian, độ nhạy | Ảnh nhiều góc, **zoom**, ảnh 360°/video → khách "cảm nhận" vải, dáng áo rõ hơn (giảm miss khi đánh giá SP). |
| Toàn site, đặc biệt `Home.tsx` | Giảm lộn xộn (clutter) | Hạn chế popup/banner chồng chéo; mỗi màn hình một thông điệp chính → tăng độ nhạy phát hiện thông tin quan trọng (giá, nút mua). |
| `.products-grid`, `ProductCard` | Luật Gestalt (gần nhau, tương tự) | Lưới SP cách đều, gom ảnh+tên+giá+nút thành 1 khối → xử lý toàn diện. |

> **Trạng thái:** badge tồn kho + overlay hết hàng đã làm trong `ProductCard.tsx`.

---

# CHƯƠNG 3 (Bài 3) — Giao tiếp & Trí nhớ

## (A) Lý thuyết cốt lõi
- **Giao tiếp kỹ thuật**: lời nói/âm thanh, văn bản, phi ngôn ngữ (biểu đồ, hình, sơ đồ). Nguyên tắc: rõ ràng, chính xác, **tránh ngôn ngữ mơ hồ** ("nhanh hơn" → "phản hồi tối đa 1 giây").
- **Trí nhớ**: cảm giác (200–500ms) → **làm việc/ngắn hạn** (vài giây–vài phút, ~10–15s) → dài hạn (vô hạn).
- **Dung lượng trí nhớ làm việc ~7 mục** (định luật **Miller 7±2**).
- **Chunking**: chia nhỏ + nhóm thông tin (vd số ĐT `0979.779.178`, mã `KAITO-2025`) → dễ nhớ/nhập.
- **Nhiễu trí nhớ**: nhiễu chủ động & hồi tố; chuỗi ký tự tương tự nhau gây nhầm. → Khuyến nghị: **"hiển thị thay vì bắt nhớ"**, tránh mã có chuỗi ký tự giống nhau.
- **Tải nhận thức**: nội sinh (bản chất nhiệm vụ), **ngoại sinh** (do thiết kế tồi: quá nhiều thông tin, bố cục lộn xộn), lược đồ. → Chia nhỏ thông tin, hiển thị theo giai đoạn.

## (B) Áp dụng vào đâu
| Nơi áp dụng (file thật) | Lý thuyết | Việc cần làm (C) |
|---|---|---|
| `src/pages/Checkout.tsx` + `components/checkout/*` (`CheckoutForm`, `ShippingSelector`, `PaymentStep`...) | Chunking, giảm tải ngoại sinh | Chia checkout thành các bước rõ + **thanh tiến trình "Bước 2/4"**; mỗi bước chỉ hỏi đúng thông tin cần. |
| `src/pages/Products.tsx` (bộ lọc) | Miller 7±2 | Nhóm filter (Size / Màu / Giá / Loại), mỗi nhóm hiển thị **≤ 7 mục** cùng lúc, phần dư cho "xem thêm". |
| `components/layout/RecentlyViewedStrip.tsx` | "Hiển thị thay vì bắt nhớ" | Hiển thị SP vừa xem (đã có `utils/viewedTracker.ts`) → khách không phải nhớ tên/đi tìm lại. |
| `components/checkout/AddressBookSelector.tsx`, `CheckoutForm.tsx` | Giảm tải ngoại sinh | Tự điền lại địa chỉ đã lưu, không bắt nhập lại mỗi lần. |
| Mã coupon, SKU (`AdminCoupons`, hiển thị ở giỏ) | Chunking, tránh nhiễu | Định dạng coupon chia cụm `KAITO-2025`; tránh SKU chuỗi ký tự na ná nhau gây nhầm. |
| Thông báo lỗi form (`utils/validation.ts`) | Giao tiếp kỹ thuật rõ ràng | Lỗi đặt **ngay cạnh ô sai**, ngôn ngữ đơn giản ("Vui lòng nhập số điện thoại 10 số") thay vì mã lỗi kỹ thuật. |
| `components/chat/*` | Giao tiếp đa kênh | Phản hồi xác nhận hành động (đã đặt hàng, đã thêm giỏ) bằng cả chữ + icon. |

---

# CHƯƠNG 4 (Bài 4) — Hành vi, Động lực & Các định luật thiết kế

## (A) Lý thuyết cốt lõi
- **Đa nhiệm & mất tập trung**: đa nhiệm làm giảm hiệu suất, dễ lỗi → thiết kế nên giảm việc bắt người dùng làm nhiều thứ cùng lúc.
- **Tháp nhu cầu Maslow** (sinh lý → **an toàn** → xã hội → tôn trọng → thể hiện). Dùng trong định vị/định giá SP và thiết kế cửa hàng.
- Các định luật thiết kế (rất quan trọng cho báo cáo):
  - **Hick**: càng nhiều lựa chọn → quyết định càng lâu (logarit).
  - **Fitts**: thời gian chạm mục tiêu phụ thuộc khoảng cách & **kích thước** → nút phải đủ lớn, đặt gần.
  - **Gestalt** (10 nguyên tắc: đồng bộ, gần bên, hợp nhất, liên tục, Prägnanz, đóng kín, bầy đàn, hình–nền, không gian chung, đối xứng).
  - **Jakob Nielsen**: theo chuẩn quen thuộc; người đọc web theo hình chữ **F**.
  - **Parkinson, Murphy** (cái gì hỏng được sẽ hỏng → dự phòng lỗi), **Occam** (đơn giản nhất thường đúng), **Pareto 80/20**.
  - **Doherty**: phản hồi **< 400ms** để tối đa hài lòng & năng suất.
  - **Zeigarnik**: con người nhớ việc **chưa hoàn thành** rõ hơn việc đã xong.

## (B) Áp dụng vào đâu
| Định luật | Nơi áp dụng (file thật) | Việc cần làm (C) |
|---|---|---|
| **Hick** | `components/layout/Header.tsx` (mega-menu) | Giới hạn số mục cấp 1, gom nhóm rõ → giảm thời gian quyết định. |
| **Fitts** | `ProductCard.tsx`, `Cart.tsx`, nút checkout, `ProductVariantModal.tsx` | Nút ≥ 38–44px, đặt gần ngón tay (mobile). **(Đã làm ở ProductCard)** |
| **Gestalt** | `ProductCard.tsx`, `.products-grid`, `Footer.tsx` | Gom khối thông tin liên quan; lưới đều (proximity/similarity). |
| **Doherty (<400ms)** | Thêm giỏ, lọc SP; `components/LoadingSpinner.tsx`, `LazySection.tsx` | Phản hồi tức thì (skeleton/spinner); nút "đã thêm ✓". **(Đã làm)** |
| **Zeigarnik** | `components/layout/NotificationBell.tsx`, `context/CartContext.tsx` | Nhắc "Giỏ còn N sản phẩm chưa thanh toán" → kích thích hoàn tất. |
| **Pareto 80/20** | `src/pages/BestSeller.tsx`, `Home.tsx` | Ưu tiên hiển thị 20% SP bán chạy (tạo ~80% doanh thu). |
| **Occam / đơn giản** | `Checkout.tsx`, các form | Bỏ trường nhập thừa, giữ flow ngắn nhất. |
| **Jakob Nielsen** | Layout tổng (`MainLayout.tsx`, `Header.tsx`) | Giỏ góc phải-trên, logo→Home, bố cục chữ F. |
| **Murphy (dự phòng lỗi)** | `components/ErrorBoundary.tsx`, validation | Giả định người dùng sẽ thao tác sai → chặn & hướng dẫn. |
| **Maslow – an toàn** | `Checkout.tsx`, `PaymentStep.tsx` | Badge "Thanh toán an toàn", chính sách đổi/trả → đáp ứng nhu cầu an toàn. |

> **Trạng thái:** Fitts (touch target) + Doherty (nút "đã thêm ✓") đã làm trong `ProductCard`.

---

# CHƯƠNG 5 (Bài 5) — Thiết kế lấy con người làm trung tâm (HCD)

## (A) Lý thuyết cốt lõi
- **Quy trình HCD 5 bước**: Nghiên cứu người dùng → Xác định yêu cầu → Thiết kế → Đánh giá & tinh chỉnh (lặp) → Triển khai & theo dõi.
- Yếu tố tâm lý cần xét: **nhận thức, cảm xúc, động lực, hành vi**; công thái học nhận thức; nhân trắc học; HCI; yếu tố con người trong an toàn; UX.
- Giáo trình nêu ví dụ **ngành may mặc**: thiết kế theo kích cỡ/vóc dáng, chi tiết dễ mặc/tháo, vật liệu phù hợp — rất sát shop quần áo.
- **7 nguyên tắc thiết kế phổ quát (Universal Design)**: (1) Công bằng (2) Linh hoạt (3) Đơn giản & trực quan (4) Thông tin cảm nhận được (5) Dung sai cho lỗi (6) Ít gắng sức thể chất (7) Kích thước & không gian tiếp cận.

## (B) Áp dụng vào đâu — theo 7 nguyên tắc
| Nguyên tắc | Nơi áp dụng (file thật) | Việc cần làm (C) |
|---|---|---|
| 1. Công bằng | `src/i18n/`, `components/Image.tsx` | Đa ngôn ngữ; **alt text** cho ảnh; tương phản đủ. |
| 2. Linh hoạt | `src/pages/Compare.tsx`, `Wishlist.tsx`, `hooks/useVoiceSearch.ts`, `useImageSearch.ts` | Nhiều cách mua sắm/tìm kiếm: gõ, **giọng nói**, **ảnh**, so sánh, wishlist. |
| 3. Đơn giản & trực quan | `Checkout.tsx`, `Header.tsx` | Bỏ phức tạp thừa, nhất quán với kỳ vọng người dùng. |
| 4. Thông tin cảm nhận được | mọi nút trong `ProductCard.tsx`, `VariantPickerModal.tsx` | `aria-label`, icon + chữ; cảnh báo đa kênh (màu + chữ). **(Đã làm 1 phần)** |
| 5. Dung sai cho lỗi | `components/ErrorBoundary.tsx`, xóa giỏ/địa chỉ, nút hết hàng | Hỏi xác nhận trước khi xóa; **disable nút khi hết hàng**; nút "Hoàn tác". **(Đã làm 1 phần)** |
| 6. Ít gắng sức thể chất | responsive (`styles/responsive-index.css`) | Thao tác 1 tay trên mobile, nút lớn, hạn chế cuộn dài. |
| 7. Kích thước & không gian | grid responsive | Vùng chạm đủ rộng trên mọi thiết bị. |

> **Ý cho báo cáo:** dùng chính `ProductCard.tsx` làm ví dụ minh họa nguyên tắc 2, 4, 5 đã hiện thực.

---

# CHƯƠNG 6 (Bài 6) — An toàn, Sức khỏe & Đối tượng đặc biệt

## (A) Lý thuyết cốt lõi
- **Thiết kế cho đối tượng đặc biệt**: người khiếm thị (màn hình chữ nổi), khiếm thính, khiếm khuyết thể chất, suy giảm ngôn ngữ; **người lớn tuổi** (điện thoại Jitterbug: nút lớn, loa to, giao diện đơn giản, ít menu); **trẻ em** (VN: dưới 16 tuổi).
- **Mô hình thiết kế an toàn (Leveson, 1995)**: an toàn là **yêu cầu thiết kế ngay từ đầu**, phân tích hệ thống, kiểm soát quá trình, quản lý rủi ro.
- **Mô hình dựa trên rủi ro (Kaplan–Garrick, 1981)**: xác định – đánh giá định lượng – kiểm soát rủi ro.
- **Sức khỏe** (cơ thể / tinh thần / môi trường) & **tiện lợi** (giảm bước, tự động lưu, trợ giúp/FAQ, tương thích đa nền tảng).

## (B) Áp dụng vào đâu
| Nơi áp dụng (file thật) | Lý thuyết | Việc cần làm (C) |
|---|---|---|
| Toàn site (accessibility) | Đối tượng đặc biệt | Hỗ trợ screen-reader, `hooks/useFocusTrap.ts` cho modal, focus rõ, chữ đủ lớn, tương phản WCAG. Shop đồ trẻ em → người mua là **phụ huynh, ông bà** (lớn tuổi) → giao diện đơn giản kiểu Jitterbug. |
| `src/pages/ProductDetail.tsx` | Trẻ em – đối tượng đặc biệt | **Bảng size theo tuổi/chiều cao/cân nặng** cho đồ trẻ em → chọn đúng size, giảm đổi trả. |
| Mô tả SP (`AdminProducts`, ProductDetail) | Sức khỏe người dùng cuối | Ghi rõ **chất liệu an toàn cho da bé**, tiêu chuẩn, hướng dẫn giặt. |
| `src/pages/Login.tsx`, `API.Auth` (`AuthController`, `StaffAuthController`) | Leveson – an toàn từ thiết kế | Khóa sau N lần sai, mã hóa mật khẩu, 2FA cho admin; xác thực email (`VerifyEmail.tsx`). |
| Backend đặt hàng/thanh toán | Kaplan–Garrick | Đánh giá & kiểm soát rủi ro giao dịch (validate tồn kho khi đặt, chống đặt trùng). |
| Tiện lợi | `tokenStorage.ts`, `AddressBookSelector` | Nhớ đăng nhập, lưu địa chỉ, FAQ/hỗ trợ qua chat. |

---

# CHƯƠNG 7 (Bài 7) — Tối ưu hóa thiết kế (giàu số liệu cho báo cáo)

## (A) Lý thuyết cốt lõi — 5 hướng tối ưu, kèm **số liệu nghiên cứu**
1. **Giao diện người–máy**: bàn phím cảm ứng — **Parhi 2006**: phím lớn → nhập nhanh **+20%**, chính xác **+12%**.
2. **Trải nghiệm người dùng**: camera điện thoại — **Schreiner 2018**: chụp nhanh **+25%**, hài lòng **+30%**.
3. **Yếu tố con người trong vận hành/bảo trì**: bảng điều khiển máy bay — **Wickens 2015**: giảm **20%** thời gian tìm thông tin, giảm **15%** lỗi, tăng **25%** tin tưởng.
4. **Hệ thống người–máy**: xe tự lái — **de Winter 2014**: an toàn/tin tưởng **+35%**, giảm **25%** lỗi giám sát.
5. **Yếu tố tâm lý–xã hội**: môi trường nhà máy — **Vischer 2007**: giảm **20%** nghỉ ốm, **+30%** hài lòng, **+15%** năng suất.

## (B) Áp dụng vào đâu
| Nơi áp dụng (file thật) | Số liệu tham chiếu | Việc cần làm (C) |
|---|---|---|
| `components/VariantPickerModal.tsx`, `product/ProductVariantModal.tsx` | Parhi 2006 (+20%/+12%) | Tăng kích thước nút chọn **size/màu** trên cảm ứng → nhập nhanh & chính xác hơn. |
| `src/pages/Checkout.tsx` | Wickens 2015 (-20% thời gian, -15% lỗi) | Bố cục logic, mã màu/biểu tượng cho bước & lỗi → giảm thời gian, giảm sai sót. |
| `components/chat/*` | UX (+hài lòng) | Trợ lý ảo phản hồi nhanh, gợi ý SP. |
| `Home.tsx` / landing | Cơ sở định lượng | **A/B test** bố cục/CTA → lấy số liệu thực cho phần "Kết quả & đánh giá". |

> **Đây là chương giàu số liệu nhất** → dùng để viết phần **đánh giá định lượng** trong báo cáo.

---

# CHƯƠNG 8 (Bài 8) — Quản lý & Tổ chức lao động khoa học

## (A) Lý thuyết cốt lõi
- **Taylor – Quản lý khoa học**: phân tích & **tiêu chuẩn hóa công việc**, chọn/huấn luyện nhân viên, **lương theo hiệu suất**, **phân chia trách nhiệm rõ** giữa quản lý và người làm.
- **Von Bertalanffy – Lý thuyết hệ thống**: hệ thống = các phần tử liên kết, có **ranh giới**, **phản hồi**, tính toàn thể, thứ bậc, cân bằng động.
- **Herzberg – 2 yếu tố**: động lực **nội tại** (công việc thú vị, công nhận, phát triển) vs **ngoại tại** (lương, phúc lợi, điều kiện làm việc).
- **Lewin – B = f(P, E)**: hành vi = hàm của con người & môi trường; mô hình thay đổi 3 bước (rã đông → thay đổi → đông cứng).
- **Phân tích nhiệm vụ & thiết kế công việc**: chia nhiệm vụ chính → bước nhỏ → xác định kỹ năng; xét tải trí óc, cảnh giác, ra quyết định, lỗi con người, nhận thức tình huống, tự động hóa.

## (B) Áp dụng vào đâu — **trang Admin & kiến trúc hệ thống**
| Nơi áp dụng (file thật) | Lý thuyết | Việc cần làm (C) |
|---|---|---|
| `src/admin/Dashboard.tsx`, `components/admin/*` | Taylor – phân tích nhiệm vụ | Sắp xếp workflow theo nhiệm vụ: Đơn hàng / Kho / Sản phẩm / Báo cáo; gom thao tác hay dùng. |
| `src/admin/AdminOrders.tsx`, `AdminInventory.tsx`, `AdminStockReceipts.tsx` | Taylor – tiêu chuẩn hóa, giảm thao tác lặp | Quy trình xử lý đơn theo trạng thái chuẩn; tự động hóa cập nhật tồn kho khi nhập/bán → giảm lỗi. |
| `src/admin/AdminStaff.tsx`, `AdminRoles.tsx`, backend `StaffManagementController` | Taylor – phân chia trách nhiệm (RBAC) | Phân quyền rõ theo vai trò → mỗi nhân viên thấy đúng phần việc. |
| Kiến trúc microservices (`API.Auth`, `API.Admin`, Gateway) | Von Bertalanffy – hệ thống | Các service tách bạch, ranh giới rõ, giao tiếp qua API → minh họa "tính hệ thống, thứ bậc". |
| `src/admin/AdminInventoryAlerts.tsx` | Nhận thức tình huống + cảnh giác | Cảnh báo tồn kho thấp để nhân viên ra quyết định nhập hàng kịp thời. |
| Thưởng theo doanh số (báo cáo) | Herzberg + Taylor | `AdminReports.tsx` thống kê hiệu suất bán → cơ sở cho lương/thưởng theo thành tích. |

---

# CHƯƠNG 9 (Tuần 9 / Bài 9) — Môi trường làm việc, Tương tác người–máy & Mô phỏng

## (A) Lý thuyết cốt lõi
- **Môi trường vật lý** (có số liệu): ánh sáng tự nhiên (+15% năng suất văn phòng), nhiệt độ tối ưu 22–24°C (giảm 12% lỗi), tiếng ồn cao 70dB (giảm 15–20% hiệu suất). Yếu tố **tâm lý–xã hội**: quan hệ đồng nghiệp, văn hóa tổ chức, phong cách quản lý.
- **HMI** & **5 loại tương tác người–máy**: (1) điều khiển trực tiếp (2) giám sát (3) **qua giao diện GUI** (4) hợp tác (5) tự động hóa.
- Mô hình nghiên cứu: **Norman – vòng lặp hành động** (thu hẹp *gulf of execution* & *evaluation*), **GOMS**, **SEEV**, **SRK** (Skill–Rule–Knowledge — phù hợp nhiều trình độ).
- **Xu hướng tương lai**: tự động hóa, **AI** (học hành vi người dùng, dự đoán nhu cầu), VR/AR, hợp tác người–máy.
- **Mô phỏng (HPM)**: dự đoán/phân tích hiệu suất con người với hệ thống.

## (B) Áp dụng vào đâu
| Nơi áp dụng (file thật) | Lý thuyết | Việc cần làm (C) |
|---|---|---|
| Toàn storefront | Định vị **interface-based GUI** | Khẳng định trong báo cáo: hệ thống thuộc loại tương tác **qua giao diện GUI**. |
| Mọi nút/flow (`ProductCard`, `Checkout`) | **Norman – vòng lặp hành động** | Mỗi hành động có phản hồi rõ (loading, toast, đổi trạng thái nút) → thu hẹp gulf of evaluation. |
| `components/chat/*`, `context/ChatContext.tsx`, `services/chatHub.ts` | Xu hướng AI trong HMI | Gợi ý SP/trả lời tự động → minh họa HMI hiện đại. |
| `src/admin/*` | **SRK** | Hỗ trợ cả nhân viên mới (rule/wizard) lẫn người thạo (phím tắt, thao tác nhanh). |
| `services/api/*`, `apiClient.ts` | Hiệu suất tương tác | Tối ưu thời gian phản hồi API (liên hệ Doherty <400ms). |
| `src/admin/AdminSettings.tsx` (nếu áp cho môi trường nhân viên) | Môi trường vật lý (gián tiếp) | Khuyến nghị nơi làm việc admin: ánh sáng/nhiệt độ/tiếng ồn — dùng số liệu Bài 9 cho phần báo cáo. |

---

# CHƯƠNG 10 (Bài 10) — Quản lý rủi ro & Đánh giá lao động

## (A) Lý thuyết cốt lõi
- **Căng thẳng & quá tải nhận thức**: nguồn gốc (công việc, đồng nghiệp, tổ chức, cá nhân). Chiến lược: **thiết kế công việc hợp lý**, giảm tải, giao tiếp rõ, đủ nguồn lực.
- **Phân loại lỗi & tai nạn**: lỗi thiết bị, thiếu đào tạo, quá sức, quản lý kém, môi trường, **lỗi con người** (slip/mistake).
- **Phòng ngừa**: đào tạo, thiết kế môi trường an toàn, **văn hóa an toàn**, **hệ thống theo dõi & đánh giá tai nạn**, dán nhãn khu vực nguy hiểm.
- **Phương pháp 5S/6S** (thêm yếu tố Safety).

## (B) Áp dụng vào đâu
| Nơi áp dụng (file thật) | Lý thuyết | Việc cần làm (C) |
|---|---|---|
| Toàn flow mua hàng (`Checkout.tsx`, `Cart.tsx`) | Giảm quá tải nhận thức của **khách** | Bớt bước, bớt trường bắt buộc → giảm "căng thẳng" → giảm tỉ lệ **bỏ giỏ**. |
| `Checkout.tsx`, `utils/validation.ts` | Phòng lỗi con người (slip/mistake) | Validate sớm, báo lỗi rõ, cho sửa dễ, không xóa dữ liệu đã nhập khi lỗi. |
| `components/ErrorBoundary.tsx` | Dung sai lỗi + theo dõi sự cố | Bắt lỗi runtime, thông báo thân thiện + lối thoát (về trang chủ). |
| Backend (Admin/Orders logs) | Hệ thống theo dõi & đánh giá tai nạn | Log lỗi đơn hàng/thanh toán để truy vết, phòng ngừa lặp lại. |
| `src/admin/AdminInventoryAlerts.tsx`, `AdminInventoryHistory.tsx` | Phòng ngừa rủi ro vận hành | Cảnh báo tồn kho thấp, lịch sử thay đổi kho → giám sát như "khu vực nguy hiểm". |
| Hành động nguy hiểm trong Admin (xóa SP/đơn/khách) | Văn hóa an toàn, phòng thao tác sai | **Hỏi xác nhận** + log người thực hiện trước khi xóa. |

---

# TỔNG HỢP: Ưu tiên triển khai (cho code + báo cáo)

**Đã làm (trong `ProductCard.tsx` + `product-card-ivy.css`):**
1. ✅ Tín hiệu tồn kho "Hết hàng / Chỉ còn X" (C2 – phát hiện tín hiệu).
2. ✅ Fitts (tăng touch target) + Doherty (nút "đã thêm ✓") (C4).
3. ✅ Dung sai lỗi (disable khi hết hàng) + aria-label + nút so sánh (C5).

**Đã làm (Checkout flow - Cart, Checkout, PaymentStep, OrderCompleted):**
4. ✅ Thanh tiến trình "Bước n/4" rõ ràng với header mô tả (C3 - Chunking, C7 - Wickens, C10 - giảm quá tải).
5. ✅ Chia checkout thành 4 bước logic với feedback tiến trình tại mỗi bước (C3, C4 - Zeigarnik).

**Đã làm (ProductListPage - bộ lọc):**
6. ✅ Nhóm màu sắc theo Miller 7±2: 7 màu phổ biến + nút "Xem thêm" (C3 - Miller, C4 - Hick).
7. ✅ Size giới hạn 5 mục (phù hợp Miller 7±2) (C3).

**Đã làm (ProductDetail - Đối tượng đặc biệt trẻ em):**
8. ✅ Bảng size trẻ em theo tuổi/chiều cao/cân nặng (C6 - Đối tượng đặc biệt).
9. ✅ Thông tin chất liệu an toàn cho da bé (OEKO-TEX, hướng dẫn giặt) (C6 - Sức khỏe).

**Đã làm (Variant Modals - Tối ưu theo Parhi 2006):**
10. ✅ Tăng kích thước nút chọn size/màu: padding 12px 18px, minHeight 48px (C7 - Parhi 2006: +20% tốc độ, +12% chính xác).
11. ✅ Áp dụng cho cả ProductVariantModal và VariantPickerModal + CSS.

**Đã làm (Hiệu ứng Zeigarnik - Nhắc giỏ hàng):**
12. ✅ Tooltip "Giỏ còn N SP chưa thanh toán" hiển thị khi hover vào icon giỏ hàng (C4 - Zeigarnik).
13. ✅ Animation nhẹ sau 3s để thu hút chú ý (SEEV - Salience).
14. ✅ CSS responsive với gradient đẹp, shadow, và mũi tên tooltip.
15. ✅ Files: `Header.tsx` (logic), `style.css` (CSS tooltip).

**Nên làm tiếp — tác động cao, dễ minh họa trong báo cáo:**
| Ưu tiên | Việc | Chương | File | Trạng thái |
|---|---|---|---|---|
| ⭐⭐⭐ | Thanh tiến trình "Bước n/4" + chia bước rõ | C3, C7, C10 | `Checkout.tsx`, `components/checkout/*` | ✅ **XONG** |
| ⭐⭐⭐ | Nhóm bộ lọc theo Miller 7±2 + Hick | C3, C4 | `Products.tsx`, `ProductListPage.tsx` | ✅ **XONG** |
| ⭐⭐ | Bảng size trẻ em theo tuổi/chiều cao + chất liệu | C6 | `ProductDetail.tsx` | ✅ **XONG** |
| ⭐⭐ | Tăng nút chọn size/màu (số liệu Parhi +20%) | C7 | `VariantPickerModal.tsx`, `ProductVariantModal.tsx` | ✅ **XONG** |
| ⭐⭐ | Nhắc giỏ hàng chưa thanh toán (Zeigarnik) | C4 | `Header.tsx`, `style.css` | ✅ **XONG** |
| ⭐ | Accessibility: aria, tương phản, focus-trap modal | C5, C6 | toàn site, `useFocusTrap.ts` | Một phần đã có |
| ⭐ | Admin: cảnh báo tồn kho + xác nhận hành động xóa | C8, C10 | `AdminInventoryAlerts.tsx`, các trang xóa | 🔄 Sau |

---

*Tài liệu phân tích phục vụ môn Tâm lý học Kỹ thuật — dự án KaitoKid Shop.*
*Phạm vi: đọc & phân tích đầy đủ Bài 2 → Bài 10. Mọi tên file đều tham chiếu mã nguồn thật trong `kaito-kid-react/` và `BACKEND/`.*
