import styles from "./index.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  rightIcon?: React.ReactNode;
}

const Button = (props: Props) => {
  const { title, rightIcon } = props;
  return (
    <button {...props} className={styles.button}>
      <span>{title}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
