import { useRef } from "react";
import styles from "./SpotlightCard.module.css";

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(255, 255, 255, 0.25)" }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  // Συνδυάζουμε τις css module κλάσεις με τυχόν πρόσθετες κλάσεις από props
  const combinedClassName = [styles.cardSpotlight, className].filter(Boolean).join(" ");

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={combinedClassName}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
