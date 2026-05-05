function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClass =
    variant === 'secondary'
      ? 'button button--secondary'
      : variant === 'chip'
        ? 'chip-button'
        : variant === 'chip-active'
          ? 'chip-button chip-button--active'
          : 'button';

  return (
    <button type="button" className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default Button;
