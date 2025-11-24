import styles from './Family.module.css';

const Family = ({ familyMemberName }: { familyMemberName: string }) => {
  return <img className={styles.image} src={`/assets/vector/${familyMemberName}-vector.png`} alt={familyMemberName} />;
};

export default Family;
