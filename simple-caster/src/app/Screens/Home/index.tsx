import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.scss";

const Home = () => {
  return (
    <ScreenLayout>
      <main className="flex flex-grow items-center">
        <div className={styles.inputContainer}>
          <Image
            src="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/https%3A%2F%2Fi.imgur.com%2FLPzRlQl.jpg"
            width={40}
            height={40}
            alt="User Profile Picture"
            className={`${styles.profilePic} rounded-full`}
          />
          <textarea
            className={styles.userInput}
            placeholder="Say Something"
            rows={5}
          />
          <button className={styles.castButton}>Cast</button>
        </div>
      </main>
    </ScreenLayout>
  );
};

export default Home;
