import styles from './ShinyText.module.css';

const ShinyText = ({ text, disabled = false, speed = 2, className = '' }) => {
  const animationDuration = `${speed}s`;

  const classes = [
    styles.shinyText,
    disabled ? styles.disabled : null,
    className, 
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{ animationDuration }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
