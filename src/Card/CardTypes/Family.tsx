import styles from './Family.module.css';

const Family = ({ familyMemberName }: { familyMemberName: string }) => {
  // Dynamically import the image from src/assets/vector
  const getImageUrl = (name: string) => {
    return new URL(`../../assets/vector/${name}.png`, import.meta.url).href;
  };

  return <img className={styles.image} src={getImageUrl(familyMemberName)} alt={familyMemberName} />;
};

export default Family;
