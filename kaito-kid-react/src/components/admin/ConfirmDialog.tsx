/**
 * ConfirmDialog - Component xác nhận hành động nguy hiểm
 * Áp dụng TLHKT:
 * - C10 (Phòng ngừa rủi ro): Văn hóa an toàn, phòng thao tác sai
 * - C8 (Taylor): Giảm lỗi con người bằng quy trình xác nhận rõ ràng
 * - C5 (Dung sai cho lỗi): Hỏi xác nhận trước khi thực hiện thao tác phá hủy
 */

import { useEffect, useState } from 'react';
import AdminIcon from './AdminIcon';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'info';
  icon?: string;
  requireTyping?: boolean; // Bắt gõ "XÁC NHẬN" cho thao tác cực kỳ nguy hiểm
  expectedText?: string;
}

interface ConfirmDialogProps {
  open: boolean;
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, options, onConfirm, onCancel }: ConfirmDialogProps) {
  const [typedText, setTypedText] = useState('');
  const {
    title,
    message,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    tone = 'danger',
    icon = 'fa-exclamation-triangle',
    requireTyping = false,
    expectedText = 'XÁC NHẬN',
  } = options;

  // Reset typed text khi dialog mở
  useEffect(() => {
    if (open) {
      setTypedText('');
    }
  }, [open]);

  // Keyboard shortcut: ESC để hủy
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const canConfirm = !requireTyping || typedText === expectedText;
  const toneColors = {
    danger: { bg: '#fee2e2', border: '#fecaca', icon: '#dc2626', button: '#dc2626' },
    warning: { bg: '#fef3c7', border: '#fde68a', icon: '#f59e0b', button: '#f59e0b' },
    info: { bg: '#dbeafe', border: '#bfdbfe', icon: '#3b82f6', button: '#3b82f6' },
  };
  const colors = toneColors[tone];

  return (
    <div
      className="confirm-dialog-overlay"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.15s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          maxWidth: 480,
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'slideUp 0.2s ease-out',
        }}
      >
        {/* Icon + Title */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: colors.bg,
              border: `2px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.icon,
              fontSize: 20,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <AdminIcon name={icon} />
          </div>
          <div style={{ flex: 1 }}>
            <h3
              id="confirm-dialog-title"
              style={{
                margin: '0 0 8px',
                fontSize: 18,
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              {title}
            </h3>
            <p
              id="confirm-dialog-message"
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: '#475569',
              }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* TLHKT C10: Yêu cầu gõ text cho thao tác cực kỳ nguy hiểm */}
        {requireTyping && (
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="confirm-typing-input"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#64748b',
                marginBottom: 6,
              }}
            >
              Để xác nhận, vui lòng gõ: <strong style={{ color: colors.icon }}>{expectedText}</strong>
            </label>
            <input
              id="confirm-typing-input"
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={expectedText}
              autoFocus
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${canConfirm ? '#16a34a' : '#cbd5e1'}`,
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              aria-label={`Gõ ${expectedText} để xác nhận`}
            />
            {typedText && !canConfirm && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>
                Vui lòng gõ chính xác "{expectedText}"
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            style={{
              padding: '10px 20px',
              background: canConfirm ? colors.button : '#cbd5e1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (canConfirm) {
                e.currentTarget.style.filter = 'brightness(0.9)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
            }}
            aria-disabled={!canConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
