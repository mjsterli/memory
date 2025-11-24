import React, { useState } from 'react';
import adrianaVector from '../../assets/vector/adriana-vector.png';
import antoineVector from '../../assets/vector/antoine-vector.png';
import daddyVector from '../../assets/vector/daddy-vector.png';
import isaacVector from '../../assets/vector/isaac-vector.png';
import mommyVector from '../../assets/vector/mommy-vector.png';
import styles from './Family.module.css';

const vectorMap: Record<string, string> = {
  adriana: adrianaVector,
  antoine: antoineVector,
  daddy: daddyVector,
  isaac: isaacVector,
  mommy: mommyVector,
};

const Family = ({ familyMemberName }: { familyMemberName: string }) => {
  const [src, setSrc] = useState(vectorMap[familyMemberName] || '');

  return <img className={styles.image} src={src} alt={familyMemberName} onError={() => setSrc('')} />;
};

export default Family;
