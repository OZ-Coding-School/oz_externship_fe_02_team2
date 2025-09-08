// Badge 스타일 정의
export const getBadgeStyles = (
  variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline',
  size: 'sm' | 'md' | 'lg'
) => {
  // 기본 스타일
  const baseStyles = 'inline-flex items-center justify-center rounded-full transition-colors';
  
  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-2 py-0.5 body-xs font-medium',
    md: 'px-2.5 py-1 body-sm font-medium',
    lg: 'px-3 py-1.5 body-base font-medium',
  };

  // 변형별 스타일
  const variantStyles = {
    // Default - 회색 계열
    default: 'bg-gray-100 text-gray-600',
    
    // Primary - 메인 컬러
    primary: 'bg-primary-100 text-primary-500',
    
    // Secondary - 회색 계열
    secondary: 'bg-gray-100 text-gray-500',
    
    // Success - 초록색 계열
    success: 'bg-success-100 text-success-600',
    
    // Warning - 경고 색상 (primary와 동일)
    warning: 'bg-primary-100 text-primary-500',
    
    // Danger - 빨간색 계열
    danger: 'bg-danger-100 text-danger-600',
    
    // Info - 파란색 계열 (회색 계열 사용)
    info: 'bg-gray-200 text-gray-600',
    
    // Outline - 테두리만
    outline: 'bg-transparent text-gray-600',
  };

  return [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant]
  ].join(' ');
};