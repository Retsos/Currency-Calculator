import styles from './GlitchText.module.css';

const GlitchText = ({
  children,
  speed = 2.5,
  enableShadows = true,
  enableOnHover = false,
  className = '',
}) => {
  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none',
  };

  const hoverClass = enableOnHover ? styles['enable-on-hover'] : '';

  const combinedClassName = [styles.glitch, hoverClass, className].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClassName}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
};

export default GlitchText;