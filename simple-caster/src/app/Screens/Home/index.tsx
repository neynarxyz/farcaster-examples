import ScreenLayout from "../layout";
import styles from "./index.module.scss";

const Home = () => {
  return (
    <ScreenLayout>
      <div className={`${styles.inputContainer} flex-grow`}>
        <textarea
          // type="text"
          className={styles.userInput}
          placeholder="Say Something"
        />
        <button className={styles.castButton}>Cast</button>
      </div>
    </ScreenLayout>
  );
};

export default Home;
