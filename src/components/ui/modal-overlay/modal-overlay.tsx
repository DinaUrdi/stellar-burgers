import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({
  onClick,
  'data-testid': testId
}: {
  onClick: () => void;
  'data-testid'?: string;
}) => <div className={styles.overlay} onClick={onClick} data-testid={testId} />;
